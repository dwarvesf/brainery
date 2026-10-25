---
draft: false
title: "Managing concurrent workloads in Go, part 2: pipelines, semaphores and goroutine counts"
description: "The pipeline and semaphore patterns in Go, and how to choose the number of goroutines for a workload."
date: 2023-05-22
authors:
  - tieubao
tags:
  - engineering
  - golang
  - practice
  - tool
slug: go-workloads-pipelines-semaphores
announce: false
series: go-concurrent-workloads
series_part: 2
series_total: 2
type: research
topic: languages
---

Part 1 covered the worker pool and fan-out/fan-in patterns. This part adds two more: the pipeline, which chains processing stages, and the semaphore, which caps how many goroutines run at once. It closes with how to choose the number of goroutines for a given workload.

> Part 2 of 2 in the Go concurrent workloads series. Previous: [Managing concurrent workloads in Go, part 1: worker pools and fan-out/fan-in](approaches-to-manage-concurrent-workloads-like-worker-pools-and-pipelines.md)

## The pipeline pattern

A pipeline is a series of stages that takes in data, processes them, and passes them to another stage. Here’s an example of a simple pipeline without using Goroutine:

```go
func main() {
 input := 1

 // Example 1:
 multiply(add(input, 1), 2)

 // Example 2:
 // We can rearrange the stages to get diff result
 add(multiply(input, 2), 1)
}

func add(x int, y int) int {
 return x + y
}

func multiply(x int, y int) int {
 return x * y
}
```

The benefit of a pipeline is evident:

- It separates the concerns of each stage in the pipeline. Each stage is responsible for one and only one thing.
- The stages are modular and allow us to mix and match how stages are combined.

The stages in the example above run sequentially. Each can only begin after the previous stage has processed all the data. Leveraging the Goroutine and channel, stages can run and process data concurrently. First, we transform our `add` and `multiply`function to take in an `inputCh` and outputs a `resultCh`.

```go
func generator(doneCh chan struct{}, input []int) chan int {
 inputCh := make(chan int)

 go func() {
  defer close(inputCh)

  for _, data := range input {
   select {
   case <-doneCh:
    return
   case inputCh <- data:
   }
  }
 }()

 return inputCh
}

func add(doneCh chan struct{}, inputCh chan int) chan int {
 addRes := make(chan int)

 go func() {
  defer close(addRes)

  for data := range inputCh {
   result := data + 1

   select {
   case <-doneCh:
    return
   case addRes <- result:
   }
  }
 }()

 return addRes
}

func multiply(doneCh chan struct{}, inputCh chan int) chan int {
 multiplyRes := make(chan int)

 go func() {
  defer close(multiplyRes)

  for data := range inputCh {
   result := data * 2

   select {
   case <-doneCh:
    return
   case multiplyRes <- result:
   }
  }
 }()

 return multiplyRes
}

func main() {
 input := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

 doneCh := make(chan struct{})
 defer close(doneCh)

 inputCh := generator(doneCh, input)

 resultCh := multiply(doneCh, add(doneCh, inputCh))

 for res := range resultCh {
  fmt.Println(res)
 }
}
```

Here’s a breakdown of the code:

1. We create a data stream using the `generator` function
1. We create a `doneCh` and pass to all Goroutines for explicit cancellation
1. We then chain the `add` and `multiply` stage together
1. Whenever the `add` function has done processing an input. It will immediately pass the result to the multiply stage for further processing

Each stage processes the data concurrently and immediately passes it to the next stage once it’s done. Moreover, the multiply and the add stage can be mixed and matched to produce different results.

### The disadvantages of this pattern

**Increased complexity**

The pipeline pattern can become complex when dealing with multiple stages and channels. This complexity can make it difficult to debug and maintain the code. To reduce the complexity of the pipeline pattern, it is important to keep each stage simple and focused on a specific task. This will make it easier to debug and maintain the code.

**Blocking**

If one stage of the pipeline is blocked, it can cause the entire pipeline to block. This can lead to performance issues and slow down the processing of data. To avoid blocking in the pipeline, non-blocking channels can be used. This will allow the pipeline to continue processing data even if one stage is blocked.

**Data Loss**

If the pipeline is not designed properly, it can result in data loss. For example, if a channel is not buffered and a stage is not ready to receive data, the data will be lost. To prevent data loss, buffered channels can be used. This will ensure that data is not lost if a stage is not ready to receive data.

