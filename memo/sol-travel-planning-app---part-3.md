---
author: 
created_time: 2021-07-20
tags: design, case study
created: 2018-10-09
---

# Introduction

Today we shall continue our series of designing “Sol-Travel Planning” app. As we mentioned our process on UX research and UI design in the last two articles, Sol’s target users are the young so keeping the app fun with interaction is a must.

# Main Motions

According to Issara Willenskomer from UxinMotion, motion implementation in UX design can greatly help improving usability in four noticeable ways: fulfilling expectation from the users, maintaining continuity among a set of scenes, inventing narrative — story-telling flow throughout the user experience.

## Onboarding

For first-time users, we create an onboarding flow which comprises of Paging animation, enhancing a natural experience while using. The bottom button keeps the experience familiar and enables the users to get to the Sign-up button as soon as they are pleased.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c41015fb-5df9-4c2c-95cc-7c42a20371ac/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=cedc644f5fe3a6c5935f8496d26811d7f3a8391f0e49cfbcb721258ba58779f1&X-Amz-SignedHeaders=host&x-id=GetObject)


## Walkthrough

A quick walkthrough of sections area to introduce users to where and what to find in them.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1d26ee69-35fc-4bb6-bfe6-04553f6e9fdb/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=64420ebaa7a4a92113495ca1c110801c13ccb042c8d33275d395b47d598d8205&X-Amz-SignedHeaders=host&x-id=GetObject)


## Switch between segments

Each group details are separated into 4 segments. These motions in need should replicate the movement of flipping through some notes, which may create the feeling as if the user is getting by the notes they make about their trip.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ac8b2908-6f06-4460-8ea0-2007e1474a91/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=a09ac2000b07fe5e3d71efdd1b5e8d3089631b66cb9eafc39cee344e1b58336b&X-Amz-SignedHeaders=host&x-id=GetObject)


## Changing the location order

When the user wants to change the location list’s order. They need to see where their rearrangement is getting and what is being selected. Hence, we add the selected location light shadow to attract more attention to it.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5b80b9a3-743d-4990-9ea6-86f88eca9205/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=688f80bbf6cc5acceb855b7a8bea2b1c39b0c60909396d6e6a9d5ee5b093a768&X-Amz-SignedHeaders=host&x-id=GetObject)


## Tracking a member

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/91f3b566-89c3-4712-a54a-85c487758c5e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=2ac67433eca0ca128b54accb018595d11a5134b23d695b4c878ba1de1d4af73c&X-Amz-SignedHeaders=host&x-id=GetObject)


## Deleting a device

When the user swipes an item, it will slide to the left side of the screen to reveal the Delete option. When the first device is deleted, the second device moves in the first to replace its position, which also indicates it will function as the first.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9da2142d-03fd-42bb-a025-e03cd73df6a6/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=da098be4cc37c8cf65cbbbe73b6457a4729b373a64f90679d681774a8cb5a2bd&X-Amz-SignedHeaders=host&x-id=GetObject)


# Using Protopie in creating a real-life Prototype

## Why we choose Protopie

At first, we were looking for an app that not only supports many interactions but also is able to create useful animations. We came across popular apps as inVision, Framer, and Flinto. Each has their pros and cons. For example, inVision is great for webpage prototype because websites don’t require high-level of gestures as mobile (swipe up and down perhaps), just moving between the screens is enough for you to create a viable prototype of your website. But, when it comes to mobile app prototype, the need for other uses of interactions is inevitable, since smartphone users are getting more familiar to a myriad of gestures. That leads us to discover advance prototyping tools like Framer. It is a powerful tool to create a prototype with no limitation of animations or interactions, though it requires a high learning curve since it involves coding, and it doesn’t support importing from Sketch very well. Whereas Protopie is a similar tool that is code-free and requires a much lower learning curve. One of the things I like most about this tool is its document, it provides sufficient info in my learning process.

# Steps to create our motions

## Switching between segments

The idea of this motion is that when the icon area of a segment is tapped, that segment will slide into the screen as respond. Breaking it down, we have the following rules to create:

* Each icon area has two states, active and disabled, and there is no more than one active icon at a time.
* Each segment appears according to the state of the icon presented.
* There are two slide-in styles of a segment: right-to-left when switched from a segment from the left to the right and left-to-right as reversed.

For the first rule, we import two images of each icon from Sketch — grey ones for disabled, the other for active.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f2185c23-0deb-46f0-98a7-28ccfe8a13f2/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=63be199a4801da3da82fba93a5ca2e4bab98d7a74d83b087c317ebd987d01d76&X-Amz-SignedHeaders=host&x-id=GetObject)


In order to create the color change property for the icons, the red layers’ opacity is set to 0%, the grey layers’ 100%, and a chain needs to be produced to bide the opacity of the two types of layer. As you can see in the picture below, the range for the opacity of **Member red** will change according to the opacity of **Member grey**.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8da16ade-51aa-41ea-a0b5-dbc3c2e2b70a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=1f06117e8f7d600b6251479f1bdba7bbec5581cc7bd1a5e398002bf421b61b08&X-Amz-SignedHeaders=host&x-id=GetObject)


