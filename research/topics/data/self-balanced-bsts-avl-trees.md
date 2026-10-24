---
draft: false
title: "Self-balancing binary search trees, part 1: trees and binary trees"
description: "What a tree is, the vocabulary for talking about one, and the properties and kinds of binary trees, as groundwork for balanced search trees."
date: 2023-02-13
github_id: mirageruler
icy: 10
redirect:
  - /ndx4Lw
authors:
  - mirageruler
series: self-balancing-trees
series_part: 1
series_total: 3
type: research
topic: data
---

This series shows how a binary search tree keeps itself fast by balancing, with the AVL tree as the worked example. Part 1 is the groundwork: what a tree is, the vocabulary for nodes and heights, and the properties and kinds of binary trees.

**This series has 3 parts.** Each one reads on its own.

1. Trees and binary trees (this page)
2. [Why a BST needs to be balanced](binary-search-trees-and-balance.md)
3. [AVL trees](avl-trees-invariant-and-rotations.md)

## What are trees?

- A **tree** is a non-linear data structure used to represent the hierarchical relationship between a paretn node and a child node. Each node in the tree is connected to another node by directed edges.
- ![](assets/self-balanced-bsts---avl-trees_a-tree-representation-of-a-team.webp)
- ![](assets/self-balanced-bsts---avl-trees_a-tree-representation-of-a-file-system.webp)
- Why do we use trees? The main advantage of using a tree over linear data structures like arrays or linked lists is that we do not have to search an element in linear team.

## Important terms related to trees

- ![](assets/self-balanced-bsts---avl-trees_key-terminologies-in-a-tree-1.webp)
  - **Node**: The fundamental element of a tree. Each node has arbitrary data and two pointers that may point to null or its children.
  - **Edge**: Another fundamental part of a tree used to connect two nodes.
  - **Root**: The only node without incoming edges. It is the top node of a tree.
  - **Leaf**: A node that has no children.
  - **Path**: An ordered list of nodes that are connected by edges.
  - **Height of a node** : The number of edges(in this case levels, everytime we go down by an edge we are going down one level of a tree) on the longest downward path between the node itselft to a leaf or the total number of nodes in that path exclude the node we're calculating the height for. Height of a binary tree is height of the root node. One more view to look at height of a node is to focus only the sub-tree where the focused node is the root, so it's height is the maximum depths of nodes within that sub-tree
- ![](assets/self-balanced-bsts---avl-trees_key-terminologies-in-a-tree-2.webp)
  - **Parent**: A node is said to be a parent node if it has outgoing edges to other nodes.
  - **Child**: A node that has incoming edges from another node is said to be the child of that node.
  - **Sibling**: Nodes that are children of the same parent are called sibling nodes.
  - **Ancestor**: A node is said to be an ancestor node if it is reachable while moving from child to parent.
  - **Level/Depth**: The depth/level of a node is the number of edges on the path from the root node to that node. The level of the leaf on the longest path from root is also the height of the tree. Take this in general we can say height of node X is maximum depth in subtree of node X.

## Type of trees

- Generally, trees can be divided into two categories based on the number of children a node can have. They are as follows:
  - **Non-binary trees**
    - A non-binary tree is a type of tree in which a node can have **more than two children**.
    - Examples: **2-3 trees**, **2-3-4 trees**,B-trees, B+ trees**, and **B\*\*\* trees are all examples of non-binary trees. But today, we will not care about these guys.
    - ![](assets/self-balanced-bsts---avl-trees_non-binary-tree-example.webp)
  - **Binary trees**
    - A binary tree is a type of tree in which each node has at **most two** children.
    - Examples: BSTs, AVL trees, and red-black trees are all examples of binary trees.
    - ![](assets/self-balanced-bsts---avl-trees_binary-tree-example.webp)

## Introduction to binary tree

- As we discussed earlier, _a binary tree is a type of tree in which each node has at most two children_, which means a node in the binary tree can have one, two, or no children. These children are referred to as the **left child** and the **right child**. To give it a more general view, I would say every node in the tree all has a parent node, except the root or we could argue that parent of the root is nil or a nil node.
- ![](assets/self-balanced-bsts---avl-trees_a-tree-node-example.webp) - We can code the above node as follows:

```go
type Node[T any] struct {
	// the contents of this node.
	value T
	// left and right nodes.
	left, right *Node[T]
	// parent *Node[T]   we're not going to use this field today, I just place it here since it's helpful for other type of trees and/or different problems.
	// height of this node
	height int
}

type Tree[T any] struct {
	// root of the tree
	root *Node[T]

	// compare function
	compare compareFunc[T]
}

// compareFunc provide clients the ability to help us indicate how to compare the given data structure since we're allowing it to be anything.
type compareFunc[T any] func(T, T) int
```

## Properties of binary tree

