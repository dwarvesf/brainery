---
title: null
description: null
date: null
---

# bom

small tools for cleaning bom from byte array or reader

## Installation

```sh
$ go get github.com/ssor/bom
```

## How to use

```
	bs := []byte{bom0, bom1, bom2, 0x11}
	result := CleanBom(bs)
```

```
	bs := []byte{bom0, bom1, bom2, 0x11}
	result := NewReaderWithoutBom(bytes.NewReader(bs))

```
