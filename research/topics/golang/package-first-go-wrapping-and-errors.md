---
draft: false
title: "Package-first Go, part 2: wrapping types and choosing error patterns"
description: "Extend a Go type by wrapping it instead of editing it, and pick one of eight error-handling patterns on purpose, with a rule of thumb and failure mode for each."
date: 2024-10-25
kind: playbook
authors:
  - tieubao
tags:
  - golang
  - package
  - import
  - interface
  - error
  - generics
redirect:
  - /vCeEag
  - /research/topics/golang/extension-interface-pattern
  - /oDpnjA
  - /research/topics/golang/error-handling-patterns
slug: package-first-go-wrapping-and-errors
announce: false
series: package-first-go
series_part: 2
series_total: 3
---

Part 1 set the package as the unit and the import path as its identity. This part covers the next two rules: extend a type by wrapping it instead of editing it, and choose among eight error patterns on purpose. Each pattern comes with code, a rule of thumb and a failure mode.

> Part 2 of 3 in the package-first Go series. Previous: [Package-first Go, part 1: packages and import paths](go-package.md) | Next: [Package-first Go, part 3: type safety with generics and a repo checklist](package-first-go-generics-checklist.md)

## 3. Extend by wrapping, not by editing

The extension interface pattern is when an interface embeds another one. It adds new features to an existing object without changing its original code. Three situations call for it:

- **Extending third-party packages**: you want to add methods or change the behavior of existing types without forking or modifying the original package.
- **Adding functionality to interfaces**: a package provides a minimal interface and you want extra behavior on top, without changing the underlying implementation.
- **Testing**: you mock or adapt the behavior of a type, adding logging, metrics or other cross-cutting concerns.

Whether you work with the standard library (`io`, `http`, `sql`), third-party packages or your own codebase, the pattern adds functionality in a flexible, non-intrusive way.

### Extending `io.Reader` and `io.Writer`

The `io.Reader` and `io.Writer` interfaces are simple and widely used. You can extend them to add compression, encryption, logging or buffering.

**Example: adding logging to an `io.Writer`.** To log every write, wrap an existing `io.Writer` and log the data written to it.

```go
type LoggingWriter struct {
    io.Writer  // Embed the original io.Writer
}

func (lw LoggingWriter) Write(p []byte) (n int, err error) {
    fmt.Printf("Writing %d bytes: %s\n", len(p), string(p))  // Log the write
    return lw.Writer.Write(p)  // Call the original Write method
}
```

Usage:

```go
func main() {
    var writer io.Writer = LoggingWriter{Writer: os.Stdout}

    writer.Write([]byte("Hello, World!"))
    // Output:
    // Writing 13 bytes: Hello, World!
    // Hello, World!
}
```

This adds logging to any writer without modifying the original `io.Writer` type.

### Extending HTTP middleware in `http.Handler`

The `http.Handler` interface is central to building web servers in Go. The extension interface pattern is the usual way to create middleware that extends its behavior.

**Example: adding a request logger middleware.** The middleware wraps an `http.Handler` and logs HTTP requests.

```go
type LoggingMiddleware struct {
    handler http.Handler
}

func (lm LoggingMiddleware) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    fmt.Printf("Received request: %s %s\n", r.Method, r.URL.Path)  // Log request
    lm.handler.ServeHTTP(w, r)  // Call the original handler
}
```

Usage:

```go
func main() {
    originalHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello, World!"))
    })

    loggingHandler := LoggingMiddleware{handler: originalHandler}
    http.ListenAndServe(":8080", loggingHandler)
}
```

This logs incoming requests and wraps the original handler without modifying it.

### Extending `sql.DB` for database connections

You can extend the `sql.DB` type from Go's `database/sql` package to add logging, connection retries or metrics tracking.

**Example: adding query logging to `sql.DB`.**

