---
draft: false
title: "Concurrency in Go, part 3: quit channels and a concurrent search"
description: "How a quit channel stops a goroutine, the daisy-chain, and a worked example that turns a slow sequential search into a fast, replicated one."
date: 2022-10-11
github_id: mirageruler
authors:
  - mirageruler
slug: go-concurrency-quit-channels-search
announce: false
series: go-concurrency
series_part: 3
series_total: 3
---

This part finishes the toolkit with the quit channel, which tells a goroutine to stop, and the daisy-chain of goroutines. It then applies every pattern from part 2 to one problem: a toy search that queries several back ends. Version 1.0 runs them one after another, version 2.1 runs them concurrently with a timeout, and version 3.0 replicates each back end so the first answer wins. The summary collects the lessons from all three parts.

> Part 3 of 3 in the Go concurrency series. Previous: [Concurrency in Go, part 2: goroutines, channels, select and timeouts](go-concurrency-channels-select.md)

## Quit channel

Another thing we can do with the `select` statement is instead of using a timeout, we could actually deterministically says something like: "OK, I'm done, stop now.". We can turn this around and tell `Bob` to stop when we're tired of listening to him.

```go
func main() {
	rand.Seed(time.Now().UnixNano())
	quit := make(chan bool)  // channel type is not important, I just picked bool for light weight messages
	c := boring("Bob", quit)
	for i := rand.Intn(10); i >= 0; i-- {
		fmt.Println(<-c)
	}
	quit <- true
}

func boring(msg string, quit chan bool) <-chan Message {
	c := make(chan Message)
	go func() { // We launch the goroutine from inside the function.
		for i := 0; ; i++ {
			select {
			case c <- Message{str: fmt.Sprintf("%s %d", msg, i)}:
				time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
// do nothing
			case <-quit:
				return
			}
		}
	}()
	return c // Return the channel to the caller.
}
```

After we've pritned as many times as `Bob` has to say, we signal him and say: "OK, I'm done" with `quit <- true`, so at that point, the second case of the `select` statement inside the inner loop of the `boring` function can proceed because the first case is not communicating and will eventually stop.

Actually, there's a problem with this model, though. Because in here, in this case, what if after the work load is done (`case <-quit`), he needs to do something inside there to clean up things? Remember that when main returns from a Go program, the whole thing shuts down. Maybe he's got to remove some temporary files or something like that. We want to make sure that he's finished before we really exit, so we need to do a slightly more sophisticated communication.

## Receive on quit channel

How do we know it's finished? Wait for it to tell us it's done: receive on the quit channel.

```go
func main() {
	rand.Seed(time.Now().UnixNano())
	quit := make(chan string)
	c := boring("Bob", quit)
	for i := rand.Intn(10); i >= 0; i-- {
		fmt.Println(<-c)
	}
	quit <- "Bye!"
	fmt.Printf("Bob says: %q\n", <-quit)
}

func boring(msg string, quit chan string) <-chan Message {
	c := make(chan Message)
	go func() { // We launch the goroutine from inside the function.
	for i := 0; ; i++ {
		select {
		case c <- Message{str: fmt.Sprintf("%s %d", msg, i)}:
			time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
			// do nothing
		case <-quit:
			cleanup()
			quit <- "See you!"
			return
		}
	}
	}()
	return c // Return the channel to the caller.
}
```

It's very easy to do that. We just turn around and say to `Bob`, send me a message back when you're done. In this case, we say "Bye!" but then `Bob` gets the message on the quit statement, does a cleanup, then tells you: "Ok, I'm done". This gives synchronization for 2 goroutines, to make their sure that they're both where they want to be. So in this case, you see the caller tell `Bob` "Bye!" Then the `<-quit` fires, `Bob` do whatever cleanup is required and then respond but now `Bob` is telling the caller that he's done for sure, so it's safe for the caller to exit. We call this is a round-trip communication.

## Daisy-chain

Speaking of round-trips, we can also make this crazy by having a ridiculously long sequence of goroutines, one talking to another one.

Think of it like this

![](assets/unexpected-pitfalls-and-some-handy-patterns-with-concurrency-in-go_daisy-chain-pattern.webp)

We've got a bunch of gophers who want to do a Chinese Whispers game. You see the idea, here the first guy (on the right most at the top) sends a message to the next left one, and keep forwards it in the same direction until the last guy receives the message then prints it out. Firstly, I want to stress that this is not a loop, this is just going all the way around the chain, back to the answer here.

```go
func gopher(left, right chan int) {
	left <- 1 + <-right
}

func main() {
	const goroutines = 100000
	leftmost := make(chan int)
	right := leftmost
	left := leftmost
	for i := 0; i < goroutines; i++ {
		right = make(chan int)
		go gopher(left, right)
		left = right
	}
	go func(c chan int) { c <- 1 }(right)
	fmt.Println(<-leftmost) // 100001
}
```