- The following are properties of a binary tree which are already prooved by the inventors... any way for a more intuitive view, I will provide a "sketch proof" for each of the properties and they are called proof by induction.If you interested in it, basically we take the base case that can not be false and we assume our proposition(which is $p_n$) is true then we proove that every $p_n$ implies $p_{n+1}$
  1.  The maximum number of nodes on a level i of a binary tree can be $2^i$, where $i \geq  0$. Sketch proof: Take the base case, at level 0 we have only one node that is the root itself so $2^0 = 1$ still hold true for our proposition, at level 1 we might have at most two children for the root so $2^1 = 2$ still hold true for our proposition, at level 2 we might have at most four children that are two from the root's left node and two from the root's right node so $2^2 = 4$ still hold true for our proposition... so on and so forth.
  2.  The maximum number of nodes in a binary tree of depth `k` is $2^{k+1}-1$, where $k \geq 0$. Sketch proof: Take the base case, at level 0 we have only one node that is the root itself so $2^{0+1}-1 = 1$ still hold true for our proposition, at level 1 we might have at most 3 nodes that are the two new children from our original root so $2^{1+1} -1 = 3$ still hold true for our proposition, at level 2 we might have at most 7 nodes that are the two new children from the root's left child and the root's right child so $2^{2+1} -1 = 7$ still hold true for our proposition... so on and so forth.
  3.  There is exactly one path from the root to any nodes in a tree. Because a each node is like a decision, imagine we stand before a decisive situation where there is only two options to go, we choose one then it will ask us to choose between the two new options, so on and so forth... so it's impossible for us to encounter a desired situation as long as we make at least one wrong decision in that path as that wrong decision will definitely leads us to a totally different branch.
  4.  A tree with $n$ nodes has exactly $n−1$ edges connecting these nodes. Sketch proof: Take the base case, with one node that is the root itself and zero edge so $1-1=0$ still hold true for our proposion, with two nodes that are the root and either the left or the right child so we have one edge check $2-1 = 1$ still hold true for our proposition, with three nodes that are the root and its children so we have two edges to connect them all together so $3-1 = 2$ still hold true for our proposition... so on and so forth.
  5.  The height of a complete/full (!= perfect) binary tree of $N$ nodes is $O(lgn)$. Sketch proof: Let's $n$ be the number of nodes in a complete binary tree and let $l_k$ denote the number of nodes on level $k$, where the levels are numbered 1,2,3, ..., h. The last level, $h$ represents the height of the tree. Note that: $l_k=2l_{k-1}$, i.e. each level has exactly twice as many nodes as the previous level (since each internal node has exactly two children). $l_1=1$ i.e. on the "first level" we have only node (the root node). Let's expand several case to find out the recurrence/pattern, $l_2=2, l_3=4,l_4=8,l_5=16,l_6=32...$ so the recurrence solves to $l_k=2^{k-1}$. Note also that the leaves are at the last level $l_h$, where h is the height of the tree, so from the previous bullets we know that the last level has $l_h=2^{h-1}$ nodes. The total number of nodes, $n$, in the tree is equal to the sum of the nodes on all the levels: $1+2^1+2^2+ ... + 2^{h-1}=n$, again let's expand several case to find out the recurrence on the left hand-side of the equation. We try with $$h=0, \quad \therefore 2^0 =1$$$$h=1, \quad \therefore 2^0+2^1=3$$$$h=2, \quad \therefore 2^0+2^1+2^2=7$$$$h=3, \quad \therefore 2^0+2^1+2^2+2^3=15$$so the recurrence is $2^h-1$. Therefore: $$2^h-1=n$$ $$\therefore 2^h=n+1$$ $$\therefore lg2^h=lg(n+1)$$ $$\therefore  hlg2= lg(n+1)$$ $$\therefore h=lg(n+1)$$ Ok, so now we know the height of the tree we can do one more thing that is to compute the number of leaves $l_h$ in the tree, we observed earlier that $l_h=l^{h-1}$ so we can substitute the value of h in this expressions $2^{h-1}=2^h/2^1=2^{lg(n+1)}/2=(n+1)/2$. In conclusion, for a complete binary tree $h$ is $O(lgn)$ and the number of leaves $l_h$ is roughly half of the nodes $(n+1)/2$. In effect, perfect binary trees have the same properties as they obviously just have more nodes to complete the last level compare to the complete binary trees which have their last level not completely be filled.
  - Notes: For convenient I will use the notation $lg$ as lograrithm of base 2 ($log2(n)$)since $lg$ also has two letters.

## Types of binary tree

- There are many types of binary trees. Let’s discuss them one by one below.
  - **Complete binary tree**
    - This is a very important invariant of binary tree that we need to keep in mind. In a complete binary tree, in every level except possibly the last, is completely filled. All nodes on the left are filled first and the nodes on the right filled after, so all nodes in the last level are as far left as possible. So all internal nodes have exactly two children and all leaves are at the same level. A binary min/max heap is a great example of a complete binary tree.
    - ![](assets/self-balanced-bsts---avl-trees_a-complete-binary-tree-example.webp)
  - **Full/Strict binary tree**
    - The full binary tree is a binary tree in which each node has exactly zero or two children.
    - ![](assets/self-balanced-bsts---avl-trees_a-full-strict-binary-tree-example.webp)
  - **Perfect binary tree**
    - The perfect binary tree is a type of full binary tree in which each non-leaf node has exactly two child nodes. All leaf nodes have identical path lengths and all possible node slots are occupied.
    - ![](assets/self-balanced-bsts---avl-trees_a-perfect-binary-tree-example.webp)
  - **Right-skewed binary tree**
    - A binary tree in which either each node has a right child or no child (leaf) is called a **right-skewed binary tree**.
    - ![](assets/self-balanced-bsts---avl-trees_a-right-skewed-binary-tree-example.webp)
  - **Left-skewed binary tree**
    - A binary tree in which either each node has a left child or no child (leaf) is called a **left-skewed binary tree**.
    - ![](assets/self-balanced-bsts---avl-trees_a-left-skewed-binary-tree-example.webp)
  - **Height-balanced binary tree**
    - A **height-balanced binary tree** is a binary tree such that the left and right subtrees for any given node differ in height by a maximum one. AVL trees and red-black trees are examples of height-balanced trees.
    ```
    Note: Each complete binary tree is a height-blanaced binary tree
    ```
    - ![](assets/self-balanced-bsts---avl-trees_a-height-balanced-binary-tree-example.webp)
  -