```go
type LoggingDB struct {
    *sql.DB  // Embed the original sql.DB
}

func (ldb LoggingDB) Query(query string, args ...interface{}) (*sql.Rows, error) {
    fmt.Printf("Executing query: %s\n", query)  // Log the query
    return ldb.DB.Query(query, args...)
}
```

Usage:

```go
func main() {
    db, _ := sql.Open("mysql", "user:password@tcp(127.0.0.1:3306)/dbname")

    loggingDB := LoggingDB{DB: db}
    loggingDB.Query("SELECT * FROM users")
}
```

This logs SQL queries without altering the behavior of `sql.DB`.

### Adding caching to HTTP clients

Go's `http.Client` is widely used for making HTTP requests. You can extend it to add caching, retries or additional logging.

**Example: adding caching to an `http.Client`.** The wrapper caches responses by URL.

```go
type CachingClient struct {
    client   *http.Client
    cache    map[string]*http.Response
}

func (cc *CachingClient) Do(req *http.Request) (*http.Response, error) {
    if cachedResp, ok := cc.cache[req.URL.String()]; ok {
        fmt.Println("Returning cached response")
        return cachedResp, nil
    }

    resp, err := cc.client.Do(req)
    if err == nil {
        cc.cache[req.URL.String()] = resp
    }
    return resp, err
}
```

Usage:

```go
func main() {
    httpClient := &http.Client{}
    cachingClient := &CachingClient{
        client: httpClient,
        cache:  make(map[string]*http.Response),
    }

    req, _ := http.NewRequest("GET", "http://example.com", nil)
    cachingClient.Do(req)  // Fetches from the internet and caches the result
    cachingClient.Do(req)  // Uses the cached result
}
```

This adds caching behavior without altering the original `http.Client` type.

<!-- needs Han: the CachingClient above is the original note's code, kept as written. It stores a *http.Response whose Body can be read once, and its map has no lock. Decide whether to add a one-line caveat that it demonstrates the wrapping shape and is not production caching. -->

### Adding context or timeouts to `http.Request`

Go's `http.Request` does not have built-in timeout functionality, but you can extend the type to add it.

**Example: a timeout extension for `http.Request`.**

```go
type TimeoutRequest struct {
    req *http.Request
    timeout time.Duration
}

func (tr *TimeoutRequest) Do(client *http.Client) (*http.Response, error) {
    ctx, cancel := context.WithTimeout(tr.req.Context(), tr.timeout)
    defer cancel()

    reqWithTimeout := tr.req.WithContext(ctx)
    return client.Do(reqWithTimeout)
}
```

Usage:

```go
func main() {
    req, _ := http.NewRequest("GET", "http://example.com", nil)
    timeoutReq := &TimeoutRequest{
        req:     req,
        timeout: 2 * time.Second,
    }

    client := &http.Client{}
    timeoutReq.Do(client)  // The request will timeout after 2 seconds
}
```

This adds timeout functionality without modifying the original type.

### Decorators for `fmt.Stringer`

Go's `fmt.Stringer` is a simple interface for customizing the string representation of types. The extension interface pattern lets you add behavior when printing.

**Example: adding a prefix to a `fmt.Stringer`.** The wrapper adds a prefix to the string representation.

```go
type PrefixedStringer struct {
    prefix string
    fmt.Stringer
}

func (ps PrefixedStringer) String() string {
    return ps.prefix + ps.Stringer.String()
}
```

Usage:

```go
type User struct {
    Name string
}

func (u User) String() string {
    return u.Name
}

func main() {
    user := User{Name: "John"}
    prefixedUser := PrefixedStringer{prefix: "User: ", Stringer: user}

    fmt.Println(prefixedUser.String())  // Output: User: John
}
```

This wraps the original `fmt.Stringer` and adds a prefix to the output.

### Why extension interfaces earn their place

The examples above show how to wrap a type. A reply in a r/golang thread adds why the pattern matters and how it is usually used: extension interfaces add optional functionality to an API that, by its statically checked type signature, only takes the base interface. The points below paraphrase that reply.