Proper error handling should be implemented in each stage of the pipeline to handle any errors that may occur. This will help to prevent the pipeline from crashing and losing data.

## The semaphore pattern

![[6cff9e49452d4333171fa27c6f77cf90_MD5.webp]]

As you spawn more Goroutines to process requests concurrently, this leaves us with another problem. What happens if all your Goroutines access the same shared resources, say a remote cache? Bombarding your cache with an unbounded number of concurrent requests is a surefire recipe to bring down your cache immediately. This is where the Semaphore comes in handy.

Unlike mutex lock, which allows a single thread to access a resource at a time, Semaphore allows `N` threads to access a resource at a time. Using the concept of a buffered channel, we can design a semaphore easily.

```go
type Semaphore struct {
 semaCh chan struct{}
}

func NewSemaphore(maxReq int) *Semaphore {
 return &Semaphore{
  semaCh: make(chan struct{}, maxReq),
 }
}

func (s *Semaphore) Acquire() {
 s.semaCh <- struct{}{}
}

func (s *Semaphore) Release() {
 <-s.semaCh
}
```

1. The `NewSemaphore` initiates a `Semaphore` by creating a buffered channel with the capacity of `maxReq`
1. When a Goroutine `Acquire` a semaphore, we send an empty struct to `semaCh`
1. When the buffered channel is full, call to `Acquire` will be blocked
1. When a Goroutine `Release` a semaphore, an empty struct will be sent out of the channel, creating space in the buffered channel for subsequent `Acquire`

Let’s take a look at an example:

```go
func main() {
 var wg sync.WaitGroup
 semaphore := NewSemaphore(2)

 for idx := 0; idx < 10; idx++ {
  wg.Add(1)

  go func(taskID int) {
   semaphore.Acquire()

   defer wg.Done()
   defer semaphore.Release()

   msg := fmt.Sprintf(
    "%s Running worker %d",
    time.Now().Format("15:04:05"),
    taskID,
   )
   fmt.Println(msg)

   time.Sleep(1 * time.Second)
  }(idx)
 }

 wg.Wait()
}
```

1. We create a semaphore with the capacity of `2`
1. We spawn ten Goroutines to process certain task
1. Each Goroutine acquires a semaphore before processing
1. Since there are ten tasks and the maximum number of concurrent tasks is `2`, the total time needed to process all tasks will be five seconds (Each task takes one second)

### The disadvantages of this pattern

**Deadlocks**

One of the main disadvantages of the Semaphore pattern is the potential for deadlocks. Deadlocks occur when two or more processes are waiting for each other to release a resource, resulting in a deadlock situation where none of the processes can proceed. To avoid deadlocks, it is important to ensure that all resources are released after they have been used. In Golang, this can be achieved by using the `defer`statement to ensure that resources are always released, even if an error occurs.

**Starvation**

Another disadvantage of the Semaphore pattern is the potential for starvation. Starvation occurs when a process is unable to access a shared resource because other processes are constantly accessing it.

To avoid starvation, it is important to implement a fair scheduling algorithm that ensures that all processes have equal access to the shared resource. In Golang, this can be achieved by using a `sync.Mutex` to lock the shared resource and a `sync.Cond` to signal when the resource is available.

**Performance Overhead**

The semaphore pattern can also introduce performance overhead due to the additional synchronization mechanisms required to control access to the shared resource. To minimize performance overhead, it is important to use the Semaphore pattern only when necessary and to carefully consider the number of resources that need to be shared. In Golang, this can be achieved by using buffered channels to limit the number of goroutines that can access the shared resource at any given time.

## Considering the number of goroutines

Goroutines are considered to be lightweight because they use little memory and resources plus their initial stack size is small. Prior to version 1.2 the stack size started at 4K and now as of version 1.4 it starts at 8K. The stack has the ability to grow as needed.