The `gopher` func receives value from the right then send to the left. The whole idea is actually sort of subtle, and I don't want to explain it all. But all it does is bassically construct the above diagram using channels to send the answers along. Then everbdy's waiting for the first thing to be sent, so we launch the value into the first channel and then wait for it to come out to the `leftmost` goroutine.

For the sake of fun, you can try to run the above snippet then see how long it takes to do 100,000 goroutines and all the communication.

## Example: Google Search

So far, everything we've been doing is very toy-like. What we're going to do is buid sort of a Google search engine, it's still going to be a toy, obviously we can't develop a Google search engine in less than an hour.

Think about what a Google search does, if you're going to the Google web page and you run a search, you get a bunch of answers back. Some might be web pages, there could be videos, there could be song clips, or weather reports, ads, or whatever, so there's a bunch of independently executing **back ends** that are looking at that search for you and finding results that are interesting. So in parallel, you want to send all of these things out to the **back ends** then gather all the answers back and deliver them. How do we actually structure that

```go
type Search func(query string) Result

func fakeSearch(kind string) Search {
	return func(query string) Result {
		time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
		return Result(fmt.Sprintf("%s result for %q\n", kind, query))
	}
}

type Result string
```

Well, let's fake it, completely. Let's construct a thing caleld a `fakeSearch`, all our `fakeSearch` is going to do is sleep for a while then return whatever the fake answer is that it wants, which is very uninteresting, it says, here's your result. But the point is that there's multiple of them. Notice here, this `Search` is a new type of a function that takes a query an returns a `Result`, so that's sort of a type definition for what a search actually does. We construct these functions for a web, an image, and a video service. Very simple, all they do is pause for a while, then print. They're set to wait for up to 100 milliseconds.

## Google Search 1.0

The `Google` function takes a query and returns a slice of `Result` (which are just strings). `Google` invokes Web, Image, Video searches serially, appending them to the result slice.

```go
func Google(query string) (results []Result) {
	Web := fakeSearch("web")
	Image := fakeSearch("image")
	Video := fakeSearch("video")
	return append(results, Web(query), Image(query), Video(query))
}
```

Let's test the frame work

```go
func main() {
	rand.Seed(time.Now().UnixNano())
	start := time.Now()
	results := Google("golang")
	elapesed := time.Since(start)
	fmt.Println(results)
	fmt.Println(elapesed)
}
```

We start the timer, get the results from the search, then print out how long it took. Remember each of these goroutines could take up to about 100 milliseconds, so we could see up to, like 300 milliseconds, maybe.

```
[web result for "golang"
 image result for "golang"
 video result for "golang"
]
106.673291ms
```

106 millisecond, that was the quick one.

The problem is that if you think about it, this is running one goroutine, waiting for his answer to come back, running another one, waiting for his anwser to comeback, running a third one, waiting for his answer to come back. Well, you know where this is going, why don't we launch them in goroutines.

```go
func Google(query string) (results []Result) {
	Web := fakeSearch("web")
	Image := fakeSearch("image")
	Video := fakeSearch("video")
	c := make(chan Result)
	go func() { c <- Web(query) }()
	go func() { c <- Image(query) }()
	go func() { c <- Video(query) }()

	for i := 0; i < 3; i++ {
		result := <-c
		results = append(results, result)
	}
	return
}
```

Now for each of the **back ends**, we independently launch a goroutine to do the search, we got the **fan-in** pattern that gets the data back on the same channel then we can just print them out as they arrive. So they're going to come out of order now, but we're going to get all 3 of them back. But they're running concurrently, and actually in parallel in this case so we don't have to wait around nearly as long.

```
[image result for "golang"
 video result for "golang"
 web result for "golang"
]
46.304875ms
```

Now we're really only waiting for the single slowest web search. Notice that this is a parallel program now with multiple **back ends** running. But we don't have any mutexes or locks or condition variables or callbacks. The model of Go's concurrency is taking care of the intricacy of setting up and running this safely.

## Google Search 2.1

Now sometimes, servers take a long time, they can be really, really slow. Remember, we set these up for 100 milliseconds. Once in a while, an individual search might take more than 80 milliseconds. Let's say we don't want to wait more than a total of 80 milliseconds for the whole thing to run. We want to use the _timeout_ pattern now.

```go
func Google(query string) (results []Result) {
	Web := fakeSearch("web")
	Image := fakeSearch("image")
	Video := fakeSearch("video")
	c := make(chan Result)
	go func() { c <- Web(query) }()
	go func() { c <- Image(query) }()
	go func() { c <- Video(query) }()

	timeout := time.After(80 * time.Millisecond)
	for i := 0; i < 3; i++ {
		select {
		case result := <-c:
			results = append(results, result)
		case <-timeout:
			fmt.Println("timed out")
		return
		}
	}
	return
}
```