- **`io.WriteString`** is one of the simplest examples. It takes a plain `io.Writer`. If that writer also supports `io.StringWriter` (it has a `WriteString` method), the function uses it for efficiency. Otherwise it falls back to the `Write` method that every `io.Writer` has.
- **`fs.Open`** returns a plain `File`. If the file is actually a directory, you can convert it to a `ReadDirFile` and call the `ReadDir` extension method.

```go
f, _ := fs.Open("dir_or_file") // in real life, handle errors
st, _ := f.Stat()
if st.IsDir() {
    // f is a directory
    d := f.(ReadDirFile)
    d.ReadDir(10)
} else {
    // f is a normal file
}
```

As an alternative to calling `st.IsDir()`, and the more typical choice for extension interfaces, check whether the file implements the interface directly:

```go
f, _ := fs.Open("dir_or_file")
if d, ok := f.(ReadDirFile); ok {
    // f is a directory
    d.ReadDir(10)
} else {
    // f is a normal file
}
```

Source: [What is the extension interface pattern in Go?](https://www.reddit.com/r/golang/comments/i6yehu/what_is_the_extension_interface_pattern_in_go/).

## 4. Choose the error pattern on purpose

Error handling decides whether an application behaves correctly under unexpected inputs or conditions. Many patterns have evolved across languages over the years. This section lists eight, each with a rule of thumb, an example and its trade-offs. The examples run in C, Python, Rust, JavaScript and Go.

<!-- needs Han: the source note surveys patterns across languages and never shows Go's own idiom of returning an error value and checking it. Add that example here, or confirm the page should leave it out. -->

### 1. Return codes and status codes

This is one of the most basic forms of error handling and is common in older, low-level languages such as C. A function returns a value that says whether it succeeded or failed. It might return `0` for success or `-1` for failure. The caller must check the return value and handle any error.

Always check the return values when using this pattern. A missed check easily leads to silent bugs that are hard to trace.

**Example**:

```c
int divide(int a, int b, int *result) {
    if (b == 0) {
        return -1;  // error: division by zero
    }
    *result = a / b;
    return 0;  // success
}

int main() {
    int result;
    if (divide(10, 0, &result) != 0) {
        printf("Error: Division by zero!\n");
    }
}
```

**Pros**:

- Simple and efficient.
- Minimal overhead, so it suits systems with limited resources.

**Cons**:

- Error checking is easily forgotten, which leads to silent failures.
- The code fills with return value checks.

### 2. Exceptions (try-catch)

Exceptions are a more modern, structured way of handling errors, used in languages like Python, Java and C#. When an error occurs, the program "throws" an exception, which a `try-catch` block can catch and handle. This separates normal flow from error-handling logic.

Don't overuse exceptions for flow control, and **never swallow** exceptions without logging or handling them properly. Always catch specific exceptions rather than generic ones like `Exception` in Python or `Throwable` in Java.

**Example**:

```python
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error occurred: {e}")
```

**Pros**:

- Clean separation between normal logic and error-handling logic.
- Handles deep errors without cluttering every function with return value checks.
- Allows handling different types of exceptions.

**Cons**:

- Can add runtime overhead.
- Misuse leads to code that is hard to debug, especially when exceptions are caught but not properly handled.

### 3. Error objects or results

This pattern forces the function to return an object that explicitly represents either a successful result or an error. It is common in functional languages like Rust and Haskell, and also in Swift. In Rust, for example, the `Result` type is `Ok` for success or `Err` for failure.

Embrace this pattern when it is available. It forces you to **deal with both the success and the error case** explicitly, which reduces the chance of missed error handling.

**Example** (Rust):

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        return Err("Division by zero".to_string());
    }
    Ok(a / b)
}

