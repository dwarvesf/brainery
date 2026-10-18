---
draft: true
title: "Go commentary 2024: all 24 issues"
short_title: Go commentary 2024
description: Twenty-four weekly Go reading notes from June to December 2024, covering eBPF and profile-guided optimization, generics, fuzzing, sync.Map, weak pointers and the Go 1.24 synctest experiment.
date: 2024-06-27
slug: go-commentary-2024
kind: digest
announce: false
authors:
  - fuatto
tags:
  - golang
  - go-weekly
redirect: []
---

Weekly commentary on what the Go community published in 2024. Each issue summarizes a few articles and records the takeaways. Issues #1 and #2 ran as Go weekly; every issue after that ran as Go commentary. This page holds all 24, newest first.

## Issue 24: Coming in Go 1.24: testing/synctest experiment for time and concurrency testing

_2024-12-13_

### [Coming in Go 1.24: testing/synctest experiment for time and concurrency testing](https://danp.net/posts/synctest-experiment/)

#### Context

```go
func Test(t *testing.T) {
    before := time.Now()
    time.Sleep(time.Second)
    after := time.Now()
    if d := after.Sub(before); d != time.Second {
        t.Fatalf("took %v", d)
    }
}
```

- Traditional hack

```go
func Test(t *testing.T) {
    before := time.Now()
    time.Sleep(time.Second)
    after := time.Now()
    if d := after.Sub(before); d >= 2*time.Second {
        t.Fatalf("took %v", d)
    }
}
```

- It's still flaky because it depends on the system clock.

#### Solution

- The `testing/synctest` package is an experiment to provide a more deterministic way to test time and concurrency in Go.

```go
import (
	"testing"
	"testing/synctest"
	"time"
)

func Test(t *testing.T) {
	synctest.Run(func() {
		before := time.Now()
		time.Sleep(time.Second)
		after := time.Now()
		if d := after.Sub(before); d != time.Second {
			t.Fatalf("took %v", d)
		}
	})
}
```