The operating system schedules threads to run against available processors and the Go runtime schedules goroutines to run within a **[logical processor](https://www.ardanlabs.com/blog/2015/02/scheduler-tracing-in-go.html)** that is bound to a single operating system thread. By default, the Go runtime allocates a single logical processor to execute all the goroutines that are created for our program. Even with this single logical processor and operating system thread, hundreds of thousands of goroutines can be scheduled to run concurrently with amazing efficiency and performance. It is not recommended to add more that one logical processor, but if you want to run goroutines in parallel, Go provides the ability to add more via the GOMAXPROCS environment variable or runtime function.

There are some problems and key notes to consider when running a huge number of goroutines with GOMAXPROCS(1) a.k.a running them on a single thread or logical processor:

1. **Performance issues:** Running a large number of goroutines on a single processor can cause performance issues due to the overhead of context switching between them. This can lead to slower execution times and increased memory usage.

- The typical file descriptor limits of machines nowadays vary depending on the operating system and its configuration. Here are some examples:
- Linux: The default limit is often set to 1024, but it can be increased by modifying the `/etc/security/limits.conf` file or using the `ulimit` command. Some distributions may have higher default limits.
- macOS: The default limit is often set to 256, but it can be increased by modifying the `/etc/sysctl.conf` file or using the `ulimit` command.
- Windows: The default limit is often set to a very high value (e.g. 16 million), but it can be increased or decreased using the `SetProcessHandleCount` function.

It's important to note that increasing the file descriptor limit can have performance implications, as each open file consumes system resources. Therefore, it's generally recommended to only increase the limit if your application requires it and to monitor resource usage carefully.

1. **Deadlocks and race conditions:** When multiple goroutines access shared resources concurrently, it can lead to deadlocks and race conditions. These issues can be difficult to debug and fix, especially when dealing with a large number of goroutines.
1. **Resource limitations:** Running a large number of goroutines can also lead to resource limitations, such as running out of memory or hitting file descriptor limits. It's important to monitor resource usage and adjust the number of goroutines accordingly.

- When multiple goroutines are running on a single thread (logical processor), the operating system has to perform context switching between them. Context switching is the process of saving the current state of a running process or thread and restoring the saved state of another process or thread so that it can continue execution from where it left off.
- The overhead of context switching between goroutines depends on several factors, including the number of goroutines running on the thread, the frequency of context switches, and the complexity of the tasks being performed by the goroutines.
- If there are many goroutines running on a single thread, the frequency of context switches will be high, which can lead to increased overhead. This is because each time a context switch occurs, the operating system has to save the state of the currently running goroutine and restore the state of the next goroutine to be executed. This involves copying data between memory locations, which can be time-consuming.
- In addition, if the tasks being performed by the goroutines are complex and require a lot of CPU time, the overhead of context switching can be even higher. This is because each time a context switch occurs, the CPU has to spend time re-loading its caches with the data needed by the new goroutine, which can take longer if the data is not already in the cache.
- To minimize the overhead of context switching between goroutines, it is important to carefully manage the number of goroutines running on a single thread and to ensure that they are performing tasks that are well-suited to concurrent execution. This can involve using techniques such as load balancing and task prioritization to ensure that the most important tasks are executed first and that the workload is evenly distributed across all available threads.

1. **Design considerations:** When designing an application that uses a large number of goroutines, it's important to consider the overall architecture and ensure that it is scalable and maintainable. This may involve breaking up tasks into smaller, more manageable pieces or using a distributed system architecture.

- Use channels for communication: Goroutines communicate with each other using channels. Using channels instead of shared memory avoids race conditions and makes it easier to reason about your code.
- Be mindful of blocking operations: If a goroutine blocks on an I/O operation, it will be paused and another goroutine will be scheduled to run. This can lead to inefficient use of resources if there are many goroutines waiting on I/O. Consider using non-blocking I/O or asynchronous I/O to avoid this issue.
- Keep critical sections short: When multiple goroutines access shared data, it's important to keep critical sections short to minimize the risk of race conditions. Consider using locks or other synchronization primitives to protect shared data.

In summary, while it is possible to run a large number of goroutines with GOMAXPROCS(1), it's important to consider the potential performance issues, deadlocks and race conditions, resource limitations, and design considerations. It's recommended to carefully test and monitor the application to ensure that it is functioning correctly and efficiently.

## Conclusion

In conclusion, managing concurrent workloads with Goroutines in Go can be a powerful and efficient way to process large amounts of data and improve application performance. However, it's important to consider the potential drawbacks and design considerations, such as increased complexity, resource consumption, synchronization overhead, deadlocks, and race conditions. By carefully managing the number of Goroutines, using channels for communication, being mindful of blocking operations, and keeping critical sections short, it's possible to create scalable, maintainable, and efficient applications with Go.
