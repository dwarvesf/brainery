---
draft: false
title: "A quick introduction to WebAssembly, part 2: from asm.js to WebAssembly"
description: "How asm.js made a subset of JavaScript fast, why it still fell short, and how that led to WebAssembly."
date: 2020-06-15
authors:
  - neko-anon
tags:
  - wasm
slug: webassembly-asmjs-to-wasm
announce: false
series: webassembly-intro
series_part: 2
series_total: 2
type: research
topic: product-engineering
---

Part 1 explained why JavaScript was slow and how engines optimize it. This part follows the next step: asm.js, a restricted subset of JavaScript that engines could run much faster, why that still was not enough, and how it led to WebAssembly.

> Part 2 of 2 in the WebAssembly introduction series. Previous: [A quick introduction to WebAssembly, part 1: why it exists and how JavaScript runs](a-quick-intro-to-webassembly.md)

## The invention of asm.js

So far we have understood that a lot of throughs, efforts and money have been put into developing JavaScript engines to cope up with complex JavaScript applications and somehow, make it faster.

When everybody was working hard to develop faster JavaScript engines, a team at Mozilla went off the books. Back in 2013, they created a subset of JavaScripti which has the feature of statically typed language and manual memory management. They called it the asm.js.

```javascript
function add(a, b) {
  return a + b;
}
```

The add function takes two values and returns the concatenated value (sum). When we want to generate a highly optimized machine code, we need the data type of the variable arguments a and b. However, we don’t have that in JavaScript.

Even if had to make guess, we can’t be sure. _Because a and b can be integers or strings or a mix of both. But let’s say, we were expecting only 32-bit integers, how possibly we can inform this to a JavaScript engine?_

This is where asm.js specifications come into the picture

```javascript
function add(a, b) {
  a = a | 0;
  b = b | 0;
  return (a + b) | 0;
}
```

In the modified code above, we are overriding `a` and `b` with the value of `a` and `b` value respectively but with a binary or condition. What this would do is to convert the values of `a and b int 32-bit integers`.

The asm.js specification specifies _only 3 types_ that you can use in your JavaScript code, `the 32-bit integer`, and `the 32-bit` & `64-bit floating-point numbers`. This makes your code easy to compile with high precision.

However, how this code is compiled and converted to machine code depends on the JavaScript engine behind the scenes. The first support of asm.js came in the SpiderMonkey engine of the Firefox browser.

If our JavaScript code contains `"use asm";` annotation and the JavaScript code has been written according to asm.js specifications, SpiderMonkey could efficiently convert the JavaScript code into optimized machine code.

After the successful proof-of-concept demonstration by the Mozilla team, other browser vendors like Chrome and Edge rolled out support for the asm.js specifications. Applications written in asm.js were relatively faster than their counterparts written in normal JavaScript.

Apart from a virtual type system, asm.js specification tells us to write our JavaScript code inside a function called as a module. We need to **instantiate this module by providing an ArrayBuffer which acts like a heap memory.** **By abstracting the memory of our module from the memory of the main JavaScript thread**, we don’t have the necessary overhead of dynamic memory management and garbage collection provided by the JavaScript engines. Let’s write a sample asm.js module by hand.

But first, let's understand the asm.js module structure

```javascript
function MyAsmModule(stdlib, foreign, heap) {
  "use asm";

  // module body...
  return {
    export1: f1,
    export2: f2,
    // ...
  };
}
```

From the example above, `MyAsmModule` function is the `asm.js` module that we will _instantiate later_. Let’s understand the arguments to this function and return value.

- The `stdlib` argument is an object that contains standard JavaScript libraries accepted in asm.js specifications (listed here).
- The `foreign` object contains references to the external JavaScript functions that our module depends on, also called the foreign function interface (FFI).
- The `heap` argument is the raw ArrayBuffer which will be used as a heap for memory storage optionally required by the module.

In the end, our asm.js module has to export some functions which will be consumed by a JavaScript program. Let’s use the add function as one of the exports of our asm.js module and instantiate with a _1kb heap memory._

```javascript
function Calc(stdlib, foreign, heap) {
  "use asm";
  function add(a, b) {
    a = a | 0;
    b = b | 0;
    return (a + b) | 0;
  }
  return {
    add: add,
  };
}

var stdlib = null;
var foreign = null;
var heap = new ArrayBuffer(1000); // 1kb

// create module instance
var calc = Calc(stdlib.foreign, heap);

// call `add` function
var result = calc.add(1, 2);
console.log(result);
```

In the above example, we are telling the JavaScript engine that _we want to run this JavaScript code as asm.js module with the help of_ `"use asm";` annotation. We have also provided data types of the function parameters and return value. This works just fine, as you can see the result in the console.

However, even though you can write asm.js modules by hand, _it is not feasible for large scale projects_. But, _there are some toolchains available to compile programs_ written in a statically typed language to asm.js. For example, the add function can be compiled from this C code.

```javascript
int add( int a, int b ) {
 return a + b;
}
```

## How asm.js code runs faster

If a **browser’s JavaScript engine** is capable of understanding asm.js code, then it will **treat asm.js JavaScript differently** than other normal JavaScript code.

The first thing it will do is **compile JavaScript code to machine code with high precision since the** `asm.js` code contains type information beforehand. The machine code generated from the asm.js code is close to the Assembly machine code.

Also, it will **keep heap of the asm.js module different from the main JavaScript thread since it does not need garbage collection and tracking**. Since an `asm.js` module manages its memory manually, the overall performance of the code will be better than code that needs dynamic memory allocations and management. Even after with such convincing reasons, \*`asm.js` specifications were never standardized` and it needed a fresher perspective. This is **where WebAssembly comes in and solves the problems of asm.js.**

_The asm.js specifications are not standardized and it is obsoleted by WebAssembly._

### The inception of WebAssembly

`asm.js` was a successful experiment _but writing optimized JavaScript code by hand was tough and error-prone_. There are _no standard build-toolchains to convert your JavaScript code into_ `asm`.js, because it’s not an easy road either.

On the other hand, `asm.js` code _adds extra complexity in the application_ and may at times, _the optimized JavaScript code size is larger than the unoptimized one_, making it harder to transfer over the network.

Considering these things in mind, `asm.js` needed an overhaul. This optimized code that a JavaScript engine can run should be as light as possible. Also, _it needed to be standardized_ so that all the browsers can support it. To address these issues, `the Minimal Viable Product (MVP) development of WebAssembly started as a collaborative effort between Mozilla, Google, and other teams around 2015.`

In this effort, the first blueprint of WebAssembly was conceptualized. **WebAssembly is a binary format of instructions just like a machine code but for a stack machine.**

**What is a stack machine?**

A `stack machine`, unlike a `register machine`, works with a `stack`. A stack is a data structure to store some data in linear order. You can push a value on the stack and it will go on the top of the previous value in the stack. However, you can not pull a value from anywhere. You can only pop or pull the value that is on the top of the stack.