- And then use [gotip](https://pkg.go.dev/golang.org/dl/gotip) with `GOEXPERIMENT=synctest`

#### Extending to concurrency

```go
func Test(t *testing.T) {
	ctx := context.Background()

	ctx, cancel := context.WithCancel(ctx)

	var hits atomic.Int32
	go func() {
		tick := time.NewTicker(time.Millisecond)
		defer tick.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-tick.C:
				hits.Add(1)
			}
		}
	}()

	time.Sleep(3 * time.Millisecond)
	cancel()

	got := int(hits.Load())
	if want := 3; got != want {
		t.Fatalf("got %v, want %v", got, want)
	}
}
```

- It's flaky because of the initial delay of the Ticker

- Wrap the test in `synctest.Run` to make it deterministic

```go
func Test(t *testing.T) {
	synctest.Run(func() {
		ctx := context.Background()

		ctx, cancel := context.WithCancel(ctx)

		var hits atomic.Int32
		go func() {
			tick := time.NewTicker(time.Millisecond)
			defer tick.Stop()
			for {
				select {
				case <-ctx.Done():
					return
				case <-tick.C:
					hits.Add(1)
				}
			}
		}()

		time.Sleep(4 * time.Millisecond)
		cancel()

		got := int(hits.Load())
		if want := 3; got != want {
			t.Fatalf("got %v, want %v", got, want)
		}
	})
}
```

#### Conclusion

- It seems that `testing/synctest` will significantly improve testing code that involves time or concurrency. Example in go source: [https://go-review.googlesource.com/c/go/+/630382](https://go-review.googlesource.com/c/go/+/630382)

- You can try it yourself now by using `gotip` and setting `GOEXPERIMENT=synctest`. When Go 1.24 comes out GOEXPERIMENT=synctest will still be required.

- Review the [main proposal](https://github.com/golang/go/issues/67434) and share any experience you have.

---

https://danp.net/posts/synctest-experiment/

https://go-review.googlesource.com/c/go/+/630382

https://github.com/golang/go/issues/67434

## Issue 23: Draft release notes for Go 1.24 and weak pointers in Go

_2024-12-06_

### [Draft Release Notes Go 1.24](https://tip.golang.org/doc/go1.24)

#### Go 1.24 is not yet released. These are work-in-progress release notes. Go 1.24 is expected to be released in february 2025.

- Fully supports _generic type aliases_: a type alias may be parameterized like a defined type

```go
type (
	nodeList = []*Node  // nodeList and []*Node are identical types
	Polar    = polar    // Polar and polar denote identical types
)
```

=> Specs:

```go
type set[P comparable] = map[P]bool
type A[P any] = P    // illegal: P is a type parameter
```

=> the feature can be disabled by setting `GOEXPERIMENT=noaliastypeparams`; but the `aliastypeparams` setting will be removed for Go 1.25.

- Some updates for tools `go tool` or `-tool` flag, new `tests` analyzer for `go vet`

- Some updates for Cgo, Runtime, Compiler, Linker, Bootstrap

- Some updates for stdlibs:

  - The new `os.Root` type provides the ability to perform filesystem operations within a specific directory.

  - The `os.OpenRoot` function opens a directory and returns an `os.Root`. Methods on `os.Root` operate within the directory and do not permit paths that refer to locations outside the directory, including ones that follow symbolic links out of the directory.

    `os.Root.Open` opens a file for reading.

    `os.Root.Create` creates a file.

    `os.Root.OpenFile` is the generalized open call.

    `os.Root.Mkdir` creates a directory.

  - Some updates for `crypto`, `hash` package

  - Some updates for `net/http` including support for HTTP/2 protocol settings in `Transport` and `Server`

  - New implementation for `sync.Map` that will improve overall performance and resolve some long-standing issues

### [Weak Pointers in Go: Why They Matter Now](https://victoriametrics.com/blog/go-weak-pointer/)

#### Definition:

A type of reference to an object that does not prevent the object from being garbage collected

=> `weak` package:

```go
type Pointer[T any] struct {
	u unsafe.Pointer
}

// Make creates a weak pointer from a strong pointer to some value of type T.
func Make[T any](ptr *T) Pointer[T] {
  //...
}
```

- If the memory they’re pointing to gets cleaned up, the weak pointer automatically becomes `nil` — so there’s no risk of accidentally pointing to freed memory => they are safe

```go
type T struct {
  a int
  b int
}

func main() {
  a := new(string)
  println("original:", a)

  // make a weak pointer
  weakA := weak.Make(a)

  runtime.GC()

  // use weakA
  strongA := weakA.Strong()
  println("strong:", strongA, a)

  runtime.GC()

  // use weakA again
  strongA = weakA.Strong()
  println("strong:", strongA)
}

// Output:
// original: 0x1400010c670
// strong: 0x1400010c670 0x1400010c670
// strong: 0x0
```

- After the first garbage collection `runtime.GC()`, the weak pointer weakA still points to the memory because we’re still using the variable a in the `println("strong:", strongA, a)` line. The memory can’t be cleaned up yet since it’s in use.
- But when the second garbage collection runs, the strong reference (a) isn’t used anymore. That means the garbage collector can safely clean up the memory, leaving `weakA.Strong()` to return `nil`.

#### Use case

- Canonicalization maps, where you only want to keep one copy of a piece of data around
- Initial purpose is in internal packages, e.g: `unique`

```go
func main() {
	h1 := unique.Make("Hello")
	h2 := unique.Make("Hello")
	w1 := unique.Make("World")

	fmt.Println("h1:", h1)
	fmt.Println("h2:", h2)
	fmt.Println("w1:", w1)
	fmt.Println("h1 == h2:", h1 == h2)
	fmt.Println("h1 == w1:", h1 == w1)
}

// Output:
// h1: {0x14000090270}
// h2: {0x14000090270}
// w1: {0x14000090280}
// h1 == h2: true
// h1 == w1: false
```

#### How does it work

- Having a in-between tiny object (8bytes)

![](assets/weak-pointer-indirection-reference.webp)

- This setup lets the garbage collector clean up weak pointers to a specific object all at once, efficiently:
  - the collector only needs to set the pointer in the indirection object to nil (or 0x0). No need to go around updating each weak pointer individually.

![](assets/weak-pointer-gc-reclaim.webp)

---

https://tip.golang.org/doc/go1.24

https://victoriametrics.com/blog/go-weak-pointer/

## Issue 22: GoMLX: ML in Go without Python

_2024-11-29_

### [GoMLX: ML in Go without Python](https://eli.thegreenplace.net/2024/gomlx-ml-in-go-without-python)

#### How ML models are implemented

- Written in Python, using frameworks like TensorFlow, JAX or Pytorch that take care of:

  - Expressive way to describe the model architecture, including auto-differentiation for training.
  - Efficient implementation of computational primitives on common HW: CPUs, GPUs and TPUs.

![](assets/openxla-diagram-with-gopher.png)

- The frameworks that provide high-level primitives to define and translate ML models to a common interchange format called StableHLO (High-Level Operations).

- The OpenXLA system, which includes two major components: the XLA compiler translating HLO to HW machine code, and PJRT - the runtime component responsible for managing HW devices, moving data (tensors) between the host CPU and these devices, executing tasks, sharding and so on.

- HW that executes these models efficiently. (C/C++ hidden complexity)

#### GoMLX

- Wraps XLA - access to all building blocks TF and JAX use

#### Examples

- a CNN (convolutional neural network) without any Python, training it on [CIFAR-10](https://www.cs.toronto.edu/~kriz/cifar.html)

as expected, Go code is longer and more explicit

```go
// define the model graph
func C10ConvModel(mlxctx *mlxcontext.Context, spec any, inputs []*graph.Node) []*graph.Node {
  batchedImages := inputs[0]
  g := batchedImages.Graph()
  dtype := batchedImages.DType()
  batchSize := batchedImages.Shape().Dimensions[0]
  logits := batchedImages

  layerIdx := 0
  nextCtx := func(name string) *mlxcontext.Context {
    newCtx := mlxctx.Inf("%03d_%s", layerIdx, name)
    layerIdx++
    return newCtx
  }

  // Convolution / activation layers
  logits = layers.Convolution(nextCtx("conv"), logits).Filters(32).KernelSize(3).PadSame().Done()
  logits.AssertDims(batchSize, 32, 32, 32)
  logits = activations.Relu(logits)
  logits = layers.Convolution(nextCtx("conv"), logits).Filters(32).KernelSize(3).PadSame().Done()
  logits = activations.Relu(logits)
  logits = graph.MaxPool(logits).Window(2).Done()
  logits = layers.DropoutNormalize(nextCtx("dropout"), logits, graph.Scalar(g, dtype, 0.3), true)
  logits.AssertDims(batchSize, 16, 16, 32)

  logits = layers.Convolution(nextCtx("conv"), logits).Filters(64).KernelSize(3).PadSame().Done()
  logits.AssertDims(batchSize, 16, 16, 64)
  logits = activations.Relu(logits)
  logits = layers.Convolution(nextCtx("conv"), logits).Filters(64).KernelSize(3).PadSame().Done()
  logits.AssertDims(batchSize, 16, 16, 64)
  logits = activations.Relu(logits)
  logits = graph.MaxPool(logits).Window(2).Done()
  logits = layers.DropoutNormalize(nextCtx("dropout"), logits, graph.Scalar(g, dtype, 0.5), true)
  logits.AssertDims(batchSize, 8, 8, 64)

  logits = layers.Convolution(nextCtx("conv"), logits).Filters(128).KernelSize(3).PadSame().Done()
  logits.AssertDims(batchSize, 8, 8, 128)
  logits = activations.Relu(logits)
  logits = layers.Convolution(nextCtx("conv"), logits).Filters(128).KernelSize(3).PadSame().Done()
  logits.AssertDims(batchSize, 8, 8, 128)
  logits = activations.Relu(logits)
  logits = graph.MaxPool(logits).Window(2).Done()
  logits = layers.DropoutNormalize(nextCtx("dropout"), logits, graph.Scalar(g, dtype, 0.5), true)
  logits.AssertDims(batchSize, 4, 4, 128)

  // Flatten logits, and apply dense layer
  logits = graph.Reshape(logits, batchSize, -1)
  logits = layers.Dense(nextCtx("dense"), logits, true, 128)
  logits = activations.Relu(logits)
  logits = layers.DropoutNormalize(nextCtx("dropout"), logits, graph.Scalar(g, dtype, 0.5), true)
  numClasses := 10
  logits = layers.Dense(nextCtx("dense"), logits, true, numClasses)
  return []*graph.Node{logits}
}
```

```go
// the classifier
func main() {
  flagCheckpoint := flag.String("checkpoint", "", "Directory to load checkpoint from")
  flag.Parse()

  mlxctx := mlxcontext.New()
  backend := backends.New()

  _, err := checkpoints.Load(mlxctx).Dir(*flagCheckpoint).Done()
  if err != nil {
    panic(err)
  }
  mlxctx = mlxctx.Reuse() // helps sanity check the loaded context
  exec := mlxcontext.NewExec(backend, mlxctx.In("model"), func(mlxctx *mlxcontext.Context, image *graph.Node) *graph.Node {
    // Convert our image to a tensor with batch dimension of size 1, and pass
    // it to the C10ConvModel graph.
    image = graph.ExpandAxes(image, 0) // Create a batch dimension of size 1.
    logits := cnnmodel.C10ConvModel(mlxctx, nil, []*graph.Node{image})[0]
    // Take the class with highest logit value, then remove the batch dimension.
    choice := graph.ArgMax(logits, -1, dtypes.Int32)
    return graph.Reshape(choice)
  })

  // classify takes a 32x32 image and returns a Cifar-10 classification according
  // to the models. Use C10Labels to convert the returned class to a string
  // name. The returned class is from 0 to 9.
  classify := func(img image.Image) int32 {
    input := images.ToTensor(dtypes.Float32).Single(img)
    outputs := exec.Call(input)
    classID := tensors.ToScalar[int32](outputs[0])
    return classID
  }

  // ...
}
```

- [A Gemma2 from Kaggle](https://www.kaggle.com/models/google/gemma-2) example

```go
var (
  flagDataDir   = flag.String("data", "", "dir with converted weights")
  flagVocabFile = flag.String("vocab", "", "tokenizer vocabulary file")
)

func main() {
  flag.Parse()
  ctx := context.New()

  // Load model weights from the checkpoint downloaded from Kaggle.
  err := kaggle.ReadConvertedWeights(ctx, *flagDataDir)
  if err != nil {
    log.Fatal(err)
  }

  // Load tokenizer vocabulary.
  vocab, err := sentencepiece.NewFromPath(*flagVocabFile)
  if err != nil {
    log.Fatal(err)
  }

  // Create a Gemma sampler and start sampling tokens.
  sampler, err := samplers.New(backends.New(), ctx, vocab, 256)
  if err != nil {
    log.Fatalf("%+v", err)
  }

  start := time.Now()
  output, err := sampler.Sample([]string{
    "Are bees and wasps similar?",
  })
  if err != nil {
    log.Fatalf("%+v", err)
  }
  fmt.Printf("\tElapsed time: %s\n", time.Since(start))
  fmt.Printf("Generated text:\n%s\n", strings.Join(output, "\n\n"))
}
```

#### Conclusion

- Using GoMLX can help implement ML inference in Go without Python

- Since it's a relatively new project, it may be a little risky for production uses for now.

---

https://eli.thegreenplace.net/2024/gomlx-ml-in-go-without-python

https://www.cs.toronto.edu/~kriz/cifar.html

https://www.kaggle.com/models/google/gemma-2

## Issue 21: Go sync.Once is simple

_2024-11-22_

### [Go sync.Once is simple... Is it really?](https://victoriametrics.com/blog/go-sync-once/)

#### What is sync.Once?

- "Once is an object that will perform exactly one action"

```go
var once sync.Once
var conf Config

func GetConfig() Config {
    once.Do(func() {
        conf = fetchConfig()
    })
    return conf
}
```

- If `GetConfig()` is called multiple times, `fetchConfig()` is executed only once.

```go
type Singleton struct {
    // fields
}

var (
    instance *Singleton
    once     sync.Once
)

func GetSingleton() *Singleton {
    once.Do(func() {
        instance = &Singleton{}
    })
    return instance
}
```

- The benefit: it delays certain operations until they are first needed (lazy-loading), which can improve runtime performance and reduce initial memory usage.

```go
var once sync.Once

func main() {
    once.Do(func() {
        fmt.Println("This will be printed once")
    })

    once.Do(func() {
        fmt.Println("This will not be printed")
    })
}

// Output:
// This will be printed once
```

- No built-in way to reset a sync.Once, so if the function passed to Once.Do panics while running, the future calls to `Do(f)` won't run f again and will be tricky to catch the panic and handle the error afterward

```go
var once sync.Once
var config Config

func GetConfig() (Config, error) {
    var err error
    once.Do(func() {
        config, err = fetchConfig()
    })
    return config, err
}
```

- From Go 1.21, we get: `OnceFunc`, `OnceValue` and `OnceValues`

```go
// If f panics, the returned function will panic with the same value on every call. (cached)
func OnceFunc(f func()) func() {
  ...
}

// returns the value returned by f
func OnceValue[T any](f func() T) func() T {
  ...
}

// returns the values returned by f
func OnceValues[T1, T2 any](f func() (T1, T2)) func() (T1, T2) {
  ...
}
```

- Example use:

```go
var config Config

var getConfigOnce = sync.OnceValues(fetchConfig)

func main() {
  var err error

  config, err = getConfigOnce()
  if err != nil {
    log.Fatalf("Failed to fetch config: %v", err)
  }
  ...
}
```

#### How it works?

- The implementation of Once

```go
type Once struct {
	done atomic.Uint32
	m    Mutex
}
```

- Simply use mutex to lock and allows only 1 goroutine to enter; then if `done` is still 0 (function f hasn't run yet) set done to 1 and runs f()

=> Original version of sync.Once, written by Rob Pike in 2010

```go
func (o *Once) Do(f func()) {
	o.m.Lock()
	defer o.m.Unlock()

	if o.done.Load() == 0 {
		o.done.Store(1)
		f()
	}
}
```

- Not performant since it always locks first (goroutines wait on each other) whenever Do(f) is called.

=> check the flag done first before the lock

```go
func (o *Once) Do(f func()) {
  if atomic.LoadUint32(&o.done) == 1 {
    return
  }

  // slow path
  o.m.Lock()
  defer o.m.Unlock()

  if o.done.Load() == 0 {
    o.done.Store(1)
    f()
  }
}
```

- This introduces the race condition

![](assets/go-sync-once-done-mistake.webp)

=> add defer to when setting flag

```go
func (o *Once) Do(f func()) {
  if o.done.Load() == 1 {
    return
  }

  // slow path
  o.m.Lock()
  defer o.m.Unlock()

  if o.done.Load() == 0 {
    defer o.done.Store(1)
    f()
  }
}
```

- Since Go compiler supports inlining (taking the function's code and paste it directly to where the function is called) optimization

```go
func (o *Once) Do(f func()) {
	if o.done.Load() == 0 {
		o.doSlow(f)
	}
}

func (o *Once) doSlow(f func()) {
	o.m.Lock()
	defer o.m.Unlock()

	if o.done.Load() == 0 {
		defer o.done.Store(1)
		f()
	}
}
```

---

https://victoriametrics.com/blog/go-sync-once/

https://go.dev/ref/mem

## Issue 20: Go turns 15

_2024-11-15_

### [Go Turns 15](https://go.dev/blog/15years)

- So much has changed since [Go's 10 year anniversery](https://go.dev/blog/10years)

  - Go’s user base x3 in the past five years, making it one of the fastest growing languages.
  - From its beginnings just fifteen years ago, Go has become a top 10 language and the language of the modern cloud.

- It's a year of for loop:

  - [Go 1.22 in February](https://go.dev/blog/go1.22)

    - Fixed the accidental sharing of loop variables between iterations:

    ```go
    func main() {
      done := make(chan bool)

      values := []string{"a", "b", "c"}
      for _, v := range values {
          go func() {
              fmt.Println(v)
              done <- true
          }()
      }

      // wait for all goroutines to complete before exiting
      for _ = range values {
          <-done
      }
    }
    ```

    - Support for ranging over integer

    ```go
    package main

    import "fmt"

    func main() {
        for i := range 10 {
            fmt.Println(10 - i)
        }
        fmt.Println("go1.22 has lift-off!")
    }
    ```

    - Improved performance

      - Memory optimization in the Go runtime improves CPU performance by 1-3%, while also reducing the memory overhead of most Go programs by around 1%.

      - In Go 1.21, we shipped profile-guided optimization (PGO) for the Go compiler and this functionality continues to improve. One of the optimizations added in 1.22 is improved devirtualization, allowing static dispatch of more interface method calls. Most programs will see improvements between 2-14% with PGO enabled.

    - Standard library additions

      - A new **math/rand/v2** package provides a cleaner, more consistent API and uses higher-quality, faster pseudo-random generation algorithms. See the proposal for additional details.

      - The patterns used by **net/http.ServeMux** now accept methods and wildcards.

        For example, the router accepts a pattern like _GET /task/{id}/_, which matches only GET requests and captures the value of the {id} segment in a map that can be accessed through Request values.

      - A new _Null[T]_ type in **database/sql** provides a way to scan nullable columns.

      - A Concat function was added in package **slices**, to concatenate multiple slices of any type.

  - [Go 1.23 in August](https://go.dev/blog/go1.23)

    - Range expressions in a _“for-range”_ loop may now be iterator functions, such as `func(func(K) bool)`. This supports user-defined iterators over arbitrary sequences. There are several additions to the standard slices and maps packages that work with iterators, as well as a new iter package. As an example, if you wish to collect the keys of a map m into a slice and then sort its values, you can do that in Go 1.23 with slices.Sorted(maps.Keys(m)).

    - Preview support for generic type aliases.

    - Tool improvements

      - Starting with Go 1.23, it’s possible for the Go toolchain to collect usage and breakage statistics to help understand how the Go toolchain is used, and how well it is working. This is _Go telemetry_, an opt-in system. Please consider opting in to help us keep Go working well and better understand Go usage.

      - The go command has new conveniences. For example, running `go env -changed` makes it easier to see only those settings whose effective value differs from the default value, and `go mod tidy -diff` helps determine the necessary changes to the _go.mod_ and _go.sum_ files without modifying them. Read more on the Go command in the release notes.
      - The `go vet` subcommand now reports symbols that are too new for the intended Go version.

- For next 15 years:

  - Evolving Go to better leverage the capabilities of current and future hardware

  - Go 1.24 will have a totally new map implementation under the hood that’s more efficient on modern CPUs.
  - Prototyping new garbage collection algorithms designed around the capabilities and constraints of modern hardware.

  - Some improvements will be in the form of new APIs and tools so Go developers can better leverage modern hardware.

  - Working on making Go better for AI—and AI better for Go (LangChainGo & Genkit)

---

https://go.dev/blog/15years

https://go.dev/blog/10years

https://go.dev/blog/go1.22

https://go.dev/blog/go1.23

## Issue 19: Writing secure Go code

_2024-11-08_

### [Writing secure Go code](https://jarosz.dev/article/writing-secure-go-code/)

**Context**:

What does it mean to keep security in mind when writing Go code?

**Solution**:

Answer these questions:

    - How do we stay informed about the Go security announcements?
    - How do we keep our Go code patched and up to date?
    - How do we test our Go code focusing on security and robustness?
    - What are CVEs, and where do we learn about the most common software vulnerabilities?

How do we stay informed about the Go security announcements?

- Subscribe to `golang-announce@googlegroups.com` to get all critical security information right from the source.

How do we keep our Go code patched and up to date?

- Keeping Go version up to date: even though we don’t use the latest and greatest language features, bumping the Go version gives us all security patches for discovered vulnerabilities. Also, the new Go version ensures compatibility with newer dependencies. It protects our applications from potential integration issues.

- Check accordingly which security issues and CVEs addressed in what Go releases and update `go.mod`.

- Check for compatibility and dependency problems.

How do we test our Go code focusing on security and robustness?

- Use Go tooling for static code analysers:

  - Old school `go vet` to detect syntax errors, unused variables, unreachable areas of codebase, goroutine mistakes...

  - `staticcheck`

    ```
    go install honnef.co/go/tools/cmd/staticcheck@latest
    ```

    e.g: test on NGIX Agent cloned repo

    ```
    ➜  agent git:(main) ✗ staticcheck ./...
    ```

    to detect packages, methods or functions are deprecated:

    ```bash...
    src/core/metrics/sources/cpu.go:111:9: times.Total is deprecated: Total returns the total number of seconds in a CPUTimesStat Please do not use this internal function. (SA1019)
    ...
    test/component/nginx-app-protect/monitoring/monitoring_test.go:15:8: "github.com/golang/protobuf/jsonpb" is deprecated: Use the "google.golang.org/protobuf/encoding/protojson" package instead. (SA1019)
    ```

    to detect unused variables and fields:

    ```bash
    src/core/metrics/sources/nginx_plus.go:74:2: field endpoints is unused (U1000)
    src/core/metrics/sources/nginx_plus.go:75:2: field streamEndpoints is unused (U1000)
    src/core/metrics/sources/nginx_plus_test.go:94:2: var availableZones is unused (U1000)
    ```

    to detect code quality problems:

    ```bash
    src/core/nginx.go:791:4: ineffective break statement. Did you mean to break out of the outer loop? (SA4011)
    ```

  - `golangci-lint`

    ```
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
    ```

    e.g: test on NGIX Agent cloned repo

    ```
    ➜  agent git:(main) ✗ golangci-lint run ./...
    ```

    suggestions for improving the code:

    ```
    src/extensions/nginx-app-protect/monitoring/processor/nap_test.go:60:14: S1025: the argument is already a string, there's no need to use fmt. Sprintf (gosimple)
    logEntry: fmt.Sprintf(`%s`, func() string {
    ^
    ```

    ```
    src/plugins/common.go:85:5: S1009: should omit nil check; len() for []string is defined as zero (gosimple)
    if loadedConfig.Extensions != nil && len(loadedConfig.Extensions) > 0 {
        ^
    ```

  - Detect race conditions

    ```
    go test -race
    ```

- Scanning source code for vulnerabilities

  - `govulncheck`

    ```
    go install golang.org/x/vuln/cmd/govulncheck@latest
    ```

    ```
      ➜  habit git:(main) ✗ govulncheck
      No vulnerabilities found.
    ```

    ```
    ➜  habit git:(main) ✗ govulncheck -mode binary -show verbose habit
    ```

    ```
    Scanning your binary for known vulnerabilities...

    Fetching vulnerabilities from the database...

    Checking the binary against the vulnerabilities...

    === Symbol Results ===

    No vulnerabilities found.

    === Package Results ===

    Vulnerability #1: GO-2023-2186
        Incorrect detection of reserved device names on Windows in path/filepath
      More info: https://pkg.go.dev/vuln/GO-2023-2186
      Standard library
        Found in: path/filepath@go1.20.5
        Fixed in: path/filepath@go1.20.11

    === Module Results ===

    Vulnerability #1: GO-2024-3107
        Stack exhaustion in Parse in go/build/constraint
      More info: https://pkg.go.dev/vuln/GO-2024-3107
      Standard library
        Found in: stdlib@go1.20.5
        Fixed in: stdlib@go1.22.7
    ...

    Vulnerability #18: GO-2023-1878
        Insufficient sanitisation of Host header in net/http
      More info: https://pkg.go.dev/vuln/GO-2023-1878
      Standard library
        Found in: stdlib@go1.20.5
        Fixed in: stdlib@go1.20.6

    Your code is affected by 0 vulnerabilities.
    This scan also found 1 vulnerability in packages you import and 18
    vulnerabilities in modules you require, but your code doesn't appear to call
    these vulnerabilities.
    ```

  - `gosec`

    ```
    go install github.com/securego/gosec/v2/cmd/gosec@latest
    ```

    e.g: test on [brutus](https://github.com/CyberRoute/bruter) repo - an open-source experimental [OSINT](https://en.wikipedia.org/wiki/Open-source_intelligence) app for testing web server configuration.

    ```
    gosec ./...
    ```

    spotted [CWE-295](https://cwe.mitre.org/data/definitions/295.html)

    ```
    ...

    [/.../bruter/pkg/fuzzer/randomua.go:69] - G404 (CWE-338): Use of weak random number generator (math/rand or math/rand/v2 instead of crypto/rand) (Confidence: MEDIUM, Severity: HIGH)
        68:
      > 69:  randomIndex := rand.Intn(len(userAgents))
        70:  return userAgents[randomIndex]

    ...

    [/.../bruter/pkg/server/config.go:40] - G402 (CWE-295): TLS InsecureSkipVerify set true. (Confidence: HIGH, Severity: HIGH)
        39:  customTransport := &http.Transport{
      > 40:   TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        41:  }

    ...
    ```

- Fuzzing

  - Extremely helpful in finding potential security flaws like buffer overflows, SQL injections, DoS attacks and XSS attacks

  - Further read on [Fuzzing test HTTP services Golang](#issue-18-fuzz-testing-go-http-services)

---

<https://jarosz.dev/article/writing-secure-go-code/>

<https://github.com/CyberRoute/bruter>

<https://en.wikipedia.org/wiki/Open-source_intelligence>

<https://cwe.mitre.org/data/definitions/295.html>

## Issue 18: Fuzz testing Go HTTP services

_2024-11-01_

### [Fuzz Testing Go HTTP Services](https://packagemain.tech/p/fuzzing-http-services-golang)

Context:

- You can't envision all of the possible inputs your code could receive => You can only find bugs that you expect to find

Solution:

- Since Go 1.18, fuzzing was added to Go's std testing package

```
The steps to create a fuzz test in Go are the following:

In a _test.go file create a function that starts with Fuzz which accepts *testing.F

Add corpus seeds using f.Add() to allow fuzzer to generate the data based on it.

Call fuzz target using f.Fuzz() by passing fuzzing arguments which our target function accepts.

Start the fuzzer using regular go test command, but with the –fuzz=Fuzz flag
```

- Example:

```go
func Equal(a []byte, b []byte) bool {
  for i := range a {
    // can panic with runtime error: index out of range.
    if a[i] != b[i] {
      return false
    }
  }

  return true
}
```

```go
// Fuzz test
func FuzzEqual(f *testing.F) {

  // Seed corpus addition
  f.Add([]byte{'f', 'u', 'z', 'z'}, []byte{'t', 'e', 's', 't'})

  // Fuzz target with fuzzing arguments
  f.Fuzz(func(t *testing.T, a []byte, b []byte) {
    // Call our target function and pass fuzzing arguments
    Equal(a, b)
  })
}
```

- Fuzzing HTTP Services

```go
type Request struct {
  Limit  int `json:"limit"`
  Offset int `json:"offset"`
}

type Response struct {
  Results    []int `json:"items"`
  PagesCount int   `json:"pagesCount"`
}
```

```go
func ProcessRequest(w http.ResponseWriter, r *http.Request) {
  var req Request

  // Decode JSON request
  if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    http.Error(w, err.Error(), http.StatusBadRequest)
    return
  }

  // Apply offset and limit to some static data
  all := make([]int, 1000)
  start := req.Offset
  end := req.Offset + req.Limit
  res := Response{
    Results:    all[start:end],
    PagesCount: len(all) / req.Limit,
  }

  // Send JSON response
  if err := json.NewEncoder(w).Encode(res); err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }

  w.WriteHeader(http.StatusOK)
}
```

```go
func FuzzProcessRequest(f *testing.F) {
  // Create sample inputs for the fuzzer
  testRequests := []Request{
    {Limit: -10, Offset: -10},
    {Limit: 0, Offset: 0},
    {Limit: 100, Offset: 100},
    {Limit: 200, Offset: 200},
  }

  // Add to the seed corpus
  for _, r := range testRequests {
    if data, err := json.Marshal(r); err == nil {
      f.Add(data)
    }
  }

  // Create a test server
  srv := httptest.NewServer(http.HandlerFunc(ProcessRequest))
  defer srv.Close()

  // Fuzz target with a single []byte argument
  f.Fuzz(func(t *testing.T, data []byte) {
    var req Request
    if err := json.Unmarshal(data, &req); err != nil {
      // Skip invalid JSON requests that may be generated during fuzz
      t.Skip("invalid json")
    }

    // Pass data to the server
    resp, err := http.DefaultClient.Post(srv.URL, "application/json", bytes.NewBuffer(data))
    if err != nil {
      t.Fatalf("unable to call server: %v, data: %s", err, string(data))
    }

    defer resp.Body.Close()

    // Skip BadRequest errors
    if resp.StatusCode == http.StatusBadRequest {
      t.Skip("invalid json")
    }

    // Check status code
    if resp.StatusCode != http.StatusOK {
      t.Fatalf("non-200 status code %d", resp.StatusCode)
    }
  })
}
```

```
go test --fuzz=Fuzz -fuzztime=30s
--- FAIL: FuzzProcessRequest (0.02s)
    --- FAIL: FuzzProcessRequest (0.00s)
        runtime error: integer divide by zero
        runtime error: slice bounds out of range
```

Conclusion:

- Can detect hard-to-spot bugs with weird unexpected inputs

---

https://packagemain.tech/p/fuzzing-http-services-golang

## Issue 17: Leveraging benchstat projects in Go benchmark and Go Plan9 memo on 450% speeding up calculations

_2024-10-25_

### [Leveraging benchstat Projections in Go Benchmark Analysis!](https://www.bwplotka.dev/2024/go-microbenchmarks-benchstat/)

Context: (golang.org/x/perf/cmd/benchstat)

- Old-school:

  1. Creating the benchmark test code:

  ```go
    func BenchmarkFoo(b *testing.B) {
      b.Run(...)
    }
  ```

  2. Running the benchmark for the version A of your code

  ```bash
    export bench=v1 && go test \
    -run '^$' -bench '^BenchmarkFoo' \
    -benchtime 5s -count 6 -cpu 2 -benchmem -timeout 999m \
    | tee ${bench}.txt
  ```

  3. Running the benchmark for the version B of your code

  4. Analyze the A/B benchmark results

  ```bash
    benchstat base=v1.txt new=v2.txt
  ```

Example:

- to compare the encoding efficiency of the [Remote Write 1.0](https://prometheus.io/docs/specs/remote_write_spec/) protocol to the [2.0 version](https://prometheus.io/docs/specs/remote_write_spec_2_0/) for different sample sizes, ideally across different compressions and two different Go protobuf encoders (marshallers).

  ```go
    package across_versions

    // ...

    /*
      export bench=v2 && go test \
        -run '^$' -bench '^BenchmarkEncode' \
        -benchtime 5s -count 6 -cpu 2 -benchmem -timeout 999m \
      | tee ${bench}.txt
    */
    func BenchmarkEncode(b *testing.B) {
      for _, sampleCase := range sampleCases {
        b.Run(fmt.Sprintf("sample=%v", sampleCase.samples), func(b *testing.B) {
          batch := utils.GeneratePrometheusMetricsBatch(sampleCase.config)

          // Commenting out what we used in v1.txt
          //msg := utils.ToV1(batch, true, true)
          msg := utils.ToV2(utils.ConvertClassicToCustom(batch))

          compr := newCompressor("zstd")
          marsh := newMarshaller("protobuf")

          b.ReportAllocs()
          b.ResetTimer()
          for i := 0; i < b.N; i++ {
            out, err := marsh.marshal(msg)
            testutil.Ok(b, err)

            out = compr.compress(out)
            b.ReportMetric(float64(len(out)), "bytes/message")
          }
        })
      }
    }
  ```

  ```bash
  $ benchstat base=v1.txt new=v2.txt
  goos: darwin
  goarch: arm64
  pkg: go-microbenchmarks-benchstat/across_versions
                        │     base     │                new                 │
                        │    sec/op    │   sec/op     vs base               │
  Encode/sample=200-2      264.7µ ± 3%   107.0µ ± 4%  -59.58% (p=0.002 n=6)
  Encode/sample=2000-2    2672.9µ ± 3%   900.3µ ± 3%  -66.32% (p=0.002 n=6)
  Encode/sample=10000-2   13.335m ± 4%   3.299m ± 6%  -75.26% (p=0.002 n=6)
  geomean                  2.113m        682.4µ       -67.70%

                        │     base      │                 new                  │
                        │ bytes/message │ bytes/message  vs base               │
  Encode/sample=200-2      5.964Ki ± 1%    5.534Ki ± 0%   -7.21% (p=0.002 n=6)
  Encode/sample=2000-2     45.88Ki ± 0%    33.45Ki ± 0%  -27.08% (p=0.002 n=6)
  Encode/sample=10000-2    227.4Ki ± 0%    122.0Ki ± 3%  -46.33% (p=0.002 n=6)
  geomean                  39.62Ki         28.27Ki       -28.66%

                        │     base      │                 new                 │
                        │     B/op      │     B/op      vs base               │
  Encode/sample=200-2     336.76Ki ± 0%   64.02Ki ± 0%  -80.99% (p=0.002 n=6)
  Encode/sample=2000-2    1807.7Ki ± 0%   370.8Ki ± 0%  -79.49% (p=0.002 n=6)
  Encode/sample=10000-2    9.053Mi ± 0%   1.322Mi ± 0%  -85.40% (p=0.002 n=6)
  geomean                  1.739Mi        317.9Ki       -82.14%

                        │    base     │                 new                 │
                        │  allocs/op  │ allocs/op   vs base                 │
  Encode/sample=200-2      2.000 ± 0%   2.000 ± 0%        ~ (p=1.000 n=6) ¹
  Encode/sample=2000-2    10.000 ± 0%   2.000 ± 0%  -80.00% (p=0.002 n=6)
  Encode/sample=10000-2   16.000 ± 0%   2.000 ± 0%  -87.50% (p=0.002 n=6)
  geomean                  6.840        2.000       -70.76%
  ¹ all samples are equal

  ```

  -> Limitations:

  - **Difficult to track changes**: easy to lost track of when current optimizations are not helping, and need to revert to previous states.

  - **Accidental benchmark changes**: Unintentional modifications to the benchmark code can lead to unreliable comparisons and are hard to notice in this flow.

  - **Limited collaboration**: hard to share/replicate, esp for bigger projects, where reviews need to ensure the reliability of the author’s benchmark/claimed results.

- New-school:

```bash
  export bench=allcases && go test \
  -run '^$' -bench '^BenchmarkFoo' \
  -benchtime 5s -count 6 -cpu 2 -benchmem -timeout 999m \
  | tee ${bench}.txt
```

```go
package across_cases

// ...

/*
  export bench=allcases && go test \
    -run '^$' -bench '^BenchmarkEncode' \
    -benchtime 5s -count 6 -cpu 2 -benchmem -timeout 999m \
  | tee ${bench}.txt
*/
func BenchmarkEncode(b *testing.B) {
  for _, sampleCase := range sampleCases {
    b.Run(fmt.Sprintf("sample=%v", sampleCase.samples), func(b *testing.B) {
      for _, compr := range compressionCases {
        b.Run(fmt.Sprintf("compression=%v", compr.name()), func(b *testing.B) {
          for _, protoCase := range protoCases {
            b.Run(fmt.Sprintf("proto=%v", protoCase.name), func(b *testing.B) {
              for _, marshaller := range marshallers {
                b.Run(fmt.Sprintf("encoder=%v", marshaller.name()), func(b *testing.B) {
                  msg := protoCase.msgFromConfigFn(sampleCase.config)

                  b.ReportAllocs()
                  b.ResetTimer()
                  for i := 0; i < b.N; i++ {
                    out, err := marshaller.marshal(msg)
                    testutil.Ok(b, err)

                    out = compr.compress(out)
                    b.ReportMetric(float64(len(out)), "bytes/message")
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}

var (
  sampleCases = []struct {
    samples int
    config  utils.GenerateConfig
  }{
    {samples: 200, config: generateConfig200samples},
    {samples: 2000, config: generateConfig2000samples},
    {samples: 10000, config: generateConfig10000samples},
  }
  compressionCases = []*compressor{
    newCompressor(""),
    newCompressor(remote.SnappyBlockCompression),
    newCompressor("zstd"),
  }
  protoCases = []struct {
    name            string
    msgFromConfigFn func(config utils.GenerateConfig) vtprotobufEnhancedMessage
  }{
    {
      name: "prometheus.WriteRequest",
      msgFromConfigFn: func(config utils.GenerateConfig) vtprotobufEnhancedMessage {
        return utils.ToV1(utils.GeneratePrometheusMetricsBatch(config), true, true)
      },
    },
    {
      name: "io.prometheus.write.v2.Request",
      msgFromConfigFn: func(config utils.GenerateConfig) vtprotobufEnhancedMessage {
        return utils.ToV2(utils.ConvertClassicToCustom(utils.GeneratePrometheusMetricsBatch(config)))
      },
    },
  }
  marshallers = []*marshaller{
    newMarshaller("protobuf"), newMarshaller("vtprotobuf"),
  }
)

```

- In Jan 2023, benchstat is [rewritten](https://cs.opensource.google/go/x/perf/+/02c55175bb825ade4507ee5d459ea6a1ab6e0af5)

```bash
benchstat -row ".name /sample /compression /encoder" -filter "/compression:zstd /encoder:protobuf" -col /proto allcases.txt
```

```bash
goos: darwin
goarch: arm64
pkg: go-microbenchmarks-benchstat/across_cases
                          │ prometheus.WriteRequest │   io.prometheus.write.v2.Request   │
                          │         sec/op          │   sec/op     vs base               │
Encode 200 zstd protobuf                 268.8µ ± 2%   103.3µ ± 7%  -61.57% (p=0.002 n=6)
Encode 2000 zstd protobuf               2671.4µ ± 5%   877.4µ ± 4%  -67.16% (p=0.002 n=6)
Encode 10000 zstd protobuf              12.834m ± 2%   3.059m ± 8%  -76.16% (p=0.002 n=6)
geomean                                  2.097m        652.1µ       -68.90%

                          │ prometheus.WriteRequest │    io.prometheus.write.v2.Request    │
                          │      bytes/message      │ bytes/message  vs base               │
Encode 200 zstd protobuf                5.949Ki ± 0%   5.548Ki ±  0%   -6.73% (p=0.002 n=6)
Encode 2000 zstd protobuf               45.90Ki ± 0%   33.49Ki ±  0%  -27.03% (p=0.002 n=6)
Encode 10000 zstd protobuf              227.8Ki ± 1%   121.4Ki ± 25%  -46.70% (p=0.002 n=6)
geomean                                 39.62Ki        28.26Ki        -28.68%

                          │ prometheus.WriteRequest │   io.prometheus.write.v2.Request    │
                          │          B/op           │     B/op      vs base               │
Encode 200 zstd protobuf               336.00Ki ± 0%   64.00Ki ± 0%  -80.95% (p=0.002 n=6)
Encode 2000 zstd protobuf              1799.8Ki ± 1%   368.0Ki ± 0%  -79.55% (p=0.002 n=6)
Encode 10000 zstd protobuf              9.015Mi ± 2%   1.312Mi ± 0%  -85.44% (p=0.002 n=6)
geomean                                 1.732Mi        316.3Ki       -82.17%

                          │ prometheus.WriteRequest │   io.prometheus.write.v2.Request    │
                          │        allocs/op        │ allocs/op   vs base                 │
Encode 200 zstd protobuf                  2.000 ± 0%   2.000 ± 0%        ~ (p=1.000 n=6) ¹
Encode 2000 zstd protobuf                10.000 ± 0%   2.000 ± 0%  -80.00% (p=0.002 n=6)
Encode 10000 zstd protobuf               16.000 ± 0%   2.000 ± 0%  -87.50% (p=0.002 n=6)
geomean                                   6.840        2.000       -70.76%
¹ all samples are equal

```

-> Limitations:

- Rerunning benchmarks with a large amount of cases takes significantly time (slower feedback loop!).
- It yields more complex benchmarking code, which makes it hard to iterate on, and spot places where you benchmark the testing code vs the portion of the code you wanted to.
- For continuous production use, it does not make sense to commit that benchmark with all cases, which are no longer being continued. It fits better to capture such a benchmark in some remote branch for future reference though.

Conclusion:

- Should use both in a hybrid approach, depending on your goals.

- Can even use more features like `-format csv` to export to sheets and render charts

### [Go Plan9 Memo, Speeding Up Calculations 450%](https://pehringer.info/go_plan9_memo.html)

Context

- want more power than Go's concurrency, encounter SIMD - Same Instruction Muliple Data, that many languages either have compiler optimizations use simd or libs that support it.

- "I just want a package that offers a thin abstraction layer over arithmetic and bitwise simd operations."

- Go's assembler uses [Plan9](https://9p.io/plan9/)'s assemblers guidance which uses target platforms instructions and registers with slight modifications to their names and usage. This means that x86 Plan9 is different then say arm Plan9.

  ```
  example
  ┣━ AddInts_amd64.s
  ┗━ main.go
  ```

  ```
  // +build amd64

  TEXT ·AddInts(SB), 4, $0
      MOVL    left+0(FP), AX
      MOVL    right+8(FP), BX
      ADDL    BX, AX
      MOVL    AX, int+16(FP)
      RET
  ```

  ```go
  package main

  import "fmt"

  func AddInts(left, right) int

  func main() {
      fmt.Println("1 + 2 = ", AddInts(1, 2))
  }
  ```

  **LINE 1**: The file contains amd64 specific instructions, so we need to include a Go build tag to make sure Go does not try to compile this file for non x86 machines.

  **LINE 3**: You can think of this line as the functions declaration. TEXT declares that this is a function or text section. ·AddInts(SB) specifies our functions name. 4 represents “NOSPLIT” which we need for some reason. And $0 is the size of the function’s stack frame (used for local variables). It’s zero in this case because we can easily fit everything into the registers.

  **LINE 4 & 5**: Go’s calling convention is to put the function arguments onto the stack. So we MOVe both Long 32-bit values into the AX and BX registers by dereferencing the frame pointer (FP) with the appropriate offsets. The first argument is stored at offset 0. The second argument is stored at offset 8 (int’s only need 4 bytes but I think Go offsets all arguments by 8 to maintain memory alignment).

  **LINE 6**: Add the Long 32-bit value in AX (left) with the Long 32-bit value in BX. And store the resulting Long 32-bit value in AX.

  **LINE 7 & 8**: Go’s calling convention (as far as I can tell) is to put the function return values after its arguments on the stack. So we MOVe the Long 32-bit values in the AX register onto the stack by dereferencing the frame pointer (FP) with the appropriate offset. Which is 16 in this case.

  ![](assets/SmallVectorsFloat32Addition.png)
  ![](assets/MediumVectorsFloat32Addition.png)
  ![](assets/LargeVectorsFloat32Addition.png)

Conclusion:

- There is roughly a 200-450% speed up depending on the number of elements using Plan9. Hope this inspires others to use it.

- The package currently supports x84 only, hopefully arm in future.

---

https://www.bwplotka.dev/2024/go-microbenchmarks-benchstat/

https://pehringer.info/go_plan9_memo.html

## Issue 16: Understand sync.Map

_2024-10-18_

### [Go sync.Map: The Right Tool for the Right Job](https://victoriametrics.com/blog/go-sync-map/index.html)

- Context:

  ```go
  func main() {
      m := make(map[string]int)

      go func() {
          for {
              m["blog"] = 1
          }
      }()

      go func() {
          for {
              fmt.Println(m["blog"])
          }
      }()

      select{} // block-forever trick
  }
  // fatal error: concurrent map read and map write

  ```

- sync.Map:

  - **sync.Map** takes care of all that locking (or atomic operations) for you - so no manual locking needed, and no worrying about race conditions.

  - reading, writing, and deleting keys faster

  ```go
    func main() {
      var syncMap sync.Map

      // store a key-value pair
      syncMap.Store("blog", "VictoriaMetrics")

      // load a value by key "blog"
      value, ok := syncMap.Load("blog")
      fmt.Println(value, ok)

      // delete a key-value pair by key "blog"
      syncMap.Delete("blog")
      value, ok = syncMap.Load("blog")
      fmt.Println(value, ok)
    }

    // Output:
    // VictoriaMetrics true
    // <nil> false
  ```

  ```go
  func (m *Map) Load(key any) (value any, ok bool)

  func (m *Map) Store(key, value any)
  func (m *Map) LoadOrStore(key, value any) (actual any, loaded bool)

  func (m *Map) Delete(key any)
  func (m *Map) LoadAndDelete(key any) (value any, loaded bool)
  func (m *Map) CompareAndDelete(key, old any) (deleted bool)

  func (m *Map) Swap(key, value any) (previous any, loaded bool)
  func (m *Map) CompareAndSwap(key, old, new any) (swapped bool)

  func (m *Map) Range(f func(key, value any) bool)
  func (m *Map) Clear()
  ```

- even when iterate through a map while writing is not safe

  ```go
    func main() {
      m := make(map[string]int)

      go func() {
          for {
              m["blog"] = 1
          }
      }()

      go func() {
          for {
              for range m {
                  fmt.Println("iterating")
              }
          }
      }()

      select{} // block-forever trick
    }

    // fatal error: concurrent map iteration and map write
  ```

  - With **sync.Map.Range**, it’s designed to handle concurrent reads and writes during iteration without locking up the entire map. The trade-off, though, is that you might not get a perfectly consistent snapshot of the map while you’re iterating.

- How it works:

  - two separate native maps: the readonly map and the dirty map.

  ```go
    type Map struct {
      mu Mutex
      read atomic.Pointer[readOnly]
      dirty map[any]*entry
      misses int
    }

    type readOnly struct {
      m       map[any]*entry
      amended bool // true if the dirty map contains some key not in m.
    }

    type entry struct {
      p atomic.Pointer[any]
    }
  ```

  - readonly map is where the fast, lock-free lookups happen; built around an atomic.Pointer, which lets multiple goroutines access it without needing to lock anything. (ideal for scenarios where data is mostly being read and not frequently modified)
    => the readonly map might not always hold the most up-to-date data, therefore dirty map

  - dirty map stores any new entries that get added while the readonly map is still being used for lookups

  ![syncmap_structure](assets/syncmap_structure.png)

  => dirty map contains all the data from the readonly map, along with any new entries that haven’t yet been promoted to the readonly map

  - when you update a value, all you need to do is update this pointer. Since both the readonly and dirty maps point to the same entry

  ![double_pointer_indirection_syncmap](assets/double_pointer_indirection_syncmap.png)

  - The behavior of the pointer in the entry struct defines the state of the entry in the map, and there are 3 possible states:

    - **Normal state**: This is when the entry is valid. The pointer p is pointing to a real value, and the entry exists in those maps, meaning it’s actively in use and can be read without any issues.

    - **Deleted state**: When an entry is deleted from a sync.Map, it’s not immediately removed from the readonly maps. Instead, the pointer p is simply set to nil, signaling that the entry has been deleted but still exists in the maps.

    - **Expunged state**: This is a special state where the key is fully removed. The entry is marked with a special sentinel value that indicates it’s been completely deleted.

  ![state_chart_syncmap](assets/state_chart_syncmap.png)

---

https://victoriametrics.com/blog/go-sync-map/index.html

## Issue 15: Using Go embed, and Reflect

_2024-10-11_

### [Using Go Embed](https://www.bytesizego.com/blog/go-embed)

- The `go:embed` directive tells the Go compiler to include files and folders into the compiled binary at build time. This means your application can access these resources directly from memory without needing to read from the disk at runtime.

- Usage:

  - with a single file message.txt ("hello from bytesizego!")

  ```go
  package main

  import (
    _ "embed"
    "fmt"
  )

  //go:embed message.txt
  var message string

  func main() {
    fmt.Println(message) // hello from bytesizego!
  }

  ```

  - with multiple files

  ```go
  package main

  import (
    _ "embed"
    "fmt"
  )

  //go:embed messages/*.txt
  var messages embed.FS

  func main() {
    files, _ := messages.ReadDir("messages")
    for _, file := range files {
      data, _ := messages.ReadFile("messages/" + file.Name())
      fmt.Printf("File: %s\nContent: %s\n\n", file.Name(), data)
    }
  }
  ```

  - with a directory (the path specified in ReadFile is relative to the embedded root.)

  ```go
  package main

  import (
    "embed"
    "fmt"
  )

  //go:embed static
  var staticFiles embed.FS

  func main() {
    data, _ := staticFiles.ReadFile("static/index.html")
    fmt.Println(string(data))
  }
  ```

- Limitations:

  - File Size: Embedding large files can significantly increase your binary size.
  - File Changes: Changes to the embedded files require recompilation.

### [Reflecting on Go Reflection](https://www.dolthub.com/blog/2024-10-04-reflecting-on-reflect/)

- Context: using generative AI tooling, generated code using Reflect package

```go
bsVal := reflect.ValueOf(blockStore).Elem()

tables := bsVal.FieldByName("tables")

typ := tables.Type()
fmt.Printf("tables.Type: %v\n", typ)
for i := 0; i < typ.NumField(); i++ {
  fmt.Printf("tables %d: %s\n", i, typ.Field(i).Name)
}
for i := 0; i < typ.NumMethod(); i++ {
  fmt.Printf("method %d: %s\n", i, typ.Method(i).Name)
}
```

- [Laws of reflection](https://go.dev/blog/laws-of-reflection)

  - Reflection goes from interface value to reflection object

  - Reflection goes from reflection object to interface value

  - To modify a reflection object, the value must be settable

  => In short, the _Interface_ method is the inverse of the _ValueOf_ function, except that its result is always of static type interface{}.
  Reiterating: Reflection goes from interface values to reflection objects and back again.

- Zeroth Law: Use reflect at your own peril. Misuse it, and it will _panic_ with no regrets.

---

https://www.bytesizego.com/blog/go-embed

https://www.dolthub.com/blog/2024-10-04-reflecting-on-reflect/

## Issue 14: Golang compile-time evaluation and Go bindings to SQLite using wazero

_2024-10-04_

### [Prep: Golang comptime. Pure blasphemy](https://github.com/pijng/prep)

- A small Go tool that enables compile-time function evaluation. By using `prep.Comptime`, you can evaluate functions at build time, replacing them with their computed results. Just like `comptime` from Zig. Except it's not.

- Features
  - Compile-Time Evaluation: Replace function calls with their computed results at build time.
  - Simple Integration: Use prep as both a Go library and a standalone executable.
  - Tooling Support: Easily integrate prep with your Go build process using -toolexec.

```go
package main

import (
  "fmt"
  "github.com/pijng/prep"
)

func main() {
  // This will be evaluated at compile-time
  result := prep.Comptime(fibonacci(300))

  fmt.Println("Result:", result)
}

func fibonacci(n int) int {
  fmt.Printf("calculating fibonacci for %d\n", n)

  if n <= 1 {
    return n
  }

  return fibonacci(n-1) + fibonacci(n-2)
}
```

- Build `go build -a -toolexec="prep <absolute/path/to/project>" main.go`

- Limitations

  - Currently, prep.Comptime only supports basic literals as arguments.

  ```go
  // Pass a basic literal directly
  func job() {
    prep.Comptime(myFunc(1))
  }

  // Use a variable with the value of basic literal from the same scope as wrapped function
  func job() {
    x := 1
    y := 2
    prep.Comptime(myFunc(x, y))
  }
  ```

  - Only functions that can be fully resolved with the provided literal arguments can be evaluated at compile-time, therefore it is impossible to use any values from IO operations.

### [Go-sqlite3: Go bindings to SQLite using wazero](https://github.com/ncruces/go-sqlite3)

- Go module **github.com/ncruces/go-sqlite3** is a cgo-free SQLite wrapper. It provides a **database/sql** compatible driver, as well as direct access to most of the C SQLite API.

- It wraps a Wasm build of SQLite, and uses wazero as the runtime. Go, [wazero](https://github.com/tetratelabs/wazero) and x/sys are the only runtime dependencies.

```go

import "database/sql"
import _ "github.com/ncruces/go-sqlite3/driver"
import _ "github.com/ncruces/go-sqlite3/embed"

var version string
db, _ := sql.Open("sqlite3", "file:demo.db")
db.QueryRow(`SELECT sqlite_version()`).Scan(&version)
```

---

https://github.com/pijng/prep

https://github.com/ncruces/go-sqlite3

https://github.com/tetratelabs/wazero

## Issue 13: Compiler quests and vector vexations

_2024-09-27_

### [Register Allocation in the Go Compiler](https://developers.redhat.com/articles/2024/09/24/go-compiler-register-allocation#go_s_register_allocator__a_high_level_view)

Red Hat has graced us with a deep dive into Go's register allocation in the compiler. It's a fascinating peek under the hood, if you're into that sort of thing. But let's be real: how many of us are actually going to benefit from understanding the intricacies of register allocation? It's like knowing the exact chemical composition of the asphalt you're driving on – interesting, but ultimately irrelevant to most people's daily commute.

The Go team's obsession with compiler speed is admirable, I suppose. They've managed to create a register allocator that's "very fast," taking up to 20% of the entire optimization pipeline's time. Bravo. But at what cost?

```go
// Imagine this is your codebase after Go's "fast" register allocation
func someFunction() {
    // Oops, your variable got spilled into a loop
    for i := 0; i < 1000000; i++ {
        // Load from memory, use, store back to memory
        // Repeat ad nauseam
    }
}
```

Sure, your compile times are blazing fast. But your runtime? Well, that's a different story. The lack of a global view in the register allocator means you might end up with code that's about as efficient as a government bureaucracy.

But hey, at least it compiles quickly, right? Because that's what really matters in production – how fast you can push out potentially suboptimal code.

### [BBQvec: An open-source, embedded vector index for Rust and Go](https://blog.daxe.ai/p/bbqvec-a-scalable-vector-search-library)

Speaking of optimizations, let's talk about the latest darling of the AI world: vector search. Daxe has thrown their hat into the ring with BBQvec, a "scalable vector search library." Because clearly, what the world needs is another way to find the nearest neighbor in high-dimensional space.

Don't get me wrong, vector search is useful. But the way the industry is salivating over it, you'd think it was the second coming of sliced bread. Every startup and their dog is now implementing some form of vector search, often without really understanding why or if they even need it.

```go
// The modern tech stack, apparently
type ModernAIStartup struct {
    VectorSearch    *FancyVectorLib
    LLM             *ChatGPT
    ActualProduct   *WhoNeedsThis
}
```

BBQvec claims to be all about scale, handling "many billions of vectors." That's great, but let's pause for a moment. How many companies actually need to search through billions of vectors? And of those that do, how many are doing it for anything more than vanity metrics or to impress VCs?

The algorithm itself is clever, I'll give them that. Using random orthonormal basis sets and bitmaps for indexing is an interesting approach. But it's telling that their big selling point is how fast they can build the index, not necessarily how accurate or fast the actual searches are.

---

https://developers.redhat.com/articles/2024/09/24/go-compiler-register-allocation#go_s_register_allocator__a_high_level_view

https://blog.daxe.ai/p/bbqvec-a-scalable-vector-search-library

## Issue 12: CLI renaissance with Kubernetes, REST, and terminal readers in the age of complexity

_2024-09-20_

### [Kl: An interactive Kubernetes log viewer for your terminal](https://github.com/robinovitch61/kl)

An interactive Kubernetes log viewer for your terminal.

```
// Example usage of kl
kl --context my-context,other-context -n default,other-ns
```

![](assets/kl1.png)

![](assets/kl2.png)

![](assets/kl3.png)

![](assets/kl4.png)

- This tool allows you to view logs across multiple containers, pods, and even clusters. It's like kubectl logs on steroids, which begs the question: why isn't this functionality built into kubectl itself? The fragmentation of the Kubernetes ecosystem continues unabated, with each new tool solving a problem that arguably shouldn't exist in the first place.

### [Restish](https://rest.sh/#/)

- A "CLI for interacting with REST-ish HTTP APIs." Because apparently, cURL and HTTPie weren't enough. Restish boasts features like automatic API discovery and generated commands:

```
# Perform an HTTP GET request
$ restish api.rest.sh/types

# Above is equivalent to:
$ restish GET https://api.rest.sh/types
```

```https
HTTP/2.0 200 OK
Content-Length: 278
Content-Type: application/cbor
Date: Tue, 19 Apr 2022 21:17:58 GMT

{
  $schema: "https://api.rest.sh/schemas/TypesModel.json"
  boolean: true
  integer: 42
  nullable: null
  number: 123.45
  object: {
    binary: 0xdeadc0de
    binary_long: 0x00010203040506070809...
    date: 2022-04-23
    date_time: 2022-04-23T21:41:58.20449651Z
    url: "https://rest.sh/"
  }
  string: "Hello, world!"
  tags: ["example", "short"]
}
```

While it's undeniably clever, one has to wonder: are we solving real problems, or are we just creating more abstraction layers to satisfy our insatiable appetite for "developer experience"? The irony of using a CLI to interact with REST APIs – which were designed for machine-to-machine communication – is not lost on me.

### [A fast full-text cli reader (works also with lobste.rs articles content)](https://github.com/piqoni/cast-text)

- A "zero latency, easy-to-use full-text news terminal reader." Yes, you read that correctly. In 2024, we're excited about reading RSS feeds in the terminal. It's as if we've come full circle, rejecting the rich multimedia experiences of modern web browsers in favor of monospaced fonts and ANSI color codes.

```
// Reading lobste.rs with cast-text
cast-text -rss https://lobste.rs/rss
```

![](assets/cast-text.png)

The Pendulum Swings This trend towards CLI tools in Go is part of a larger pendulum swing in our industry. We've gone from command-line interfaces to graphical UIs, from desktop applications to web apps, and now we're seeing a resurgence of terminal-based tools. It's as if we're collectively suffering from option paralysis, overwhelmed by the complexity of modern software stacks and yearning for the perceived simplicity of text-based interfaces.

But here's the rub: these new CLI tools are often just as complex as their graphical counterparts. They're built on layers of abstractions, requiring knowledge of specific command syntaxes and flags. We haven't simplified; we've just shifted the complexity to a different domain.

---

https://github.com/robinovitch61/kl

https://rest.sh/#/

https://github.com/piqoni/cast-text

## Issue 11: The gopher's LLM revolution - actors, frameworks, and the future of Go

_2024-09-13_

### [Go Survey](https://google.qualtrics.com/jfe/form/SV_ei0CDV2K9qQIsp8?s=b)

- The feedbacks from us - Gophers will help Go Team to understand:
  - How Go is being used across various industries and organizations
  - The challenges you face as a Go developer
  - The features and improvements you’d like to see in future releases
  - How we can better support the thriving Go community

### [Building LLM-powered applications in Go](https://go.dev/blog/llmpowered)

Ah, the sweet smell of progress mixed with the stench of hype. Welcome to the brave new world of Go, where Large Language Models reign supreme and every developer suddenly fancies themselves an AI expert. But before we dive headfirst into this cesspool of buzzwords and overengineered solutions, let's take a moment to examine what's really going on in our beloved gopher-land.

The LLM Gold Rush: Go's Ticket to Relevance? It seems the Go team has finally woken up to the fact that LLMs are the new darling of the tech world. Their recent blog post on "Building LLM-powered applications in Go" reads like a desperate attempt to stay relevant in a landscape dominated by Python frameworks. But here's the kicker - they might actually be onto something.

Go's strengths in concurrency and networking make it a natural fit for the distributed nature of LLM applications. It's like watching a middle-aged dad suddenly discover he's got a knack for TikTok dances - unexpected, slightly uncomfortable, but oddly compelling.

Let's look at their RAG server example:

```Go
func main() {
	ctx := context.Background()
	wvClient, err := initWeaviate(ctx)
	if err != nil {
		log.Fatal(err)
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	genaiClient, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		log.Fatal(err)
	}
	defer genaiClient.Close()

	server := &ragServer{
		ctx:      ctx,
		wvClient: wvClient,
		genModel: genaiClient.GenerativeModel(generativeModelName),
		embModel: genaiClient.EmbeddingModel(embeddingModelName),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("POST /add/", server.addDocumentsHandler)
	mux.HandleFunc("POST /query/", server.queryHandler)

	port := cmp.Or(os.Getenv("SERVERPORT"), "9020")
	address := "localhost:" + port
	log.Println("listening on", address)
	log.Fatal(http.ListenAndServe(address, mux))
}
```

[full version at](https://github.com/golang/example/blob/master/ragserver/ragserver/main.go)

Simple, clean, and to the point. No fancy decorators, no convoluted class hierarchies - just good old Go simplicity. It's almost refreshing in a world of over-abstracted Python monstrosities.

But here's where things get interesting. The Go team isn't content with just providing raw tools; they're pushing frameworks like LangChainGo and Genkit. It's as if they've looked at the Python ecosystem and thought, "Hey, we can create incomprehensible abstractions too!"

LangChainGo: Because We Needed Another Layer of Abstraction LangChainGo promises to be the silver bullet for all your LLM needs. Want to switch vector databases without rewriting your entire codebase? LangChainGo's got you covered:

```Go
type VectorStore interface {
    AddDocuments(ctx context.Context, docs []schema.Document, options ...Option) ([]string, error)
    SimilaritySearch(ctx context.Context, query string, numDocuments int, options ...Option) ([]schema.Document, error)
}
```

It's a beautiful interface, really. So clean, so abstract. But let's be real - how often are you actually switching vector databases? This is solution in search of a problem, the software equivalent of a Swiss Army knife when all you needed was a bottle opener.

Genkit: Google's Answer to... Everything? Not to be outdone, Google throws its hat into the ring with Genkit. It's like LangChain, but with that special Google touch that screams, "We'll deprecate this in two years, but trust us for now!"

Genkit promises "production features" and "integrated developer tooling." Because apparently, what the world really needed was another way to manage prompts and deployments. It's as if Google looked at the mess of AI tooling and thought, "You know what this needs? More complexity!"

#### [The Ergo Framework: Erlang's Ghost Haunts Go](https://github.com/ergo-services/ergo)

Just when you thought we couldn't possibly need another framework, along comes Ergo. It's bringing the actor model to Go, because apparently, we all miss the days of Erlang and its byzantine approach to concurrency.

Ergo boasts features like _Network Transparency_, _Observability_ and a _Supervisor Tree_. It's like they've taken every buzzword from distributed systems and thrown them into a blender. The result? A framework that promises to solve problems you didn't even know you had.

Here's a taste of their "Quick Start":

```bash
$ ergo -init MyNode \
      -with-app MyApp \
      -with-sup MyApp:MySup \
      -with-actor MySup:MyActor \
      -with-web MyWeb \
      -with-actor MyActor2 \
      -with-observer
```

Because nothing says "simplicity" like a command line that looks like it was designed by a committee of enterprise architects.

The Gopher's Dilemma So here we are, standing at the crossroads of Go's future. On one side, we have the simplicity and performance that made Go great. On the other, we have a smorgasbord of frameworks and abstractions promising to turn Go into a one-stop shop for all your LLM needs.

The question is, do we really need all this? Are we solving real problems, or are we just creating new ones in the name of "progress"?

Don't get me wrong - it's exciting to see Go evolving and adapting to new challenges. But let's not lose sight of what made Go great in the first place. We don't need to become Python or Erlang. We need to be the best damn Go we can be.

As we forge ahead into this brave new world of LLMs and AI, let's remember the virtues of simplicity and pragmatism. By all means, let's embrace new technologies and paradigms. But let's do it the Go way - with clear, concise code that solves real problems, not imaginary ones.

The future of Go in the LLM era is bright, but it's up to us to ensure it doesn't become a tangled mess of frameworks and abstractions. Let's build tools that empower developers, not confuse them. After all, isn't that what Go was all about in the first place?

Remember, in the world of software development, the only constant is change. But that doesn't mean we have to lose our way. Stay sharp, stay critical, and above all, stay Go.

---

https://go.dev/blog/survey2024-h2

https://go.dev/blog/llmpowered

https://github.com/ergo-services/ergo

## Issue 10: Script, telemetry

_2024-09-06_

### [Script: Making it easy to write shell-like scripts in Go](https://github.com/bitfield/script)

- Go library that simplifies writing shell-like scripts by providing a fluent API for common operations like file manipulation, text processing, and command execution.

- Key features:

  - Chainable methods for piping operations
  - Easy file and directory operations
  - Text processing functions (grep, sed-like replacements)
  - Command execution and output handling
  - Error handling integrated into the API

- Usage:

  ```go
  // Read the contents of a file as a string
  contents, err := script.File("test.txt").String()

  // Count the number of lines that match a pattern
  numErrors, err := script.File("test.txt").Match("Error").CountLines()

  // Filter all the results through some arbitrary Go function
  script.Stdin().Match("Error").FilterLine(strings.ToUpper).Stdout()


  // Append the first 10 arguments to a file
  script.Args().Concat().Match("Error").First(10).AppendFile("/var/log/errors.txt")

  // Simple HTTP request
  script.Get("https://wttr.in/London?format=3").Stdout()
  // Output:
  // London: 🌦   +13°C
  ```

### [Go Telemetry](https://go.dev/blog/gotelemetry)

- Context:

  - the Go toolchain can collect usage and breakage statistics that help the Go team understand how the Go toolchain is used and how well it is working.

  ![](assets/dataflow.png)

- Usage:

  ```
  go telemetry on

  go telemetry off

  // revert to the default mode of local-only telemetry
  go telemetry local
  ```

---

https://github.com/bitfield/script

https://go.dev/blog/gotelemetry

https://go.dev/doc/telemetry

## Issue 9: TinyGo, SQLite vector search, and authorization

_2024-08-30_

### [TinyGo 0.33.0: The Go Compiler for 'Small Places'](https://github.com/tinygo-org/tinygo/releases/tag/v0.33.0)

- Context:

  - TinyGo is a Go compiler designed for small environments like microcontrollers, WebAssembly (wasm/wasi), and command-line tools.

  - It utilizes Go language libraries and LLVM to offer an alternative method for compiling Go programs

- Changelog highlights:

  - **Go 1.23 support** (including the new range-over-func language feature)
  - ...

### [Sqlite-vec: A Vector Search Extension for SQLite](https://github.com/asg017/sqlite-vec)

- Context:

  - An extremely small, "fast enough" vector search SQLite extension that runs anywhere.
    - Store and query float, int8, and binary vectors in vec0 virtual tables
    - Written in pure C, no dependencies, runs anywhere SQLite runs (Linux/MacOS/Windows, in the browser with WASM, Raspberry Pis, etc.)
    - Pre-filter vectors with rowid IN (...) subquerie

- Usage:

```
go get -u github.com/asg017/sqlite-vec-go-bindings/ncruces
```

```go
package main

import (
	_ "embed"
	"log"

	_ "github.com/asg017/sqlite-vec-go-bindings/ncruces"
	"github.com/ncruces/go-sqlite3"
)

func main() {
	db, err := sqlite3.Open(":memory:")
	if err != nil {
		log.Fatal(err)
	}

	stmt, _, err := db.Prepare(`SELECT vec_version()`)
	if err != nil {
		log.Fatal(err)
	}

	stmt.Step()
	log.Printf("vec_version=%s\n", stmt.ColumnText(0))
	stmt.Close()
}
```

```sql
.load ./vec0

create virtual table vec_examples using vec0(
  sample_embedding float[8]
);

-- vectors can be provided as JSON or in a compact binary format
insert into vec_examples(rowid, sample_embedding)
  values
    (1, '[-0.200, 0.250, 0.341, -0.211, 0.645, 0.935, -0.316, -0.924]'),
    (2, '[0.443, -0.501, 0.355, -0.771, 0.707, -0.708, -0.185, 0.362]'),
    (3, '[0.716, -0.927, 0.134, 0.052, -0.669, 0.793, -0.634, -0.162]'),
    (4, '[-0.710, 0.330, 0.656, 0.041, -0.990, 0.726, 0.385, -0.958]');


-- KNN style query
select
  rowid,
  distance
from vec_examples
where sample_embedding match '[0.890, 0.544, 0.825, 0.961, 0.358, 0.0196, 0.521, 0.175]'
order by distance
limit 2;
/*
┌───────┬──────────────────┐
│ rowid │     distance     │
├───────┼──────────────────┤
│ 2     │ 2.38687372207642 │
│ 1     │ 2.38978505134583 │
└───────┴──────────────────┘
*/
```

### [Permify 1.0: Open Source Authorization as a Service](https://github.com/Permify/permify)

- Permify is an open-source authorization as a service inspired by [Google Zanzibar](https://storage.googleapis.com/pub-tools-public-publication-data/pdf/41f08f03da59f5518802898f68730e247e23c331.pdf).

- **Centralize & standardize your authorization**: Abstract your authorization logic from your codebase and application logic to easily reason, test, and debug your authorization. Behave your authorization as a sole entity and move faster with in your core development.

- **Build granular permissions for any case you have**: You can create granular (resource-specific, hierarchical, context aware, etc) permissions and policies using Permify's domain specific language that is compatible with RBAC, ReBAC and ABAC.

- **Set authorization for your tenants by default**: Set up isolated authorization logic and custom permissions for your vendors/organizations (tenants) and manage them in a single place.

- **Scale your authorization as you wish**: Achieve lightning-fast response times down to 10ms for access checks with a proven infrastructure inspired by Google Zanzibar.

---

- https://github.com/tinygo-org/tinygo/releases/tag/v0.33.0
- https://github.com/asg017/sqlite-vec
- https://github.com/Permify/permify/releases/tag/v1.0.0
- https://storage.googleapis.com/pub-tools-public-publication-data/pdf/41f08f03da59f5518802898f68730e247e23c331.pdf

## Issue 8: Jupyter notebooks, Kubernetes tools, GopherCon talks

_2024-08-23_

### [GoNB: A Go Notebook Kernel for Jupyter](https://github.com/janpfeifer/gonb)

- Auto-complete and contextual help while coding.
- Rich content display: HTML, markdown (with latex), images, javascript, svg, videos, etc.

![](assets/go-commentary-aug-23_gonb-auto-complete.webp)

- Widgets (sliders, buttons) support: interact using HTML elements
- Plotly integration using [go-plotly](https://github.com/go-echarts/go-echarts)
- Apache ECharts integration using [gonb-echarts](https://github.com/janpfeifer/gonb-echarts) and [go-echarts](https://github.com/go-echarts/go-echarts)

![](assets/go-commentary-aug-23_gonb-chart.webp)

### [Kubetrim: Trim Your KUBECONFIG Automatically](https://github.com/alexellis/kubetrim)

```cli
$ kubectx

default
do-lon1-openfaas-cluster
kind-2
kind-ingress

$ kubetrim

kubetrim (dev) by Alex Ellis

Loaded: /home/alex/.kube/config. Checking..
  - kind-2: ✅
  - kind-ingress: ❌ - (failed to connect to cluster: Get "https://127.0.0.1:40349/api/v1/nodes": dial tcp 127.0.0.1:40349: connect: connection refused)
  - default: ✅
  - do-lon1-openfaas-cluster: ❌ - (failed to connect to cluster: Get "https://da39a3ee5e6b4b0d3255bfef95601890afd80709.k8s.ondigitalocean.co.uk/api/v1/nodes": dial tcp: lookup da39a3ee5e6b4b0d3255bfef95601890afd80709.k8s.ondigitalocean.co.uk on 127.0.0.53:53: no such host)
Updated: /home/alex/.kube/config (in 364ms).

$ kubectx

default
kind-2
```

### [12 Talks from GopherCon UK 2024](https://youtube.com/playlist?list=PLDWZ5uzn69ezR6D6FUj_iBSOyRc9xaZFP&si=IdFGYzOivQqFRsVb)

- Key highlights:
  1. **Performance testing tools**: One of the standout presentations was about a home-grown performance testing tool used to replay HTTP access logs against infrastructure setups. This tool was crucial for performance testing at scale, particularly during low-traffic periods, ensuring the system’s responsiveness without disrupting overnight operations.
  2. **Software design and complexity**: A session by Shivam Acharya and Peter Chai delved into the complexities of software design, discussing how complexity should be embraced and managed thoughtfully. They explored how decisions in API design can either simplify or complicate the interaction between different system components.
  3. **Event-driven workflows**: Another notable talk covered the implementation of event-driven workflows, highlighting the challenges and decisions in designing a technology-agnostic library that could work with various technologies like Kafka, Redux, Postgres, and MySQL.
  4. **AI and the future of work**: There was also a provocative discussion on how AI is influencing the future of jobs in tech, encouraging developers to think about how they can stay relevant as automation and AI continue to evolve.

---

- https://github.com/janpfeifer/gonb
- https://github.com/go-echarts/go-echarts
- https://github.com/janpfeifer/gonb-echarts
- https://github.com/go-echarts/go-echarts
- https://github.com/alexellis/kubetrim
- https://youtube.com/playlist?list=PLDWZ5uzn69ezR6D6FUj_iBSOyRc9xaZFP&si=IdFGYzOivQqFRsVb

## Issue 7: Releases, websockets, and struct behavior

_2024-08-16_

### [Go 1.23 Release Note](https://go.dev/doc/go1.23)

- Full notes that you should skim through to get full-fledged of Go 1.23

### [A New Home for nhooyr/websocket](https://coder.com/blog/websocket)

- [nhooyr/websocket](https://github.com/nhooyr/websocket) is adopted by [Coder](https://coder.com/), CDE - Cloud Development Environment

### [Go structs are copied on assignment ](https://jvns.ca/blog/2024/08/06/go-structs-copied-on-assignment/)

- Inspired by [Common Go Mistakes](https://100go.co/)

```go
type Thing struct {
    Name string
}

func main() {
  thing := Thing{"record"}
  other_thing := thing
  other_thing.Name = "banana"
  fmt.Println(thing)            // {record}
}
```

```go
type Thing struct {
  Name string
}

func findThing(things []Thing, name string) *Thing {
  for _, thing := range things {
    if thing.Name == name {
      return &thing
    }
  }
  return nil
}

func main() {
  things := []Thing{Thing{"record"}, Thing{"banana"}}
  thing := findThing(things, "record")
  thing.Name = "gramaphone"
  fmt.Println(things)           // [{record} {banana}]
}
```

=> fix:

```go
func findThing(things []Thing, name string) *Thing {
  for i := range things {
    if things[i].Name == name {
      return &things[i]
    }
  }
  return nil
}
```

```go
func main() {
	x := []int{1, 2, 3, 4, 5}
	y := x[2:3]
	fmt.Println(y)
	y = append(y, 555)          // y = {3, 555}
	fmt.Println(x)              // {1, 2, 3, 555, 5}
}
```

=> fix:

```go
func main() {
	x := []int{1, 2, 3, 4, 5}
	y := x[2:3:3]
	fmt.Println(y)
	y = append(y, 555)          // y = {3, 555}
	fmt.Println(x)              // {1, 2, 3, 4, 5}
}
```

---

- https://go.dev/doc/go1.23
- https://coder.com/blog/websocket
- https://github.com/coder/websocket
- https://jvns.ca/blog/2024/08/06/go-structs-copied-on-assignment/
- https://100go.co/

## Issue 6: GUI framework, leadership change

_2024-08-09_

### [Cogent Core: A New GUI Framework for Go](https://www.cogentcore.org/blog/initial-release)

- GUI framework written in Go that allows you Code Once, Rune Everywhere (Core) (macOS, Windows, Linux, iOS, Android and web)

- The same Cogent Core app running on many devices using the same code:

![](assets/cogent-core-multi-devices.png)

- Simple Hello World app:

```go
package main

import "cogentcore.org/core/core"

func main() {
	b := core.NewBody()
	core.NewButton(b).SetText("Hello, World!")
	b.RunMainWindow()
}
```

- Supports all usual GUI widgets:

```go
core.NewButton(b).SetText("Send").SetIcon(icons.Send).OnClick(func(e events.Event) {
	core.MessageSnackbar(b, "Message sent")
})
core.NewText(b).SetText("Name:").SetTooltip("Enter your name in the text field")
core.NewTextField(b).SetPlaceholder("Jane Doe")
value := 0.5
spinner := core.Bind(&value, core.NewSpinner(b))
slider := core.Bind(&value, core.NewSlider(b))
spinner.OnChange(func(e events.Event) {
	slider.Update()
})
slider.OnChange(func(e events.Event) {
	spinner.Update()
})
core.NewColorButton(b).SetColor(colors.Orange)
type language struct {
	Name   string
	Rating int
}
sl := []language{{"Go", 10}, {"Python", 5}}
core.NewTable(b).SetSlice(&sl).OnChange(func(e events.Event) {
	core.MessageSnackbar(b, fmt.Sprintf("Languages: %v", sl))
})
```

![](assets/cogent-core-widgets.png)

- Interactive plots of data

```go
type Data struct {
	Time   float32
	Users  float32
	Profit float32
}
plotcore.NewPlotEditor(b).SetSlice([]Data{
	{0, 500, 1520},
	{1, 800, 860},
	{2, 1600, 930},
	{3, 1400, 682},
})
```

![](assets/cogent-core-plots.png)

- Key features:

  - A full set of GUI widgets, with built-in support for most elements of [Material 3](https://m3.material.io/) standard

    - tooltips
    - drag-and-drop
    - sprites
    - popup completion
    - full text editor with code highlighting
    - ...

  - Extension styling properties makes styling easy

  - Responsive widget elements enables 1 codebase run across platforms

  - Transparent implementation of widgets makes customization easy

  - Dynamic color system

  - ...

- Full software ecosystem

  ![](assets/cogent-core-neural-network.png)

  ![](assets/cogent-core-cogent-code.png)

  ![](assets/cogent-core-cogent-canvas.png)

### [Russ Cox Steps Down as Tech Lead of Go](https://groups.google.com/g/golang-dev/c/0OqBkS2RzWw/m/GzWvX5u6AQAJ?pli=1)

- Russ stepped down as Tech Lead of Go after 12 years, as Austin Clements taking the role.

- Now Russ is fulling working on Oscar - an AI agent system to help maintain OSS (including Gaby)

- Sources:
  - https://go.googlesource.com/oscar/+/refs/heads/master/README.md
  - https://go.googlesource.com/oscar/+/refs/heads/master/internal

---

- https://www.cogentcore.org/blog/initial-release
- https://groups.google.com/g/golang-dev/c/0OqBkS2RzWw/m/GzWvX5u6AQAJ?pli=1
- https://go.googlesource.com/oscar/+/refs/heads/master/README.md
- https://go.googlesource.com/oscar/+/refs/heads/master/internal

## Issue 5: Features, memory optimization, Minecraft server, code editor, and LLM tool

_2024-08-02_

### [Go Features By Version](https://antonz.org/which-go/)

- Context:

  - Go is released every six months.
  - Each major Go release is supported until there are two newer major releases.
  - Critical problems are fixed by issuing minor revisions.

- Solution:

  ![](assets/go-features-by-version.png)

### [Make Your Programs Use Less Memory](https://github.com/dkorunic/betteralign)

- Context:

  - Package [fieldalignment](https://pkg.go.dev/golang.org/x/tools/go/analysis/passes/fieldalignment) defines an Analyzer that detects structs that would use less memory if their fields were sorted.

- Solution:

  - betteralign is fork of fieldalignment with:
    - skips over generated files, either files with known "generated" suffix (\_generated.go, \_gen.go, .gen.go, .pb.go, .pb.gw.go) or due to package-level comment containing Code generated by... DO NOT EDIT. string,
    - skips over test files (files with \_test.go suffix),
    - skips over structs marked with comment betteralign:ignore,
    - doesn't lose comments (field comments, doc comments, floating comments or otherwise) but the comment position heuristics is still work in progress,
    - does very reliable atomic file I/O with strong promise not to corrupt and/or lose contents upon rewrite (not on Windows platform),
    - has more thorough testing in regards to expected optimised vs golden results,
    - integrates better with environments with restricted CPU and/or memory resources (Docker containers, K8s containers, LXC, LXD etc).

### [A Go-powered Minecraft 1.21 server](https://github.com/ZeppelinMC/Zeppelin)

- Context:

  - Blazingly fast, highly optimized server implementation written in Go for Minecraft 1.21

### [A Source Code Editor in Pure Go](https://github.com/jmigpin/editor)

- Auto-indentation of wrapped lines.
- No code coloring (except comments and strings).
- Many TextArea utilities: undo/redo, replace, comment, ...
- Handles big files.
- Start external processes from the toolbar with a click, capturing the output to a row.
- Drag and drop files/directories to the editor.
- Detects if files opened are changed outside the editor.
- Plugin support
  - examples such as gotodefinition and autocomplete below.
- Golang specific:
  - Calls goimports if available when saving a .go file.
  - Clicking on .go files identifiers will jump to the identifier definition (needs gopls).
  - Debug utility for go programs (GoDebug cmd).
    - allows to go back and forth in time to consult code values.
- Language Server Protocol (LSP) (code analysis):
  - -lsproto cmd line option
  - basic support for gotodefinition and completion
  - mostly being tested with clangd and gopls
- Inline complete
  - code completion by hitting the tab key (uses LSP).

![](assets/go-editor-image.png)

### [Ollama 0.3 Quickly Run Large Language Models](https://github.com/ollama/ollama)

![](assets/ollama.png)

---

- https://antonz.org/which-go
- https://github.com/dkorunic/betteralign
- https://pkg.go.dev/golang.org/x/tools/go/analysis/passes/fieldalignment
- https://github.com/ZeppelinMC/Zeppelin
- https://github.com/jmigpin/editor
- https://github.com/ollama/ollama

## Issue 4: Ethical hacking, HTTP requests, Mac app development

_2024-07-26_

### [Using Go to send 500 Million HTTP Requests to 2.5 Million Hosts](https://www.moczadlo.com/2024/how-i-sent-500-million-http-requests-in-under-24h)

- Context:

  - (Ethical hacking) To send 500 million of non RFC HTTP/1.1 requests to 2.5 million hosts in approx. a couple of hours.

  - Chose Go because of great concurrency support and fast. (The author did try Rust but too hard to understand)

- Problems:

  - If you use `curl` to send the requests (0.5s per request) 1 by 1 from single machine => 7.9 years.

  - Data transfer perspective (not that much):

    - 500 million requests \* 1 KB (average request size) ≈ 478 GB
    - 500 million responses \* 5 KB (average response size) ≈ 2.33 TB

  - Break down what HTTP client does in each call:

  ```go
  resp, err := http.Get("https://example.com")
  ```

        1. Resolve DNS
        2. TCP connect to another machine
        3. TLS handshake (generate and exchange cryptographic keys)
        4. Prepare HTTP request to send (normalize, encode)
        5. Wait for response and read it
        6. Parse response (decode, normalize and parse)
        7. Close connection (optional)

  - Measured results of sending HTTP/1.1 requests to subdomains of `*.wordpress.com` (wordpress.com has [wildcard dns](https://en.wikipedia.org/wiki/Wildcard_DNS_record) to prevent caching) shows that:

  ![](assets/http-request-timings.webp)

  - Resolving DNS and opening new TLS connection is slow (~160ms) but probably not notice how slow it is because the browser will open connect once and reuse it for many requests and HTTP/2 or HTTP/3 would be faster.

  - Can't rely on reusing connections since the need of sending many requests to many different hosts in different networks.

  - Would get rate-limited or banned quickly.

- Solution: Spread the load on many servers

  - Remove what we can from the steps: `Request parsing` and `DNS resolution`. (Simple crafted HTTP/1.1 requests by hand and [massdns](https://github.com/blechschmidt/massdns) to resolve thousands of DNS records in a couple of seconds)

  - Design the HTTP/1.1 sending mechanism:

    - Multiple worker pools that piped together:

      1. Request generation pool
      2. Sender pool
      3. Response pool

    ![](assets/cannon-diagram.webp)

    - Use a concurrency-safe [queue](https://github.com/enriquebris/goconcurrentqueue) to seperate the worker pools and to reuse the objects and memory as much as possible.

  - Choose `fasthttp` over `net/http` to get x10 faster according to the [benmark](https://github.com/valyala/fasthttp?tab=readme-ov-file#http-client-comparison-with-nethttp)

  - Optimize the fasthttp's client to get rid of normalization step (fork and edit the lib)

    ```go
    req := rawfasthttp.AcquireRequest()
    resp := rawfasthttp.AcquireResponse()

    rawBytes := []byte("GET / HTTP/1.1\r\nHost: example.com\r\n\r\n")

    req.SetRequestRaw(rawBytes)

    err := client.Do(req, resp)
    ```

  - Override the `Dial` function to use the resolved IP addresses:

    ```go
    // single instance of custom dialer
    customDialer = &rawfasthttp.TCPDialer{}

    req := rawfasthttp.AcquireRequest()
    resp := rawfasthttp.AcquireResponse()

    resolved_ip := "127.0.0.1"

    req.SetDial(func(addr string) (net.Conn, error) {
        return customDialer.Dial(resolved_ip)
    })

    // ...
    ```

  - Optimize TLS handshake to prevent wasting CPU cycles by hardcoding the keys but had not enough time to change the fork so skipped.

  - Split 2.5 million hosts into chunks with 200 hosts per chunk (not take more than a couple of minutes to complete but big enough to not waste time on creating new connections). (200 is optimal for the usecase, the worker pods were prone to fail => minimize the lost requests/ retries)

  - Chose DigitalOcean with K8s to scale (cheapest one - 2TB+ of bandwidth per droplet). Also DigitalOcean gives new public IP for each droplet to avoid being banned from Cloudfare.

  - Wrote a auto-scroller to scale the deployment up and down based on the targets in queue (0 to 60 pods in a couple of minutes)

- Conclusion:

  - The final results:

    - Each pod achieved 100-400 requests per second
    - Scaled to 60 pods
    - Sent 500 million HTTP/1.1 requests to 2.5 million hosts in just a couple of hours

  - Although there will be a next post for a further detailed result,

### [How I build simple Mac apps using Go](https://dev.to/progrium/how-i-build-simple-mac-apps-using-go-104j)

- Context:

  - There were no bindinds to native Mac APIs for Go => [DarwinKit](https://github.com/progrium/darwinkit)

    - Bindings for [33 frameworks](https://pkg.go.dev/github.com/progrium/darwinkit/macos@main#section-directories) with near complete coverage:
      - 2,353 classes
      - 23,822 methods and properties
      - 9,519 constants/enums
      - 543 structs
    - Automatic conversion and use of native Go builtin types in APIs
    - Support for block arguments as Go functions with properly typed arguments
    - Pre-made delegate implementations you can simply set Go functions on
    - 1-to-1 mapping to Objective-C symbols while still idiomatic to Go
    - Documentation for all symbols including a link to official Apple docs on that symbol
    - Growing collection of high-quality example starter apps for sponsors

- Future:

  - There are no bindings to Apple framework functions. The team are working on generating native Go function bindings for every framework function. Meanwhile, there is a workaround that involves using CGO (which DarwinKit is trying to help you avoid).

  - On the way of making DarwinKit not use CGO at all! Using [purego](https://github.com/ebitengine/purego), we can call into Apple frameworks without involving CGO. This will improve build time, make smaller binaries, and allow DarwinKit to be used in programs that need to avoid CGO for whatever reason.

  - For iOS and mobile devs, generated bindings are for MacOS for now. Any contribution is welcome.

---

- https://www.moczadlo.com/2024/how-i-sent-500-million-http-requests-in-under-24h
- https://dev.to/progrium/how-i-build-simple-mac-apps-using-go-104j
- https://github.com/progrium/darwinkit

## Issue 3: Generic collections, generics constraints, AI bot

_2024-07-12_

### [Writing generic collection types in Go: the missing documentation](https://www.dolthub.com/blog/2024-07-01-golang-generic-collections/#the-solution)

- Context:

  - Generics were released in Go 1.18 (~2y), is not used very much - only in some good cases for methods in _slices_ and _maps_ packages.

- Problem:

  - Wanted to write a sortable Set (slice or map) of any type but the documents for a generic collection are poor and immature.

  ```go
  type Sortable[T comparable] interface {
      Less(member T) bool
  }

  type Name struct {
      First string
      Last string
  }

  func (n Name) Less(member Name) bool {
      return n.First < member.First || n.First == member.First && n.Last < member.Last
  }

  var _ Sortable[Name] = Name{}
  ```

  ```go
  type SortableSet[T Sortable] interface { // cannot use generic type Sortable[T comparable] without instantiation
      Add(member T)
      Size() int
      Contains(member T) bool
      Sorted() []T
  }
  ```

  - Can try what built-in slices does in slices.go

  ```go
  func Index[S ~[]E, E comparable](s S, v E) int {
      for i := range s {
          if v == s[i] {
              return i
          }
      }
      return -1
  }
  ```

  ```go
  type SortableSet[T Sortable[E], E comparable] interface {
      Add(member T)
      Size() int
      Contains(member T) bool
      Sorted() []T
  }
  ```

  - But not work for map:

  ```go
  type MapSet[T Sortable[E], E comparable] struct {
      members map[T]struct{} // invalid map key type T (missing comparable constraint)
  }
  ```

- Solution:

  ```go
  // Type set used only for constraints, not vars
  type SortableConstraint[T comparable] interface {
      comparable
      Sortable[T]
  }

  type SortableSet[T SortableConstraint[T]] interface {
      Add(member T)
      Size() int
      Contains(member T) bool
      Sorted() []T
  }

  type SliceSet[T SortableConstraint[T]] struct {
      members []T
  }

  type MapSet[T SortableConstraint[T]] struct {
      members map[T]struct{}
  }
  ```

- Conclusion:

  - Current Google rearch results are not really helpful since the immaturity

  - The official Go documentations (proposal/ language spec) are too long

  - This article is very handy as considerably pioneering in real life implementation at [@Dolt](https://github.com/dolthub/dolt)

  - Cheat sheet found in spec by the authors:

  ```
  type argument      type constraint                // constraint satisfaction

  int                interface{ ~int }              // satisfied: int implements interface{ ~int }
  string             comparable                     // satisfied: string implements comparable (string is strictly comparable)
  []byte             comparable                     // not satisfied: slices are not comparable
  any                interface{ comparable; int }   // not satisfied: any does not implement interface{ int }
  any                comparable                     // satisfied: any is comparable and implements the basic interface any
  struct{f any}      comparable                     // satisfied: struct{f any} is comparable and implements the basic interface any
  any                interface{ comparable; m() }   // not satisfied: any does not implement the basic interface interface{ m() }
  interface{ m() }   interface{ comparable; m() }   // satisfied: interface{ m() } is comparable and implements the basic interface interface{ m() }

  ```

### [Russ Cox is working on a bot](https://github.com/golang/go/discussions/67901)

- Context:

  - As there is [@gopherbot](https://github.com/gopherbot) to try to help automate: labeling, commenting, changing issues' status...

  - Gaby (Go AI Bot) is being built (experiment) for what LLMs can be used effectively (including identifying what they should not be used for).

  - Source is not official nor open, can help snoop around in [this search](https://github.com/golang/go/issues?q=is%3Aissue+is%3Aopen+commenter%3Agabyhelp) and help send feedback.

---

- <https://www.dolthub.com/blog/2024-07-01-golang-generic-collections/#the-solution>
- <https://go.dev/ref/spec>
- <https://github.com/golang/go/discussions/67901>
- <https://pkg.go.dev/rsc.io/gaby>

## Issue 2: Go 1.23 iterators

_2024-07-05_

### [Why People are Angry over Go 1.23 Iterators](https://www.gingerbill.org/article/2024/06/17/go-iterator-design/)

- Context:
  - Most languages provide standardized way to iterate over values stored in [containers](<https://en.wikipedia.org/wiki/Container_(abstract_data_type)>).
- Problem:

  - Go has `for` `range` for maps, slices, strings, arrays and channels but no generic mechanism for user-written containers.

  - Short list of some non-generic iterators:

    - _runtime.CallersFrames_: returns `runtime.Frames` iterates over stack frames; `Frames` has a `Next` method and a bool to check if there are more frames.

    - _bufio.Scanner_: iterates through an `io.Reader`; `Scan` method advances to the next value, `Bytes` method to return the value and `Err` to return error.

    - _database/sql.Rows_: iterates through the results of a query; also has `Scan` method.

  - Before Generics were introduced, no way to write an interface that described an iterator that would cover all of the use cases...

- Solution:

  - Go 1.22 proposal of adding package `iter` can range over integers and functions:

  ```go
  type (
    Seq[V any]     func(yield func(V) bool) bool
    Seq2[K, V any] func(yield func(K, V) bool) bool
  )
  ```

  (Seq2 represents a sequence of paired values: key-value, index-value or value-error)

  - An iterator is a function that passes successive elements of a sequence to a callback function `yield`, it returns true if it should continue, false if it should stop.

  ```go
  type (
      Yield[V any] func(V bool)
      Yield2[K, V any] func(K,V) bool
  )
  ```

  - Examples:

  ```go
  func Backward[E any](s []E) func(func(int, E) bool) {
      return func(yield func(int, E) bool) {
          for i := len(s)-1; i >= 0; i-- {
              if !yield(i, s[i]) {
                  // Where clean-up code goes
                  return
              }
          }
      }
  }

  s := []string{"a", "b", "c"}
  for _, el in range Backward(s) {
    fmt.Print(el, " ")
  }
  // c b a
  ```

- Conclusion:
  - The `for range` is getting complex:
    - _return true_ => _continue_
    - _return false_ => _break_
  - Feels too functional than an imperative language
  - Still the purpose is good, let's wait to see the adoption in community after awhile

---

- https://www.gingerbill.org/article/2024/06/17/go-iterator-design/
- https://github.com/golang/go/issues/61897
- https://en.wikipedia.org/wiki/Container_(abstract_data_type)

## Issue 1: Mastering Go performance - eBPF and PGO optimization techniques

_2024-06-27_

### [An Applied Introduction to eBPF with Go](https://sazak.io/articles/an-applied-introduction-to-ebpf-with-go-2024-06-06)

- Context:

  - We usually write software in user space (outside the OS's kernel, e.g: user apps like utilities, programming languages, GUI...).

  ![](assets/user-space-vs-kernel-space-basic-system-calls.png)

- Problem:

  - When profiling the application: if we do it from user space (e.g: [pprof](https://go.dev/blog/pprof)) => result is not reliable because there will be some overhead of each layer on top of the CPU/ memory.

  - 2 initial options:
    - _Edit the Kernel Source Code_: not really practical since the usecase is trivial amount. (pending for years to be adopted by distros)
    - _Write a Kernel Model_: this is more practical however, regular maintenance is inevitable as keeping up with the new kernel versions + risking corrupting the Kernel (e.g: if the module has a bug => crash the whole system)

- Solution:

  - **BPF** was originally used in Linux to filter network packets.
  - **EBPF (Extended Berkeley Packet Filter)** allows to trace syscalls, user space/ library functions, network packets... => system performance, monitoring, security...

  ![](assets/ebpf_overview.webp)

  - _How it works:_
    - Pre-defined hooks: system calls, function entry/exit, kernel tracepoints, network events...
    - eBPF programs are event-driven, run at certain hook point then:
      - Safe checked by Verifier
      - Then compiled by JIT compiler from bytecode to instructions
    - Execute the desired code right before actual system calls

  ![](assets/ebpf.png)

- Conclusion:
  - Powerful tool to dive deep in Kernel therefore many applicable usecase: systems programming, observability, security...
  - For profiling usecase, can use existing projects: [Parca](https://www.parca.dev/docs/overview/), [Pyroscope](https://pyroscope.io/) or [PGO](https://go.dev/doc/pgo) (from Go 1.20) for convenience.

### [The Profile-Guided Optimization Experience at Grab](https://engineering.grab.com/profile-guided-optimisation)

- Context:

  - PGO (Profile-Guided Optimization) is introduced in Go version 1.20, a.k.a FDO (feedback-directed optimization), a technique collects and feeds the profile data back to the next compilier build.
  - From the 2nd build/release, expectedly improving 2-14% performance (on-going for future builds)

  ![](assets/high-level-pgo.png)

- Problem:

  - Grab wanted to experiment this to some of their services: use self-managed database [TalariaDB](https://github.com/grab/talaria), orchestrated service and a monorepo one.

- Results:

  - In a service cluster's image that uses TalariaDB, add `-PGO=./talaria.PGO` to the `go build` command: 10% CPU usage reduction, 30% memory usage reduction and 38% volume usage reduction.
  - On the orchestrated service: the reduction is only around 5% << the effort the enable PGO => not substaintial
  - Monorepo service is currently not supported since needing a seperated pprof service and a build process supporting PGO arguments to attach/retrieve pprof file

- Conclusion:
  - Applicable on simple, yet low-effort deployed services

---

- https://sazak.io/articles/an-applied-introduction-to-ebpf-with-go-2024-06-06
- https://www.redhat.com/en/blog/architecting-containers-part-1-why-understanding-user-space-vs-kernel-space-matters
- https://ebpf.io/what-is-ebpf/
- https://www.parca.dev/docs/overview/
- https://pyroscope.io/

- https://engineering.grab.com/profile-guided-optimisation
- https://go.dev/doc/pgo
