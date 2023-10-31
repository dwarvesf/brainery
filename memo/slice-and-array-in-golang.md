---
author: 
created_time: 2018-04-22
tags: go
created: 2018-03-13
---

### Array

In Go language, the terminology `Array` has a bit different from another language like C, JS, ... In Go, the `array has a fixed length and type `Take a look of array implementation in Go.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2fccc4bf-42c4-4f8f-9e7c-7b2784eeb459/ScreenShot2018-04-22at11.28.16PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202458Z&X-Amz-Expires=3600&X-Amz-Signature=d5c215cff63dfe4a0668326bbbde32390fc5d0bc2dabfbd6d6efc6319d45faec&X-Amz-SignedHeaders=host&x-id=GetObject)


Its length is part of its type ([4]int and [5]int are distinct, incompatible types). For example, you can compare two arrays have the same type [4]int.

```go
a := [4]int{1,1,1,1}
b := [4]int{0,0,0,0}
c := [4]int{}

fmt.Println(a == b) // false
fmt.Println(b == c) // true
fmt.Println(c == a) // false
```

As you can see, the array does not need to be initialized explicitly, the `array c` in the example above is initial with zero value of an array type (zero value of an integer is 0).


But two array [4]int and [5]int is incompatible with each other

```go
a := [4]int{}
b := [5]int{}

fmt.Println(a == b) // mismatched types [4]int and [5]int
```


You also can let Go's compiler count the array size for you at compile time.

```go
a := [...]int{1,1,1}
b := [3]int{1,1,1}

// in this example, both a and b have a [3]int type and can compare with
// each other

fmt.Println(a == b) // true
```


For representation for an array of [4]int in memory is for integer value laid out `sequentially`


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/19d3550f-326f-46bc-87dc-598e0edfceab/ScreenShot2018-04-22at10.12.11PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202458Z&X-Amz-Expires=3600&X-Amz-Signature=9ec3dcaa2479ee2058bb7290331a594b526a4fbd56af09e4e53d4db48cd8715d&X-Amz-SignedHeaders=host&x-id=GetObject)


So, in Go, the array is values. An array variable holds the entire array (not a pointer to the first element). Let's say the array is a struct ( but using index instead of named field). Because an array is not a pointer to the first element, so when we assign, pass an array to a function, it will make a copy of its content


**TL;DR:**

The different between array in Go and C:

* Arrays are values. Assigning one array to another copies all the elements.
* In particular, if you pass an array to a function, it will receive a copy of the array, not a pointer to it.
* The size of an array is part of its type. The types [4]int and [5]int are distinct.

### Slice

In Go code, we don't often see array because of its inflexible, slice - on the other hand - is everywhere. Slice is an abstraction built on top the array. Unlike the Array, Slice type has no specified length; you can declare a slice like an array but `without the count element`.


```go
a := []int{1,2,3,4}
```


A slice has three components (will be talking more detail in next section):

* `pointer` : point to underlying array
* `length ` : the number of elements referred to by the slice
* `capacity` : the number of elements in the underlying array

Because slices hold references to an underlying array, so if you assign one slice to another, both refer to the same array.

```go
a := []int{1,2,3,4}
b := a
b[0] = 10

fmt.Println(a) // [10 2 3 4]
```


We can make a slice by using built-in `make` function. When called, `make` allocates an array and returns a slice that refers to that array. Note that the zero value of a slice is `nil.`

```go
// make(type, length[, capacity])
a := make([]int,4,8)

// if we omit capacity, it defaults to the specified length
b := make([]int,4)

// len b = 4
// capacity b = 4
```


or `slicing` an array or another slice using these format

```go
a := []int{1,2,3,4,5,6,7,8,9,10}

b := a[0:5]
fmt.Println(b) // [1 2 3 4 5]

c := a[5:]
fmt.Println(c) // [6 7 8 9 10]

d := a[:5]
fmt.Println(d) // [1 2 3 4 5]

e := a[:]
fmt.Println(e) // [1 2 3 4 5 6 7 8 9 10]
```


The length and capacity of a slice can be inspected using the built-in `len` and `cap` functions.

```go
a := make([]int,4, 8)

fmt.Println(len(a)) // 4
fmt.Println(cap(a)) // 8
```

# 2. Slice internal

Let's take a look at `slice` implementation in Go.

```go
type slice struct{
	array unsafe.Pointer
	len int
	cap int
}
```


For example, if we create a slice by using make([]byte,5), the slice will be structured like this: 

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/18f3f975-72d8-4534-a25b-d14194b30bfd/ScreenShot2018-04-22at10.31.41PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202458Z&X-Amz-Expires=3600&X-Amz-Signature=45c25ccc163b917d0a89f20ad2445128f32b8b5f14b5724a16baeb3dbc6e0e3f&X-Amz-SignedHeaders=host&x-id=GetObject)


A slice cannot be grown beyond its capacity. Attempting to do so will cause a runtime panic, just as when indexing outside the bounds of a slice or array. Similarly, slices cannot be re-sliced below zero to access earlier elements in the array.


**So the question is, What if we **`**append**`** an element to a slice which has reached its capacity?**

### Append

Let's dig into a source code (go/src/reflect/value)


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/946ca4d8-a7a5-407c-836f-a70cf186a28b/ScreenShot2018-04-22at10.51.47PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202458Z&X-Amz-Expires=3600&X-Amz-Signature=81df43c73e73b81f09c21125bbc2cd7d45bb480c33132fae1da3e4743c00d683&X-Amz-SignedHeaders=host&x-id=GetObject)

so the `append` built in function do a few things here:

First, it will check an input value, if it's not a `Slice` the program will throw a panic, then the interesting things here is `grow` function , it will take an old slice and length of the new slice we want to append. Let take a look at `grow` function:


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4f5d341c-9bf1-4971-adb2-62be36d1610b/ScreenShot2018-04-22at10.56.34PM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202458Z&X-Amz-Expires=3600&X-Amz-Signature=46a519c5ea87f7790fa173e1bf873c4ef163c93c84549f873365addba7d45243&X-Amz-SignedHeaders=host&x-id=GetObject)


So now we understand the mechanism behind the `append` function, it will allocate a `new Slice` which have more capacity than the old one

The interesting thing is how Go decide how much capacity the new slice is. As you can see if the old slice capacity is lesser than 1024, it will double the old slice's capacity, but when it grows bigger than 1024 Go adds `old slice's capacity / 4` to the old capacity

### Appendix

* [https://golang.org/doc/effective_go.html#slices](https://golang.org/doc/effective_go.html#slices)
* [https://blog.golang.org/slices](https://blog.golang.org/slices)