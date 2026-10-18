---
draft: false
title: "Concurrency in Go, part 1: unexpected pitfalls"
description: "Five concurrency mistakes that Go programs make even with goroutines and channels: missing synchronization, time.After leaks, misused timers, copied sync values and channel futures."
date: 2022-10-11
github_id: mirageruler
redirect:
  - /lV33jg
authors:
  - mirageruler
series: go-concurrency
series_part: 1
series_total: 3
---

## Preamble

If we look around in the world at large, what you see is a lot of independently executing things like there's people doing their own things out side, there's cars going by, all of those things are independent agents in side the world. If you think about writting a computer program, if you want to simulate or interact with that environment, a single sequential execution is not a very good approach. So concurrency is really a way of writting or structuring your program to deal with the real world, may be simulate the real world or behave as an agent inisde the real world and be a good actor in that environment. By definition, concurrency is defined as the composition of independently executing computations. First of all, I want to stress that concurrency is not parallelism, but today we're not going to talk about this, if you interest, please let me know and I will write one about this topic later on.

**This series has 3 parts.** Each one reads on its own.

1. Unexpected pitfalls (this page)
2. [Goroutines, channels, select and timeouts](go-concurrency-channels-select.md)
3. [Quit channels and a concurrent search](go-concurrency-quit-channels-search.md)

## Unexpected Go concurrency pitfalls

With concurrency primitives built-in to the language. By using the `go` keyword to create goroutines, and by using channels together with other concurrency synchronization techniques provided in Go, concurrent programming become easy, flexible, enjoyable. On the other hand, Go doesn't prevent programmers from making some concurrent programming mistakes which are caused by either carelessness or lacking of experience. Below is some unexpected pitfalls when using the concurrency features provided by the Go programming language.

### No synchronizations when synchronizations are needed

