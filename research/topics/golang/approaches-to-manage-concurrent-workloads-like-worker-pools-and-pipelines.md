---
draft: false
title: "Managing concurrent workloads in Go, part 1: worker pools and fan-out/fan-in"
description: "Two Go concurrency patterns for handling many tasks safely: the worker pool and fan-out/fan-in, each with a worked example."
date: 2023-05-22
authors:
  - tieubao
tags:
  - engineering
  - golang
  - practice
  - tool
redirect:
  - /84H0BQ
series: go-concurrent-workloads
series_part: 1
series_total: 2
type: research
topic: languages
---

## Introduction

Go provides us great and convenient ways to write concurrent programs with high performance to execute tasks concurrently (perhaps in parallel if the program is run on a machine with multiple physical cores, GOMAXPROCS are automatically set to the number of physical cores of the machine that the program is running on)

While the Go concurrency primitives are easy to work with (it means it's easy to create the Go concurrency primitives and start using them), but they don't prevent us the developers to write something incorrectly or buggy. They should be used with great care and ideally they should be combined together to achieve some concurrency patterns to be fit in different use cases or contexts where we might solve/handle our problems/business concurrently.

Concurrency patterns in Go are different ways to put Go’s concurrency primitives together to build interesting structures and get our code to respond well to a lot of things happening at once. Below are four popular concurrency patterns in Go that helps handle large amount of workloads concurrently in a safe and elegant way.

This post will explain these patterns with a simple example and walk you through the code as well as the decision-making when writing these codes.

**This series has 2 parts.** Each one reads on its own.

1. Worker pools and fan-out/fan-in (this page)
2. [Pipelines, semaphores and goroutine counts](go-workloads-pipelines-semaphores.md)

## The patterns

### The workers pool pattern

The first popular one should be the `workers pool` pattern. Goroutine pools are a way of limiting the number of goroutines that can run concurrently. This pattern involves creating a fixed number of goroutines at startup and then using a channel to queue up work. When a new task arrives, it is added to the channel, and one of the idle goroutines picks it up and executes it.

```go
// worker simply double the number received from the jobs channel and send it to the results channel
func worker(id int, wg *sync.WaitGroup, jobs <-chan int, results chan<- int) {
 defer wg.Done()
 for j := range jobs {
  fmt.Println("worker", id, "processing job", j)
  results <- j * 2
 }
}

func main() {
 const (
  numJobs, numWorkers = 5, 3
 )
 var (
  jobs     = make(chan int, numJobs)
  results  = make(chan int, numJobs)
  workerWg = new(sync.WaitGroup)
 )
 workerWg.Add(numWorkers)

 // Create a pool of 3 workers
 for w := 1; w <= numWorkers; w++ {
  go worker(w, workerWg, jobs, results)
 }

 go func() {
  defer close(results)
  workerWg.Wait()
 }()

 // Add jobs to the queue
 go func() {
  defer close(jobs)
  for j := 1; j <= numJobs; j++ {
   jobs <- j
  }
 }()

 // Collect results from the workers
 for res := range results {
  fmt.Println("RESULT:", res)
 }
}
```

#### The disadvantages of this pattern

#### Limited scalability

The worker pool pattern, with a fixed number of workers, can be limited in terms of scalability. If the workload increases beyond the capacity of the worker pool, performance may suffer. One solution to this problem is to use a **dynamic worker pool**. In a dynamic worker pool, the number of workers varies based on the workload. When there are more tasks to be processed, the pool increases the number of workers, and when the workload decreases, it reduces the number of workers.

To implement a dynamic worker pool, we can use a combination of channels and goroutines. We can create a channel to receive tasks and another channel to send results. We can also create a goroutine that listens to the task channel and assigns tasks to available workers. Each worker is a goroutine that receives a task from the worker channel, processes it, and sends the result back to the result channel. To dynamically adjust the number of workers, we can use a separate goroutine that monitors the workload and adjusts the number of workers accordingly. By using a dynamic worker pool, we can achieve better scalability and utilization of resources. However, it requires careful tuning of parameters such as the workload threshold and the rate of worker creation/destruction to avoid overloading the system or creating too many unnecessary goroutines.

#### Resource management

Managing resources such as memory and CPU usage can be challenging with the worker pool pattern. Since the number of workers is fixed, it can be difficult to optimize resource usage for different types of workloads. If a worker takes too long to complete a task, we can **use a timeout mechanism for tasks**, such that the task can be timed out and reassigned to another worker. This ensures that no worker is blocked for an extended period of time and helps maintain the overall performance of the system.

#### Task prioritization

The worker pool pattern does not provide a built-in mechanism for task prioritization. This means that all tasks are treated equally, regardless of their importance or urgency. We can introduce a **priority queue** data structure to the workers pool pattern. A priority queue is a data structure that stores elements with associated priorities and allows for efficient retrieval of the element with the highest priority.

### The fan-out/fan-in pattern

Fan-out/fan-in is a pattern for parallelizing work across multiple goroutines. The idea is to split the work into smaller chunks and distribute them across a pool of workers. Once all the workers have finished processing their chunks, the results are collected and combined.

Let’s imagine you have a large stream of input data that need to be processed (validate, enrich, transform, etc) and obviously you will not want to do that sequentially then the fan-out/fan-in pattern comes in to help us do this concurrently.

The `fan-out` part of the pattern involves distributing work among multiple worker goroutines. These goroutines work concurrently, each handling a portion of the tasks. This approach helps to increase throughput and process large datasets more efficiently. The `fan-in` aspect of the pattern involves collecting the results from the worker goroutines and combining them into a single output. This process is typically done using a dedicated goroutine that listens to the individual output channels of the workers, merges the results, and sends them to a single output channel.

The fan-out, fan-in pattern is particularly useful in situations where tasks can be divided into smaller, independent units and processed concurrently. This pattern not only improves application performance but also enhances code maintainability and readability by separating the concerns of distributing tasks and aggregating results.

```go
// simulateDownload simulates downloading a file and returns its content.
func simulateDownload(url string) string {
 time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
 return fmt.Sprintf("Content of %s", url)
}

// downloader downloads a list of URLs and returns the content.
func downloader(urls []string) <-chan string {
 out := make(chan string)
 go func() {
  defer close(out)
  for _, url := range urls {
   out <- simulateDownload(url)
  }
 }()
 return out
}

// worker processes the content and returns the number of words.
func worker(in <-chan string) <-chan int {
 out := make(chan int)
 go func() {
  defer close(out)
  for content := range in {
   fmt.Println(time.Now().Format("2006-01-02 15:04:05.000000000 -0700 MST"))
   fmt.Printf("Processing content: %s\\n", content)
   words := strings.Fields(content)
   out <- len(words)
  }
 }()
 return out
}

// merger merges the results from multiple workers.
func merger(ins ...<-chan int) <-chan int {
 out := make(chan int)
 var wg sync.WaitGroup
 wg.Add(len(ins))

 for _, in := range ins {
  go func(in <-chan int) {
   defer wg.Done()
   for n := range in {
    fmt.Printf("Merging result: %d\\n\\n", n)
    out <- n
   }
  }(in)
 }

 go func() {
  defer close(out)
  wg.Wait()
 }()

 return out
}

func main() {
 rand.Seed(time.Now().UnixNano())

 urls := []string{
  "<https://example.com/file1.txt>",
  "<https://example.com/file2.txt>",
  "<https://example.com/file3.txt>",
  "<https://example.com/file4.txt>",
  "<https://example.com/file5.txt>",
 }

 downloadStream := downloader(urls)
 numWorkers := 3

 workerChannels := make([]<-chan int, numWorkers)
 for i := 0; i < numWorkers; i++ {
  workerChannels[i] = worker(downloadStream)
 }

 merged := merger(workerChannels...)

 totalWordCount := 0
 for count := range merged {
  totalWordCount += count
 }

 fmt.Printf("Total word count: %d\\n", totalWordCount)
}
```

Here’s a breakdown of the code:

1. Import necessary packages.
1. Define `simulateDownload(url string)` function, which simulates downloading a file from the provided URL and returns its content as a string.
1. Define `downloader(urls []string)` function, which takes a slice of URLs and returns a channel that sends the content of each URL. It launches a goroutine that iterates over the URLs, simulates the download, and sends the content through the channel. The channel is closed after all URLs have been processed. _It will be_ **_fan-out part_**: the\* `downloader` function creates a single `downloadStream` channel that sends the content of each downloaded file. Later, we will create multiple worker goroutines that listen to this shared channel, effectively fanning out the work to be done concurrently.
1. Define `worker(in <-chan string)` function, which takes a channel of strings as input and returns a channel of integers. It launches a goroutine that reads the content from the input channel, prints the processing timestamp and content, counts the number of words in the content, and sends the count through the output channel. The output channel is closed after all content has been processed.
1. Define `merger(ins ...<-chan int)` function, which takes a variadic parameter of channels with integer values and returns a channel with integer values. It merges the input channels into a single output channel. A `sync.WaitGroup` is used to wait for all input channels to be processed, after which the output channel is closed. _It will be_ **_fan-in part_**: the\* `merger` function combines the results from multiple worker goroutines by listening to their individual output channels. It uses a `sync.WaitGroup` to ensure that it waits for all the worker goroutines to complete before closing its output channel.
1. In the `main` function, seed the random generator, define a slice of URLs, and create a download stream by calling the `downloader()` function.
1. Define the number of workers, create a slice of worker channels, and start the worker goroutines with the download stream as input.
1. Merge the worker channels using the `merger()` function.
1. Iterate over the merged channel to compute the total word count.
1. Print the total word count.

#### The disadvantages of this pattern

**Increased complexity**

The fan-out/fan-in pattern can add complexity to your code, especially if you need to handle errors or timeouts. It can also make it harder to reason about the behavior of your program. To handle errors or timeouts, you can use the **context cancellation**, or use the context package to propagate cancellation signals to all the goroutines involved in the fan-out/fan-in pattern. This can help ensure that resources are released promptly and that your program doesn't hang indefinitely.

**Resource consumption**

Creating too many goroutines can lead to excessive resource consumption, which can cause performance issues or even crashes. This is particularly true if the sub-tasks are short-lived and the overhead of creating and managing goroutines outweighs the benefits. To avoid excessive resource consumption, you can **limit the number of goroutines** that are created at any given time. One way to do this is to use a worker pool, where a fixed number of goroutines are created upfront and then used to process tasks as they become available.

**Synchronization overhead**

Coordinating the results of multiple goroutines can introduce synchronization overhead, which can slow down your program and increase the likelihood of race conditions or deadlocks. If possible, try to design your program so that synchronization is only necessary when aggregating the results of the sub-tasks to **avoid unnecessary synchronization**. For example, you can use channels to pass data between goroutines instead of shared memory, which can reduce the likelihood of race conditions or deadlocks.
