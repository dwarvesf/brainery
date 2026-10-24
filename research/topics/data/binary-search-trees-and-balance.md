---
draft: false
title: "Self-balancing binary search trees, part 2: why a BST needs to be balanced"
description: "How a binary search tree orders its keys, why that helps a runway-reservation system, why tree height matters, and what balancing has to guarantee."
date: 2023-02-13
github_id: mirageruler
authors:
  - mirageruler
slug: binary-search-trees-and-balance
announce: false
series: self-balancing-trees
series_part: 2
series_total: 3
type: research
topic: data
---

A binary search tree keeps its keys in order, so search, insertion and deletion cost O(h), where h is the height of the tree. This part uses a runway-reservation problem to show why that ordering helps, then shows why the height must stay near log n and what a balancing scheme has to guarantee. It assumes the vocabulary from part 1.

> Part 2 of 3 in the self-balancing trees series. Previous: [Self-balancing binary search trees, part 1: trees and binary trees](self-balanced-bsts-avl-trees.md) | Next: [Self-balancing binary search trees, part 3: AVL trees](avl-trees-invariant-and-rotations.md)

## Binary search tree (BST)

- A BST or a binary search tree is a binary tree in which nodes are ordered in the following way: - ![](assets/self-balanced-bsts---avl-trees_a-binary-search-tree-example.webp) - Below are the invariants of a BST (an arbitrary tree need to satisfy these invariants/constraints in order to be considered as a BST): - For all nodes x, if y is in the left sub-tree of x, we have key(y) <= key(x) - For all nodes x, if y is in the right sub-tree of x, we have key(y) >= key(x) - No duplicate key is allowed in the tree.
  - Because a binary search tree is also a binary tree, all the algorithms of a binary tree are applicable to a binary search tree.
  - `Note: There can be two separate key and value fields in the tree node(We can order the nodes by their key, and for any given key there's an associated arbitrary value). However, for simplicity of this article, we’ll consider the value as the key.`
  - BST give us a several useful operations:
    - Insertion in $O(h)$
    - Deletion in $O(h)$
    - Queries for exact key or the predecessor or successor if that key is not exist in $O(h)$.
    - We can easily return a sorted linear data structure by performing an in-order traversal on the BST which is only $O(n)$.

## How a BST can be helpful?