**Take-away**: [Code lines might be not executed by their appearance order.](https://go101.org/article/memory-model.html)
There are 2 mistakes in the following program. - First, the read of `b` in the main goroutine and the write of `b` in the new goroutine might cause data races. - Second, the condition `b == true` can't ensure that `a != nil` in the main goroutine. Compilers and CPUs may make optimizations by reordering instructions in the new goroutine, so the assignment of `b` may happen before the assignment of `a` at run time, which makes that slice `a` is still `nil` when the elements of `a` are modified in the main goroutine.

```go
package main

import (
	"time"
	"runtime"
)

func main() {
	var a []int // nil
	var b bool  // false

	// a new goroutine
	go func () {
		a = make([]int, 3)
		b = true // write b
	}()

	for !b { // read b
		time.Sleep(time.Second)
		runtime.Gosched()
	}
	a[0], a[1], a[2] = 0, 1, 2 // might panic
}
```

The above program may run well on one computer, but may panic on another one, or it runs well when it is compiled by one compiler, but panics when another compiler is used.
We should use channels or the synchronization techniques provided in the `sync` standard package to ensure the memory orders. For example,

```go
package main

func main() {
	var a []int = nil
	c := make(chan struct{})  // The type of channel in this case is not important

	go func () {
		a = make([]int, 3)
		c <- struct{}{}
	}()

	<-c
	// The next line will not panic for sure.
	a[0], a[1], a[2] = 0, 1, 2
}
```

### Not pay attention to too many resources are consumed by calls to the `time.After` function

**Take-away**: Take greate care when using `time.After` function.
The `After` function in the `time` standard package returns [a channel for delay notification](https://pkg.go.dev/time#After). The function is convenient, however each of its calls will create a new value of the `time.Timer` type. The new created `Timer` value will keep alive in the duration specified by the passed argument to the `After` function. If the function is called many times in a certain period, there will be many alive `Timer` values accumulated so that much memory and computation is consumed.

For example, if the following `longRunning` function is called and there are millions of messages coming in one minute, then there will be millions of `Timer` values alive in a certain small period (several seconds), even if most of these `Timer` values have already become useless.

```go
import (
	"fmt"
	"time"
)

// The function will return if a message
// arrival interval is larger than one minute.
func longRunning(messages <-chan string) {
	for {
		select {
		case <-time.After(time.Minute):
			return
		case msg := <-messages:
			fmt.Println(msg)
		}
	}
}
```

To avoid too many `Timer` values being created in the above code, we should use (and reuse) a single `Timer` value to do the same job.

```go
func longRunning(messages <-chan string) {
	timer := time.NewTimer(time.Minute)
	defer timer.Stop()

	for {
		select {
		case <-timer.C: // expires (timeout)
			return
		case msg := <-messages:
			fmt.Println(msg)

			// This "if" block is important.
			if !timer.Stop() {
				<-timer.C
			}
		}

		// Reset to reuse.
		timer.Reset(time.Minute)
	}
}
```

Note: the `if` code block is used to discard/drain a possible timer notification which is sent in the small period when executing the second branch code block in this example is `fmt.Println(msg)` while in real use case it might be some time cost computations.

### Use `time.Timer` values incorrectly

**Take-away**: Take greate care when using `time.Timer` values.
An idiomatic use example of `time.Timer` values has been shown in the last section. Some explanations: - The `Stop` method of a `*Timer` value returns `false` if the corresponding `Timer` value has already expired or been stopped. If the `Stop` method returns `false`, and we know the `Timer` value has not been stopped yet, then the `Timer` value must have already expired. - After a `Timer` value is stopped, its `C` channel field can only contain most one timeout notification. - We should take out the timeout notification, if it hasn't been taken out, from a timeout `Timer` value after the `Timer` value is stopped and before resetting then reusing the `Timer` value. This is the meaningfulness of the `if` code block in the example in the last section.

The `Reset` method of a `*Timer` value must be called when the corresponding `Timer` value has already expired or been stopped, otherwise, a data race may occur between the `Reset` call and a possible notification send to the `C` channel field of the `Timer` value.

If the first `case` branch of the `select` block is selected, it means the `Timer` value has already expired, so we don't need to stop it, for the sent notification has already been taken out. However, we must stop the timer in the second branch to check whether or not a timeout notification exists. If it does exist, we should drain it before reusing the timer, otherwise, the notification will be fired immediately in the next loop step.

For example, the following program is very possible to exit in about one second, instead of ten seconds. More importantly, the program is not data race free.

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	start := time.Now()
	timer := time.NewTimer(time.Second/2)
	select {
	case <-timer.C:
	default:
		// Most likely go here.
		time.Sleep(time.Second)
	}
	// Potential data race in the next line.
	timer.Reset(time.Second * 10)
	<-timer.C
	fmt.Println(time.Since(start)) // about 1s
}
```

A `time.Timer` value can be leaved in non-stopping status when it is not used any more, but it is recommended to stop it in the end.

It is bug prone and not recommended to use a `time.Timer` value concurrently among multiple goroutines.

We should not rely on the return value of a `Reset` method call. The return result of the `Reset` method exists just for compatibility purpose.

### Copy values of the types in the `sync` standard package

**Take-away**: Use pointer when dealing with structs that contain values from the `sync` standard package.
In practice, values of the types (except the `Locker` interface values) in the `sync` standard package [should never be copied](https://pkg.go.dev/sync#pkg-overview). We should only copy pointers of such values.

The following is bad concurrent programming example. In this example, when the `Counter.Value` method is called, a `Counter` receiver value will be copied. As a field of the receiver value, the respective `Mutex` field of the `Counter` receiver value will also be copied. The copy is not synchronized, so the copied `Mutex` value might be corrupted. Even if it is not corrupted, what it protects is the use of the copied field `n`, which is meaningless generally.

```go
import "sync"

type Counter struct {
	sync.Mutex
	n int64
}

// This method is okay.
func (c *Counter) Increase(d int64) (r int64) {
	c.Lock()
	c.n += d
	r = c.n
	c.Unlock()
	return
}

// The method is bad. When it is called,
// the Counter receiver value will be copied.
func (c Counter) Value() (r int64) {
	c.Lock()
	r = c.n
	c.Unlock()
	return
}
```

We should change the receiver type of the `Value` method to the pointer type `*Counter` to avoid copying `sync.Mutex` values.

The `go vet` command provided in Go Toolchain will report potential bad value copies.

### Use channels as futures/promises improperly

In the next section, we will learn some handy concurrency pattern in Go which will have something calls a `Channel Factory` which is a fancy name for Go functions/methods that return a receive-only channels (which is usually called futures/promises) which can actually receive values from it. Assume `fa` and `fb` are two such functions, then the following call uses future arguments improperly.

```go
doSomethingWithFutureArguments(<-fa(), <-fb())
```

In the above code line, the generations of the two arguments are processed sequentially, instead of concurrently. We should modify it as the following to process them concurrently.

```go
ca, cb := fa(), fb()
doSomethingWithFutureArguments(<-ca, <-cb)
```