So here we got the **fan-in** pattern, and the `timeout` for the whole conversation.

```
[image result for "golang"
 video result for "golang"
 web result for "golang"
]
19.336541ms
```

With version 2.1 the results seems even better, they typically 80 milliseconds of less, which is what they should be, because we never wait. But if we run this piece of code enough, we can observe some result like

```
timed out
[]
80.221375ms
timed out
[image result for "golang"
]
81.199333ms
```

Here, we timed out because, in this case, all 2 queries took too long. So we got back only the "image" result. We didn't get the other 2. That's a kind of nice idea. We know that we're going to be able to get you an answer within 80 milliseconds.

However, timing out a communication is kinda annoying. What if the server really is going to take a long time?

## Avoid timeout (using Replication)

Q: How do we avoid discarding results from the slow servers?
A: Replicate the servers. Send requests to multiple replicas, then use the first response.

If we run 3 instances of the service, say, or 5, then one of them is likey to comeback before the timeout expires. If only one of them is having a problem, the other ones can all be efficient. So how do we structure that?

```go
func First(query string, replicas ...Search) Result {
	c := make(chan Result)
	searchReplica := func(i int) { c <- replicas[i](query) }
	for i := range replicas {
		go searchReplica(i) // See, all these guys are going to the channel
	}
	return <-c  // But only the first - earliest one can come back
}
```

Well, here's our familiar pattern by now. We actually write a function called `First` that takes a query and a set of `replicas`. We make a channel of `Result`, launch the same search multiple times then return the first one that come back. So this will give us the first result from all those back end guys.

## Using the first function

Here's a simple use of it, where we run 2 replicas.

```go
func main() {
	rand.Seed(time.Now().UnixNano())
	start := time.Now()
	results := First("golang",
		fakeSearch("replica 1"),
	  . fakeSearch("replica 2"))
	elapesed := time.Since(start)
	fmt.Println(results)
	fmt.Println(elapesed)
}
```

```
replica 2 result for "golang"
118.833µs
```

You can see, it's which ever one comes back first. For fun and demonstration, after running this several times I got the result from `replica 2` within `118.833µs`.

With this little tool, now, we can build the next piece, which is to stitch all of these little magic together.

## Google Search 3.0

Now this is full on, it's got everything in it.

```go
func Google(query string) (results []Result) {
	Web1 := fakeSearch("web")
	Web2 := fakeSearch("web")
	Image1 := fakeSearch("image")
	Image2 := fakeSearch("image")
	Video1 := fakeSearch("video")
	Video2 := fakeSearch("video")
	c := make(chan Result)
	go func() { c <- First(query, Web1, Web2) }()
	go func() { c <- First(query, Image1, Image2) }()
	go func() { c <- First(query, Video1, Video2) }()
	timeout := time.After(80 * time.Millisecond)
	for i := 0; i < 3; i++ {
		select {
		case result := <-c:
			results = append(results, result)
		case <-timeout:
			fmt.Println("timed out")
			return
		}
	}
	return
}
```

It has the **fan-in** function, it's got the replicated **back end** stuffs, it's got a timeout on everybody. We should, with very, very high probability now, get all 3 of our web search results back in less than 80 milliseconds.

```
[web result for "golang"
 image result for "golang"
 video result for "golang"
]
21.560166ms
```

Try running our new function, you will notice that they're always all 3 there. There's no timeouts. This is obviously a toy example, but you can see how we're using the concurrency ideas in Go to build, really, a fairly sophisticated, parallel, replicated, robust thing. Still no locks, mutexes, callbacks, condition variables, etc.

More important, the individual elements of the program are all just straightforward sequential code. And we were composing their independent executions to give us the behavior of the total server.

## Summary

- Don't communicate by sharing memory, share memory by communicating.
- In just a few simple transfromations we used Go's concurrency primitives to convert a slow, sequential, failure-sensitive (at least we pretended it is) program into one that is fast, concurrent, replicated, robust.
- Goroutines and channels are big ideas and they're tools for program constrction. They're fun to play with, but don't overuse these ideas, because sometimes maybe all you need is just a reference counter like if you only need to count the number of times somebody hits your page.
- Go has `sync` and `sync/atomic` packages that provide mutexes, condition variables, etc. They provide tools for smaller problems.
- Often, these things will work together to solve a bigger problem.
- Always use the right tool for the right job.

## References

- https://www.youtube.com/watch?v=f6kdp27TYZs
- https://go101.org/article/concurrent-common-mistakes.html
- https://pkg.go.dev/time
