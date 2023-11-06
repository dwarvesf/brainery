---
tags: 
  - swift
title: Reproduce Apple Find Me Bottom Menu View
date: 2019-06-29
description: null
authors: null
menu: memo
toc: null
notice: null
type: null
show_frontmatter: true
author: null
created_time: 2021-07-21
created: 2019-06-29
---

Today we are going to recreate Find Me Bottom Menu view in few lines of code.

Device list Bottom Menu has three states: Collapsed, HalfExpanded and Expanded like images below

![[da7e32fb18ad8af53dffd592a0e683f5_MD5.webp]]

What we should do:

1. Bottom View can update itself height follow user finger position when dragging (Pan Gesture)
1. Bottom View can automatically resize its height base on the direction of dragging and position compare to “half position”

Create an XCode project, add a new UIView and named it to BottomMenuView.

Add a PanView as a subview of BottomMenuView and set constrain leading, trailing, top equal to superview, set height constrain to 44.0, PanView using to tracking user finger using UIPanGestureReconizer

![[memo/assets/reproduce-apple-find-me-bottom-menu-view/dabaf075b757602a5af2c6bfcead3283_MD5.webp]]

Add a bottom constraint for PanView, make outlet for our PanView and bottom constraint. (don’t worry if Xcode warning ⚠️ conflict constraint)

![[memo/assets/reproduce-apple-find-me-bottom-menu-view/8fbb0902507f83afa2b0ef1bc5f830a0_MD5.webp]]


Now let's coding.

Define some variables to set menu height

![[8a481af07dd3642e0a3001689f596f77_MD5.webp]]


Add pan gesture to panView and handle pan event

![[ab8aae75b6f84f7d28901126d81f38d0_MD5.webp]]


Update height of menu base on user dragging direction and position

![[e66f07cbd639a062efd2fc0a52315a9c_MD5.webp]]


Setup our UI and init heigh for menu in aweakFromNib

![[11c6fff8357d4f0172bb2ecf6a315d63_MD5.webp]]


Finally, test out the menu

 by add to the view controller

![[memo/assets/reproduce-apple-find-me-bottom-menu-view/f864eb297f5f2ff0a55adc3876a07a3c_MD5.webp]]

![[097b369938a9fd77abad168060e62307_MD5.webp]]


Full source code:
[https://github.com/viettrungphan/BottomMenu.git\](https://github.com/viettrungphan/BottomMenu.git%5C)