fn main() {
    match divide(10, 0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }
}
```

**Pros**:

- Forces explicit error handling, so errors are harder to ignore.
- More functional and compositional, which helps when chaining operations.

**Cons**:

- Can be verbose, especially when several layers of functions must return and propagate `Result` types.

### 4. Assertions

Assertions are a debugging tool that checks whether certain conditions hold. If an assertion fails, the program crashes, usually with a helpful error message. Use the pattern for development and debugging, not for production error handling.

**Don't use assertions for regular error handling.** They exist for development and debugging, not for catching user-facing errors in production.

**Example** (Python):

```python
def divide(a, b):
    assert b != 0, "Division by zero!"
    return a / b

divide(10, 0)  # This will raise an AssertionError
```

**Pros**:

- Simple and effective for catching bugs during development.
- Forces assumptions to be stated explicitly in the code.

**Cons**:

- Typically disabled in production, so they do not handle errors in live environments.
- Not suitable for recoverable errors.

### 5. Callbacks (error-first)

In environments that deal with asynchronous operations, like Node.js, error-first callbacks are a common pattern. The first parameter of the callback is the error (if any), and the second is the result.

When using callbacks, **always check the error argument** first, and handle errors properly in every callback.

**Example** (JavaScript):

```javascript
function divide(a, b, callback) {
  if (b === 0) {
    return callback(new Error("Division by zero"), null);
  }
  callback(null, a / b);
}

divide(10, 0, (err, result) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(result);
  }
});
```

**Pros**:

- Works well for asynchronous operations.
- Error handling is explicit.

**Cons**:

- Can lead to "callback hell" when several asynchronous operations nest.

### 6. Promise-based error handling

Promises are an evolution of callbacks, mainly used in asynchronous programming (for example in JavaScript). They give cleaner handling of asynchronous operations: `.then()` for success and `.catch()` for errors.

Use promises to make asynchronous code more readable. Pay attention to the **promise chain**, and always handle `.catch()` for potential errors.

**Example** (JavaScript):

```javascript
function divide(a, b) {
  return new Promise((resolve, reject) => {
    if (b === 0) reject(new Error("Division by zero"));
    else resolve(a / b);
  });
}

divide(10, 0)
  .then((result) => console.log(result))
  .catch((error) => console.error(error.message));
```

**Pros**:

- Cleaner and more readable than callbacks, especially with `async/await`.
- Easier to handle chained asynchronous operations.

**Cons**:

- Errors in promise chains are tricky to debug when `.catch()` blocks are misused or omitted.

### 7. Pattern matching

Functional languages like Haskell, Rust and Scala use pattern matching to handle the different outcomes of a computation. It lets developers decompose data structures and handle each case explicitly.

Pattern matching is powerful, but **handle all possible cases**. If you miss one, your program might crash or behave unexpectedly.

**Example** (Rust):

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10, 0) {
        Ok(result) => println!("Result: {}", result),
        Err(e) => println!("Error: {}", e),
    }
}
```

**Pros**:

- Forces exhaustive handling of the different error cases.
- Gives a clear, readable syntax for handling both success and error cases.

**Cons**:

- Can be overcomplicated for simple error handling needs.

### 8. Panic (crash)

Some languages, like Rust and Go, use panics for non-recoverable errors. A panic crashes the program. In Rust, panics can be caught, but in general the pattern is reserved for situations where the program cannot reasonably continue.

**Use panics sparingly.** Reserve them for truly exceptional, unrecoverable errors, not for ordinary cases like bad user input.

**Example** (Go):

```go
package main

import "fmt"

func divide(a, b int) int {
    if b == 0 {
        panic("Division by zero!")
    }
    return a / b
}

func main() {
    fmt.Println(divide(10, 0))
}
```

**Pros**:

- Useful for catching serious, non-recoverable errors.
- Forces developers to think about critical error scenarios.

**Cons**:

- Crashes the program, which may not be desirable in production.
- Can be overused where graceful error handling is possible.