- To talk about the reason behind existence of BST, I'd like to take a toy problem that you can imagine exists in all sorts of scheduling problems, it's a part of a runway reservation system: - We'll assume an airport with a single runway, and we can imagine this runway is pretty busy. There's obviously safety issues associated with landing planes, and planes taking off. And so there are constraints associated with the system, that have to be obeyed. And we have to build these constraints in, and the checks for these constraints into our data structure. - What we'd like to do is reserve requests for landings, and each of them are going to specify landing time called $t$. So, in particular we're going to add $t$ to the set $R$ of landing times if no other landings are scheduled within $k$ minutes (k can either be constant or variable that will be changed depends on other business logic, but for simplicity we'll assume k is constant). So we need to be able to perform an insert operation to the data structure. - We have the current notion of time, everytime we have a plane that's already landed, we'd like to remove that landing from the set $R$. So every once in a while, as time increments, we're going to be checking the data structure maybe 30 seconds or 1 minute, it doesn't matter, the fact that matters here is we must be able to perform a delete operation on the data structure. - So we have set $R$ described as above, we don't quite know how to implement it yet. Assume, we're dealing with large inputs, we'd like to do all of these operations in $O(lgn)$ time where $n$ is the size of set $R$. - ![](assets/self-balanced-bsts---avl-trees_runway-reservation-problem-example.webp)
  - Let's list out so called, basic data structures, that obviously exists before BST like: unsorted array, sorted array, linked list (singly/doubly/circular is not important in this particular problem), hash table, heap. We're going to shoot them down with respsect to not being able to make the efficiency requirement of $O(lgn)$ time for all attached operations. - Unsorted list/array: Almost everything we want to do on this data structure is linear. Although for adding it only take constant time but to do the $k$ minutes check it's $O(n)$ time since the data have no order so we have to check with every other elements. Also for deletion, we have to traversed the whole data structure in the worst case (at the end of array) in order to find the element that we're going to delete. So basically, it's terrible. - Sorted list/array: I bet binary search is the first thing comes into your mind with this data structure. For the array implementation, yes we can do that to find the desired position to insert in $O(lgn)$ time and do the $k$ minutes check in $O(1)$ time but still take $O(n)$ time to do the insertion because possibily we have to shift every index after that, symmetrically the same is true for deletion. So it's almost what we want, if we can somehow skip the "shift index" work if we can manage our data in a more strictful structure. Actually in the list implementation, we don't have to do the "shift index" work but we can not do the "go to the middle point" operation since there's no indexes and we're only maintaing references a.k.a pointers. Give yourself a view of combining the key properties of a sorted array and linked list, that's the good things about the BST when it enables binary search as well as remove the $O(n)$ time "shifting" index work after the data structure is modified. - Heaps: Because of the logic of heap insertion and deletion methods, and the invariant of max/min heap (all children node must be larger/less than their direct parent) is fairly simple therefore fairly weak, each time we go left or right on the traversal we're not effectively cut off the all the unnecessary nodes, so to do the $k$ minutes check it's still take $O(n)$ time - that is we have to traverse every elements one by one in the heap. So it fails our requirement. - Hash table: Or dictionaries, hash map, whatever you wanna call it, supports $O(1)$ insertion, deletion, search exact all by a given key. But keys are not placed in order, actually they're in a randomized order so again if we want to do the $k$ minutes check it still $O(n)$ time. The good old hash table fails our requirement too.
  - The beauty of a BST is that we can augment the tree to do more work as necessary without changing the efficiency of the attached methods. In short, we can easily do the $k$ minutes check while finding the place to insert.
  - This should give us a sense of the richness of the BST structure, we can have nodes to store more data in them than just these common pointers. Having this notion of augmentation on the data structure is very good, because of design admendments so specifications never stay the same, like we're working for someone, and they never really tell us what they want, they might but they will change their mind later on, so in that case we're going to change our mind too and do the augmentation. I'll take an extra example requirements added upon our "runway reservation system" problem above, we need to compute $rank(t)$ that is how many planes are scheduled to land at times less than or equal to $t$, perfectly reasonable additional requirement and it wasn't part of the original spec.
  - With the notion of the aumented BST, we can refer to the normal BST as the vanilla BST such that each node encapsulates common basic fields like left,right pointer, key... while the aumented BSTs are usually bring together other fields or callbacks needed to make the algorithms work.
  - If you're interested in the implementations of BST you can search your own in the internet, today we're going to focus only on a method to balance BST.

## BST needs to be balanced!

- Almost operations for a vanilla BST is O(h) where h is the height of the BST but what we want is $O(lgn)$, so if $h = lgn$ where n is the total number of nodes in the BST then we will have $O(lgn)$ for operations attached to the BST which will truly satisfied our requirement for the "runway reservation system" problem. We have a concept of the balanceness of a tree, to say that a tree is balanced that is it's height must be $O(lgn)$, because almost . Because of the invariant of the BST that is not related to the height of the tree so that BST can become totally skewed to the right/left which is essentially a linked list and we know what's the problem with a linked list. Now this becomes our new problem as obstacles that we have to solve before we can have a data structure that efficiently acchieve $O(lgn)$ time in all attached operations in most of the time.

## The height of a node

- The new question is, what do we need to do in order to guarantee the height of a BST to be $lgn$. And before getting to methods that help us to actually do that, I think it's useful to discuss about height of the BST or in general height of a node within a BST because height of node root is also height of the BST.
- I will give out a hint that AVL require each node to store an additional integer field call `height` to store the height of each node, because the algorithm need to know that information instaneously in order to effecienly balance the tree (Simply we can't afford to go down the tree or sub-trees if you will to compute the height every time we need it). For a more intuitive view, let's look at the following picture:
- ![](assets/self-balanced-bsts---avl-trees_height-of-a-node-in-a-bst.webp)
- We need to update the height of each node in the AVL tree every once in awhile whenever insertions or deletions happen on the tree a.k.a the tree structure is modified.

## How to balance BST?

- BSTs are augmented and added invariants in many different ways in order to achieve balanceness in their height and they have a common name "Self-balance binary search tree", the most famous are AVL trees which we're going to talk about today, Red-Black trees, Splay trees, treaps. Each type of self-balance BST either has their own idea (Red-Black trees have the idea of coloring nodes with red or black) or common idea (the node rotation is commonly used in variants of self balance BST) to achieve balanceness in height.
