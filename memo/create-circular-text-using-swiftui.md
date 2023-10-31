---
author: 
created_time: 2021-07-20
tags: swift
created: 2020-03-23
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9899ef2c-3e67-4773-84a2-eb126d8c795f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=a005afeae451c689425763d7b15789f7511b009cb58476520991d89baeddeddb&X-Amz-SignedHeaders=host&x-id=GetObject)


This is what we have when finished.

Fire up your Xcode and create new SwiftUI Project.

Create new SwiftUI file and named it CircularText.

The first two attributes for our control of course is String and Radius for our circular.

Add 2 Attribute named

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/532c52f1-07db-491f-bbd3-553dff0b76de/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=0589a8a5c4a5138186938549ae0780f9896cfdee1a12de72aae9dac4838280ba&X-Amz-SignedHeaders=host&x-id=GetObject)


To make a circle text we split out string to array of character, each character will have it own Text control then we going to rotate the text to match circle.

Define computer property to split string to array of character:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f963ffcc-eeed-4e83-89d1-1e56347e7c47/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=18a15b946bc99cad854547cb4fa716069cae8958511dc1a52ace2e6ae2fbee90&X-Amz-SignedHeaders=host&x-id=GetObject)


Using enumerated to get offset using later.
To calculate angle using to make rotation later we need 2 things: perimeter of circle and width of each character.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/89c46225-b2af-47f3-be80-cf61d544e4f8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=a77af3523a00022764434e5d8009843bae9a641998ca5e2c66c695dcd6489c82&X-Amz-SignedHeaders=host&x-id=GetObject)

Later we will use it as radius.perimeter

For Width of each character is a bit complicate. We need place it in some control and get size of that control somehow. Text is the best candidate for this case.

Embed Text and Spacer in Vstack we have a custom control as tall as parent view and the text at top of control, this make us easy to make rotation later because we just need rotation at center of control.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7bb0e64b-f35c-44f7-ae17-90bc7171d9a8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=7c3d16efb693557a1eca3186dd73da90350c9b5d231be805bbbf5a2cb1cd3740&X-Amz-SignedHeaders=host&x-id=GetObject)


Now we have List of Text, the next thing is get it width value. SwiftUI let us get size from control using GeometryReader, and we send it to outside using PreferenceKey


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0c3e9a94-76fc-4ac3-88fe-5e490e07ab68/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=345aa9500768bf2ca3c9be57eb4fe8d86b0d34227c66068308bb485ea0cbf207&X-Amz-SignedHeaders=host&x-id=GetObject)


We going to place custom Sizeable View as background of Text, because Sizable View actually a Color, it going to fill the parent (which is background of Text)so we got exactly size of Text
To store that sizes let add a Dictionary to save it, the key will be the position of Character. Add a dictionary named textSizes


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/779b7f43-1044-4ae8-a93b-6d5bd579f8bd/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=8b77c2607abd36eb267587ef2a140698291c35cd8430f57f246a2e82d6271eb7&X-Amz-SignedHeaders=host&x-id=GetObject)


Update our VStacks to save sizes when preference changed

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d77819b0-bddd-4046-a02a-73e5c7a11196/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=22b22a1f90e9778aa35856567b6f29c346478add95adcd4ecb7b22b534c29861&X-Amz-SignedHeaders=host&x-id=GetObject)


We have perimeter and with of each character, now calculate angle of each character by it position

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/900f163d-3d06-4feb-9050-b5d3f49bc632/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=f2c6e2a1b2d72f5e5f4c134fb42f04713f5f6ee497efd1b9991ad61a3cdaf400&X-Amz-SignedHeaders=host&x-id=GetObject)


This function simple calculate how many percentages of size.with compare to perimeter of circular, then figure out angle by that percent.

We have angle, now make rotation and see results:


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5b69662f-5dad-473a-aafd-db791bb5fbf6/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=2dd370c3fdde9b4e8d569e0716e3273430bed640f14ccc555c7f3656dc69aff9&X-Amz-SignedHeaders=host&x-id=GetObject)


Look like the space between characters have problem. This because of it just fit enough for horizontal Text, when we make circle, the rotation angle make it close together. Luckily the building kerning Modifier make us easily to adjust it.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/94d63b97-6e46-495a-a32b-f4c24a4d4660/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=b056e3a66de9d5194a1b8fa1139c64c9a2b322eb76b5a8828f91f793f416c77b&X-Amz-SignedHeaders=host&x-id=GetObject)


If you want to make it center, simple ask the angle of last character divide by 2 then rotation it anticlockwise.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e3731d04-e017-481a-ab58-da6d79cb43be/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202422Z&X-Amz-Expires=3600&X-Amz-Signature=def2d3b133ed79e15b7766b5bc1398204f8ba82e0c5f25b098ece143f7d10e9f&X-Amz-SignedHeaders=host&x-id=GetObject)


We are done, hope you enjoy and have fun with SwiftUI.

View more at: [https://github.com/viettrungphan/SwiftUIGeometryPractice](https://github.com/viettrungphan/SwiftUIGeometryPractice)
