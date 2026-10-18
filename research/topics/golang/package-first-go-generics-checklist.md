---
draft: false
title: "Package-first Go, part 3: type safety with generics and a repo checklist"
description: "Use type parameters and constraints so the compiler rejects a wrong type, then run a nine-line checklist that covers all five package-first rules against your repo."
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
  - /YftkWA
  - /research/topics/golang/go-generics-type-safety
slug: package-first-go-generics-checklist
announce: false
series: package-first-go
series_part: 3
series_total: 3
---

The last rule is to let constraints carry the type safety: type parameters, type constraints and compile-time checks that stop a wrong type before it runs. The part ends with a checklist that turns all five rules into lines to run against a repo, package by package.

> Part 3 of 3 in the package-first Go series. Previous: [Package-first Go, part 2: wrapping types and choosing error patterns](package-first-go-wrapping-and-errors.md)

## 5. Let constraints carry the type safety

Go introduced generics with Go 1.18, officially released in March 2022. The update lets Go developers write more flexible and reusable code by supporting type parameters, so functions and data structures work with different types without sacrificing type safety.

Before 1.18, Go was known for simplicity and type safety but lacked the flexibility generics bring, a feature common in languages like Java, C# and C++. Generics were among the most anticipated features in Go's development, and the 1.18 release was a significant milestone.

Go achieves type safety with generics through **type parameters** and **type constraints**. Here is how it works.

### Type parameters

When you define a function, method or data structure with generics, you specify a type parameter in square brackets `[]`. The type parameter lets the function or type accept different types without being tied to a specific one. The type still has to conform to certain rules, which is where type constraints come in.

Example of a generic function with a type parameter:

```go
func Print[T any](items []T) {
    for _, item := range items {
        fmt.Println(item)
    }
}
```

Here `T` is a type parameter, and `any` is a built-in constraint that allows any type.

### Type constraints

Type constraints limit what types the type parameter `T` can represent. Go enforces type safety by ensuring that the types passed to a generic function or type comply with these constraints. A constraint can be a specific interface, a built-in constraint like `comparable` or `any`, or a custom-defined one.

Example using a constraint:

```go
// A custom constraint interface that requires a type to implement a method
type Stringer interface {
    String() string
}

func ToString[T Stringer](val T) string {
    return val.String()
}
```

In this example, only types that implement the `Stringer` interface can be used as `T`, which ensures type safety at compile time.

### Compile-time checking

Go's compiler checks types at compile time. If the provided type does not satisfy the constraint, the program does not compile, so incorrect types never reach a generic function or data structure. This supports Go's philosophy of simplicity and robustness in type safety.

### Underlying type consistency

Go also leverages underlying types in some constraints. For example, the `comparable` constraint ensures that the type parameter can be compared with `==` or `!=`. For this to work, the compiler ensures that any type passed to a function constrained by `comparable` supports these operations, which prevents runtime errors.

### Explicit and simple type inference

Go simplifies type safety by inferring types when possible. If the compiler can deduce the type parameter from the context, you do not need to specify it, and the compiler still checks that the type is valid under the constraints.

Example with an inferred type:

```go
func Add[T int | float64](a, b T) T {
    return a + b
}

result := Add(3.0, 4.5) // Go infers T as float64
```

### Commutative diagram

$$
\begin{CD}
\text{GenericCode} @>\text{Parse}>> \text{AST} @>\text{TypeCheck}>> \text{TypedAST} \\
@V\text{Instantiate}VV @V\text{Infer}VV @VV\text{Compile}V \\
\text{ConcreteCode} @>>\text{Verify}> \text{TypeSafeCode} @>>\text{Generate}> \text{ExecutableCode}
\end{CD}
$$

This diagram shows how Go handles generic code:

1. Generic code is parsed into an Abstract Syntax Tree (AST).
2. The AST undergoes type checking, which involves constraint checking and type inference.
3. The resulting TypedAST is then compiled into executable code.
4. Alternatively, generic code can be instantiated with concrete types, verified for type safety, and then generated into executable code.

### Summary

Go achieves type safety with generics through a combination of compile-time type checking, constraint satisfaction and type inference:

1. **Type parameters** allow flexibility.
2. **Type constraints** enforce rules about which types are allowed.
3. **Compile-time type checking** prevents invalid types from being used.
4. **Simple and explicit type inference** keeps the code short while constraints maintain safety.

## A checklist to run on your repo

Each line comes from one of the rules above. Run it package by package.

- [ ] Each package has one purpose and its own `_test.go` files beside the code.
- [ ] Only the names that outside code needs are exported.
- [ ] No catch-all `utils` package. Generic helpers sit in focused packages such as `stringutil` and `timeutil`.
- [ ] The calling package defines the interface it needs, listing only the methods it uses.
- [ ] Dependencies in `go.mod` are pinned to a tag or commit.
- [ ] Extra behavior (logging, caching, timeouts) wraps the original type instead of editing it.
- [ ] Every returned status or error value is checked, because a missed check becomes a silent bug.
- [ ] Panics guard only unrecoverable states, never bad user input.
- [ ] Each type parameter carries a constraint, and `any` appears only where any type is valid.

## Related

For concurrency in Go, see [Approaches to manage concurrent workloads like worker pools and pipelines](./approaches-to-manage-concurrent-workloads-like-worker-pools-and-pipelines.md), a separate 2023 note that stays on its own.

This page folds in five October 2024 notes: package first design, Go import design, the extension interface pattern, error handling patterns, and Go type safety with generics.
