---
draft: false
title: "Self-balancing binary search trees, part 3: AVL trees"
description: "The AVL invariant, the proof that it keeps tree height at O(log n), and how insertions and deletions restore the invariant with rotations."
date: 2023-02-13
github_id: mirageruler
authors:
  - mirageruler
slug: avl-trees-invariant-and-rotations
announce: false
series: self-balancing-trees
series_part: 3
series_total: 3
---

The AVL tree was the first self-balancing binary search tree. This part states its rule (the two subtrees of every node differ in height by at most one), proves that the rule bounds the height at O(log n), and shows how insertions and deletions restore the rule with rotations. Part 2 explains why balance matters in the first place.

> Part 3 of 3 in the self-balancing trees series. Previous: [Self-balancing binary search trees, part 2: why a BST needs to be balanced](binary-search-trees-and-balance.md)

## AVL tree

- A little bit information about the origin of this data structure:
  - Named after two Soviet inventors **A**delson-**V**elsky a computer scientist and **L**andis a mathematician.
  - It was the first self-balance BST ever to be invented and was the original way people found to keep trees balanced back in the '60s so they're kind of the simplest among others.
  - AVL trees are often compared with Red-Black trees because both support the same set of operations and take $O(lgn)$ time for the basic operations. For lookup-intensive applications, AVL trees are faster than red–black trees because they are more strictly balanced.
- AVL tree has a little rule for the height of their nodes. That is if a node is missing its left or right child or both and the missing children is considered as an imaginary node and these nodes have height $h=-1$. In order for the formula to calculate the height of a binary node in a BST work with that base case.

## Rep invariant of an AVL

