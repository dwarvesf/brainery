---
author: 
created_time: 2021-07-21
tags: swift
created: 2019-06-29
---

Today we are going to recreate Find Me Bottom Menu view in few lines of code.

Device list Bottom Menu has three states: Collapsed, HalfExpanded and Expanded like images below

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/061db26b-36c0-447c-92d8-f8b358b09958/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=1abc31a9ae8cae4ddbf8245ebb0cf49d043ad32c73044670c07059ddceb5c0f1&X-Amz-SignedHeaders=host&x-id=GetObject)

What we should do:

1. Bottom View can update itself height follow user finger position when dragging (Pan Gesture)
1. Bottom View can automatically resize its height base on the direction of dragging and position compare to “half position”

Create an XCode project, add a new UIView and named it to BottomMenuView.

Add a PanView as a subview of BottomMenuView and set constrain leading, trailing, top equal to superview, set height constrain to 44.0, PanView using to tracking user finger using UIPanGestureReconizer

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/12564e92-dc30-4671-b9c0-9cfadca59a6c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=1c043d1e7fa4a0ad49ff55f57d51989e78eeddefb6221382cd831d8142c545bd&X-Amz-SignedHeaders=host&x-id=GetObject)

Add a bottom constraint for PanView, make outlet for our PanView and bottom constraint. (don’t worry if Xcode warning ⚠️ conflict constraint)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ffe93706-d8f5-4aff-b4b4-01e9e4ad7cc8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=3eae8b8d5eeb18415e8d837168447d03567fdd01bd518b5a9a29d25811ae0be8&X-Amz-SignedHeaders=host&x-id=GetObject)


Now let's coding.

Define some variables to set menu height

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f2705994-f861-4887-971f-bafa61c15ec2/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=ca8139625d54a9ee47ac5464837fafa945121f43b1bd8b156393f62c027686d8&X-Amz-SignedHeaders=host&x-id=GetObject)


Add pan gesture to panView and handle pan event

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e536e571-4f93-4d17-8283-489f899044ef/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=845fa66fc90ddb9e672f0ca92cf2b061cec7031ff35043c932b65faa78450283&X-Amz-SignedHeaders=host&x-id=GetObject)


Update height of menu base on user dragging direction and position

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/90ad2db6-575a-42a1-b594-975a647d1f40/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=53184a0eeb7aa42ebeb875cc93f016c9f4d76c6a0463e3d3a05a7f38a9623f35&X-Amz-SignedHeaders=host&x-id=GetObject)


Setup our UI and init heigh for menu in aweakFromNib

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7a40d2b1-f5f8-4893-a4d5-29c159b8ea65/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=7c1cc2d984d1bc8b9abb4dccc736a578f201ee1dfa160b933b1f6769787e1048&X-Amz-SignedHeaders=host&x-id=GetObject)


Finally, test out the menu

 by add to the view controller

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/81525cac-b009-44db-89d9-514ce47f9629/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=71aa2efd839e9ee6a8c58741c38e3f9684e9741aa89d41075f53a435718276b5&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/37d01ac6-0b6b-4b04-9d1a-00d14262d349/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202404Z&X-Amz-Expires=3600&X-Amz-Signature=a345aef05c8c4417586e2be69919f0ba17e97ffcd75520f757c4774a3a0adcec&X-Amz-SignedHeaders=host&x-id=GetObject)


Full source code:
[https://github.com/viettrungphan/BottomMenu.git\](https://github.com/viettrungphan/BottomMenu.git%5C)