As default view for a Trip Info, the first segment to be viewed is Members, so the default opacity for** Member grey** is 0% to reveal the layer **Member red**.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/78613357-9986-4ea8-82cd-b8f22c8c511f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=75ef6f28536ce7fba7e5c23335ea017aedc1507c0ba2efeec66041752b2ae231&X-Amz-SignedHeaders=host&x-id=GetObject)


Next, we need to bide the active state of an icon to the appearance of a content component, so that when we tap an icon **both** the state of it and the appearance of the content would be triggered.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3af97dc4-6fa0-4867-9705-968a9cf897fa/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=a5e819835dd4a96f0dd8a3892445f3ec3ceef522dcaf80708ebbd27b5a3d16aa&X-Amz-SignedHeaders=host&x-id=GetObject)


Finally, the third rule was quite more complicated to create. Let take an example. If you move from Member to Journey, the transition should be right-to-left, while from Summary to Journey, the transition would be left-to-right. So, if the user taps in a left-to-right sequence, we can arrange the content components as layers horizontally (0 400 800 1200 respectively), then each tap on an icon the **Journey**, **Expense **or **Summary **could move to the position of **Members **to create the required transition.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e1ce90a2-6513-43bb-9934-a1e5829a3b65/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=c593a2c3fd5a4cee7ed8299a518c1cc303357b06b5cad270039bd86684ff98ca&X-Amz-SignedHeaders=host&x-id=GetObject)


Now, to create a trigger for each icon, we use **Tap**, the opacity of **Member** content component will be changed to 100, and the state of the icon Member would be conversed to red accordingly.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/79a897ee-80aa-4d84-bd6d-287c97a96be4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=2f2c1513b01b39ee457cba6623a04b4642aaa2c93a860cfd76541f045264eeb0&X-Amz-SignedHeaders=host&x-id=GetObject)


For further transitions, in some case, the user moves to another segment such as Journey and goes back Members again, then they should see the Journey disappear with the left-to-right transition. That means the Journey should Move back to its original position when the Member is navigated back. To create this we add a condition for Journey as below. The other two layers will have the similar condition.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0e0413ea-685d-4d10-97cc-84774b99b55b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=5082a512e849600afe29173ed17f73f5f750385544d3fde7d257896245982ee0&X-Amz-SignedHeaders=host&x-id=GetObject)


For the other three icons, we will divide into two groups: the layers on the left and the ones from the right of the selected layer. For the layers from right, we will apply the similar Condition as above. On the other hand, we should Move the layers from the left to the left side by using the negative value for the property **X.**


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6ab7a2be-9f92-43fe-8ae0-8d238fd9025e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=7b7911e562029cfbb2a292302c9a49b00554fcc50f65fb7bfe7ddae568ceaa4c&X-Amz-SignedHeaders=host&x-id=GetObject)


## Tracking a member's lcoation

In this part, we will show you how we created the map route animation. Our idea is to mimic people movement from one point to the other on the map.

In Protopie, we use **Scale** and **Opacity** to pull it into practice. There is two rule for us to build in this motion:

* First, **Scale** a **Rectangle** with the size resembling that of a circle to the length of the street that the user needs to go until they make a turn.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9476653f-f719-46c7-a810-6fe2c8de577e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=3caaf673d33a9ce6c2091ae56ab814103e5af9139c3a337a2d1e4b1fd08038e5&X-Amz-SignedHeaders=host&x-id=GetObject)

* Second, a full-length of the Rectangle above appears after the Scale effect has gone off.

Applying the first rule, create two **Rectangle** with the **width** of 4, height depends on the length of the route.

Next, we will have the first **Rectangle** set up. There are three properties needed to rewrite: **Size**, **Rotation**, and **Origin**. As the route will start from bottom right to top left of the screen, the **Origin** should match the start point (here it is (100,100)). The **Rotation** of the route can be determined by rotating the rectangle to match it with the full-length rectangle. After setting up the Rotation, fix the height of it to 4.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8bcf44e9-814d-4c89-9fa1-13ad5d3754c0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=4bf10d4a4f0ccd2e8afb5d1c4240c6b6a4c1802d046ba2d7087b66d2b4b1aabf&X-Amz-SignedHeaders=host&x-id=GetObject)


Add **Scale** motion for the first rectangle.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6aa1402b-0d04-46a1-b3bb-cbf6e26b5e75/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=bb650d9915e9f5e6002214d58e4edb973328dd3f4a8846eaf553c2ba441b1de3&X-Amz-SignedHeaders=host&x-id=GetObject)


Next is the second rule, change the **Opacity** of the full-length **Rectangle** to 100 after the first rectangle finishes **Scale** motion.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/970f4e0e-88b0-4c43-b4dd-d93a9b073898/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=3056467c642616da755f45f51ff7b9e32b199eeb78e1b39334362c823a55021f&X-Amz-SignedHeaders=host&x-id=GetObject)


Finally, we need to set the timeline for each transition, the Scale of the first Rectangle happens first, with a duration of 0.4, then the Opacity of two Rectangles is reversed.


The result

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4450688b-2a42-4d7c-957e-2683ef55eacb/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202441Z&X-Amz-Expires=3600&X-Amz-Signature=23137700fda6068eeaf64a499cd1886770c894e95399c2101a84fe0c6fd3d4a1&X-Amz-SignedHeaders=host&x-id=GetObject)


## Reference

https://medium.com/ux-in-motion/creating-usability-with-motion-the-ux-in-motion-manifesto-a87a4584ddc