- I will go with the definition of the authors of the algorithm first.
- `First the tree itselft must be a BST, then the height of the left sub-tree for every nodes within the tree must not 1 apart from the height of the right sub-tree`
- Notice if we slightly change the above constraint to "must not 0 apart ..." which means the left sub-tree and the right sub-tree have the same height in effect essentially describe a perfect BST but this constraint is really hard to conform since there are only a certain number of nodes $n$ with a unique structure for each $n$ to be able to represent a perfect BST (level 1 require 1 node, level 2 require 3 nodes, level 3 requires 7 nodes, level 4 requires 15 nodes, level 5 requires 31 nodes... and with that number of nodes they have to presented in a perfect way so it's really hard to keep that, for example if we have 8 nodes then it's impossible to fix the invariant)
- The above definition by words can be expressed as mathematical as follows: $\forall n\in AVL, |h(n.left) - h(n.right)| \leq 1$
- This constraint will help ensures the height of the AVL tree in the worst case of its definition stays $O(lgn)$ or in other words the highest height of an AVL tree is bounded by $O(lgn)$. In my humble opinion, It's important to understand how this is achieved by the invariant of the AVL tree in order to fully understand the idea of AVL trees, so I'll try my best to proove this is true:
  - The first claim is that `AVL trees are balanced`, balanced means height is always $O(lgn)$, so we're just going to assume for now that we can somehow achieve this property and we want to prove that it implies that the height is at most some constant times $O(lgn)$ while we know it's at least $O(lgn)$
  - Let's think about the worst case for height of an AVL tree, say if we have $n$ nodes how could we make the AVL tree as high as possible? Or conversely, if we have a particular height, how could we make it have as few nodes as possible? That'd be like the sparsest or the least balanced situation for AVL trees.
  - To achieve the worst case, we can do this: For every node, let's the right side have a height of $1$ larger than the left side or symmetrically we can do the same on the conversely but I'll only take one example here.
  - We're going to define $n_{h}$ is the minimum number of nodes that's possible in an AVL tree of height $h$. This is sort of the inverse that we care about, but if we can solve the inverse, we can solve the thing. What we really care about is, for $n$ nodes, how large can the height be, we wanna prove that is bounded to $O(lgn)$. But it'll be a lot easier to think about the reverse, which is, if we fix the height to be $h$ then what's the fewest nodes that we can pack in? Because for a worst case of a BST a right/left degenerated BST, we have a height of $n$ so we only need to put $n$ nodes and we see that woulld be really bad. What we prefer is a situation where with heigh $h$, we have to put in $2^h$ nodes and that would be perfect balance, so when we take the inverse from that exponential equation we get a logarithm.
  - Imagine a case where we want to build an AVL tree with a fixed height, and we want to have as few nodes as possible. If we have a tree with a big height and very few nodes, $h$ is going to be bad when we write it as a function of $n$ so those trees are unbalanced - big height, small number of nodes. So we will try to build up the next presentation of the AVL tree with minimum number of nodes for each level, let's look at the following picture:
  - ![](assets/self-balanced-bsts---avl-trees_minimum-number-of-nodes-for-an-avl-tree-of-height-h.webp)
  - Expanding the example to level 4,5,6,7 then you will regconize the pattern/recurrence. If we want to build an AVL tree with as few nodes as possible and height $h$, we start with the root and then at the right we build an AVL tree of height $h-1$ and at the left, we build an AVL tree of height $h-2$, because of the fact that we were also try to build left AVL sub-tree and right AVL sub-tree with minimum number of nodes then it turns out that the whole tree must has minimum number of nodes. Look at the following picture:
  - ![](assets/self-balanced-bsts---avl-trees_the-best-way-to-build-a-tall-avl-tree-with-as-few-nodes-as-possible.webp)
  - Suppose we want to write the number of nodes as a function of height, we have $n_h=n_{h-2}+n_{h-1}+1$ as the recurrence with the base case $n_{O(1)}=O(1)$. Now we need to solve it, what we would like is for it to be exponential, because that means there's a lot of nodes in a height $h$ AVL tree. Look at the recurrence, doesn't it look like something very familiar to our developers when we first come to some of the first problem when we learn how to write code? Yes, the good old Fibonacci, it's almost Fibonacci except we have our additional $+1$ in the recurrence. Well, that's actually good, because in particular, $n_h$ is bigger than Fibonacci. So we have $n_h>f_h$, if we add $1$ at every single level then certianly we get something bigger than the base Fibonacci sequence. Now, hopefully you know Fibonacci is exponential. Let's bring something that is already prooved in order to help us reduce the work here, we know that $f_h=\frac{\varphi^h}{\sqrt{5}}$ (refs:https://en.wikipedia.org/wiki/Fibonacci_number) the above method require rounding the result into the nearsest integer in order to give the exact result of the Fibonacci sequence, crazzy stuffs and obviously we don't need to know why that's true, just take it as fact. And conveniently $\varphi>1$, also we don't need to remember what $\varphi$ is($\approx1.618$), except it is bigger than 1. So we have an exponential bound, this is good news. What we really wanna know is how $h$ relates to $n$, which is just inverting the formula. So we have, on the other hand, $\frac{\varphi^h}{\sqrt{5}}<n_h$ , put on $log_\varphi$ on both sides seems like a good thing to do. We get $h - log_{\varphi}\sqrt{5}<log_{\varphi}n$ with $log_{\varphi} \approx1.440\times lgn$, because after all, log base 2 is what computer scientists care about. So just to put it into perspective, now we claim that the height of an AVL tree is always less than $1.440\times lgn$ and $1.44$ is a reasonable constant I believe, maybe we'd like $1$, there are BSTs that achieve $1$ plus a very tiny thing.
- Okay so this is kinda of the hard way to argue that the height of an AVL tree is bounded by $O(lgn)$, there's a much easier way to analyze this recurrence though $n_h=n_{h-2}+n_{h-1}+1$.
  - This is the theorectical computer scientist way to solve this recurrence, we don't care about constants.
  - And so we say, aw, this is hard, I've got $n_{h-1}$ and $n_{h-2}$, aw, so asymetric, let's symmetrify. Could we make them both $n_{h-1}$ or $n_{h-2}$ ?
  - $n_{h-2}$ is the right way to go because we want to know $n_h$ is greater than something in order to get a less than down here. So we have $n_h>2n_{h-2}+1$ because if we have a larger height we're going to have more nodes. We can even get rid of the $1$ because that only makes things bigger, so we have $n_h>2n_{h-2}$ . Now from this version of the recurrence, let's use inductive reasoning to solve it.
- All right, so far so good, now the next big question is how the heck can we maintain this AVL properties for our good old BST?

## How to maintain the AVL invariant when the BST tree is modified

- **Insertion**:
  - Step 1: Do simple BST insertion, and this one will not preserve the AVL property.
  - Step 2: Calculate the balance factor of the sub-tree related to the newly inserted node to check if it violates the AVL properties on that sub tree then we're going to fix that recursively when we going up from the first bottom of the recursive function.
- **Deletion**:
  - Step 1: Do simple BST deletion, and this one will not preserve the AVL property.
  - Step 2: Calculate the balance factor of the related sub-tree after the node is deleted to check if it violates the AVL properties on that sub tree then we're going to fix that recursively when we going up from the first bottom of the recursive function.
- Ok, sound like we're gonna have ways or precisely tools to fix the AVL properties, and that tool is **rotations**, super cool tools.
- ![](assets/self-balanced-bsts---avl-trees_rotations-for-binary-tree-nodes.webp)
- For left-rotate, whatever the parent of $X$ was becomes the parent of $Y$ and vice versa, in fact. The parent of $Y$ was $X$, and now the parent of $X$ is $Y$. The parent of $A$ is still $X$, the parent of $B$ changes, it used to be $Y$ now it's $X$. The parent of $C$ was $Y$, it's still $Y$. We call it left-rotate because the root moves to the left.
- For right-rotate, it a reverse operation with the left-rotate that let us manipulate the tree assymetrically.
- So in a constant number of pointer changes, we can perform what so called node rotation and more importantly it satisfies the BST order property, if we do an in-order traversal of this we will get $A,X,B,Y,C$ at the first state, not just a coincident the same is true for the in-order traversal of the second state. $B$ was some number of nodes between $X$ and $Y$, and it still some number of nodes between $X$ and $Y$, and so on you can expand the example tree and check more on yourself.
- In my humble opinion, it's like the only thing you need to know in BST along with how to do the search.
- Ok that's rotations by pictures, to talk about them in detail, we have to look at their specific cases:
  - Case 1: I call this case "right child skewed to the right"
  - ![](assets/self-balanced-bsts---avl-trees_right-child-skewed-to-the-right.webp)
  - We rotate-left self (parent of the right child that is skewed) to balance the sub-tree
  - Case 2: I call this case "left child skewed to the left"
  - ![](assets/self-balanced-bsts---avl-trees_left-child-skewed-to-the-left.webp)
  - We rotate-right self (parent of the left child that is skewed) to balance the sub-tree
  - Case 3: I call this case "right child skewed to the left"
  - ![](assets/self-balanced-bsts---avl-trees_right-child-skewed-to-the-left.webp)
  - We rotate-right the right child that is skewed to achieve case 1, then we perform solution for case 1.
  - Case 4: I call this case "left child skewed to the right"
  - ![](assets/self-balanced-bsts---avl-trees_left-child-skewed-to-the-right.webp)
  - We rotate-left the left child that is skewed to achieve case 2, then we perform solution for case 2.
- The common pitfall here is to think that we only need to fix that one violated local sub-tree that related to the insertion/deletion, where we only fix the lowest violation of the AVL property there maybe violations higher up. We need to fix the violation all the way up to the root from the insertion/deletion point.
- Suppose $X$ is the lowest node violating the AVL properties, the way we find this node is we start at the node that we changed (insert/delete), we update the height based on the heights of its children and check if it's ok as we go up, and we keep walking up until we see, oh, the left is $+2$ larger than the right or vice versa, then we fix it.
- Phew, it's a long article though. Hope you get some sense of the idea of AVL trees. If you looking for an example implementation of it, I've coded a version of an AVL tree for storing integers in Go you can take it as reference: https://github.com/mirageruler/Data-Structures-and-Algorithms-Implementations/blob/main/data_structures/tree/avl.go. In the near future, I'm looking forward to augment it to support generic types and see if I can leverage concurrency to speed up the algorithms which mean to deal with all sorts of the concurrency related problems.

## References:

- https://en.wikipedia.org/wiki/AVL_tree
- https://www.youtube.com/watch?v=9Jry5-82I68&list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb&index=5
- https://www.youtube.com/watch?v=FNeL18KsWPc&list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb&index=6
- https://www.youtube.com/watch?v=r5pXu1PAUkI&list=PL-K_ib5mxHXnukhVpx_wMun21O2GQUEE0&index=5
- https://www.youtube.com/watch?v=IWzYoXKaRIc&list=PL-K_ib5mxHXnukhVpx_wMun21O2GQUEE0&index=6
