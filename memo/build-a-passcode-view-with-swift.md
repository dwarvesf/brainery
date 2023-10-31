---
author: 
created_time: 2021-07-20
tags: swift
created: 2019-06-22
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3cfebd59-b350-4bdc-8967-afd293eb6d27/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=4b6d4f50fa34b394aa9d72dbee9c1ced03941884cec83b2408c740693529947b&X-Amz-SignedHeaders=host&x-id=GetObject)


The highlights before we are write our code.

* Our Passcode view can “becomeFirstResponder” and “resignFirstResponder” to show and hide virtual keyboard if needed.

\=> Our Passcode nearly same with TextField.


Define our passcode view:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/be68ef1e-27a3-4b6c-aca6-a2b56e3208ff/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=cff34bae0377c4cbde301285ef85bfc50040db1b1a85f8ccb7212ff57e2e9853&X-Amz-SignedHeaders=host&x-id=GetObject)


By default, to show keyboard on the screen user should touch in TextField or TextView to edit. We can make our custom view as keyboard input view by override “canBecomeFirstReponder” method and conform to UIKeyInput Protocol

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/13bbacb3-b28c-4086-8366-a38e2ed2ec63/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=aac4812904e81d9a9257de86e58c854c8ce229802ee2b37da3aea47e00661de5&X-Amz-SignedHeaders=host&x-id=GetObject)


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0cfafb4c-ad6c-46b8-a8d3-db42f587fe49/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=7aa89b3cd1c71e8b57dd37b8d5044b6d84363f48affd3223423899159bbcfd8f&X-Amz-SignedHeaders=host&x-id=GetObject)


Now our view can show keyboard, you can test it by call passcode.becomeFirstResponder()


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/de0ef360-5525-4af0-8f7f-846e2e70d9fd/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=d00c8c4effcfa3839a544a0d2e0475ffe8c3b295dfd0c92468b9e05c38eafe06&X-Amz-SignedHeaders=host&x-id=GetObject)


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4e49a7ff-a970-434a-ad66-862077a81847/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=78a491472c964b75b7ea01d05a5a87a8e4b42c58ea9009fea8855dbb2e50ddfd&X-Amz-SignedHeaders=host&x-id=GetObject)


To help user easy using our passcode view we can add a tap gesture and call becomFirstReponder() to show keyboard. Now you can easy tap to show keyboard.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e480ff28-990a-41bb-af58-ec4938578b74/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=62d52c38fef3ad9b802fefa0719b68c40e5ef6d92e7702585e214494ad703c6f&X-Amz-SignedHeaders=host&x-id=GetObject)


Now we are going to build our logic to handle user input. There are 3 methods we need focus:


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7214b40a-70d0-4bf5-a33a-475cb4387d61/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=f34bc339f21e13d1e687c5cf2c6d92355b3ade3702cb60ea341acd841f12462d&X-Amz-SignedHeaders=host&x-id=GetObject)


Now append or delete our code string if needed.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/795a17b9-373d-4fc7-83c1-4bd00118820c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=c2a68b0b5b58a6636cbc5d4feedc682fd40f5872fb111344163e3357c16aadcd&X-Amz-SignedHeaders=host&x-id=GetObject)


Greet, our passcode logic finished, the next challenge is map our code to PIN UI when code changed

Add an UIStackView to our Passcode view. Stack will distribute “Dot View” as Pin.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8afe74b9-83a8-4b97-966a-06c7146f8461/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=b03816fc063f4b2ba7c5345cccd7703c6cc04f32a6f1da8873eca5c7fae9f013&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/61d460c3-13c3-4b44-bdf7-fbd8d19aabbc/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=69f692c97e15292e373950b8d9027feff0a1011399af1cd3b97e14481c6d6d3c&X-Amz-SignedHeaders=host&x-id=GetObject)


Create our Pin View

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/fbc43fd4-df11-4cb4-aa01-0527f2744a23/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=bc38bf5d5b476ed21c8fc44bd4f6760edf644edd45d9e19b92d819060d8d8661&X-Amz-SignedHeaders=host&x-id=GetObject)


Create two more helper methods to create emptyPin and normal pin


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6538967f-6a18-48c1-a15b-6562d06ff844/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=c3b445778955b10794d9c9082ebeede83875fe8f91989eefcdde4bf83290a089&X-Amz-SignedHeaders=host&x-id=GetObject)


Map user input code to Array of Pin views and distribute to stack

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ce82ef54-bb89-4fdd-aed2-bff6e1d0d61b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=f885484f990e6e128960706a383c2f4ec13881efcfbe9ffd5556da4a2624f5ee&X-Amz-SignedHeaders=host&x-id=GetObject)


The helper method to remove all add Arranged sub view from stack

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c40fab5f-69db-4917-9013-ab9dd5b11db6/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=ad3032e1995f949d660578cd6b7b24efa812dcc1579d4726786df180e7d28470&X-Amz-SignedHeaders=host&x-id=GetObject)


Call our update stack when code changed

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/793628b3-3f5f-4f16-95e7-4e1f1cb82e4a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=505d383e98e9df35b41f9ca9c104af964232839a5fca01165b5170b64095877d&X-Amz-SignedHeaders=host&x-id=GetObject)


Create ViewController to test our stack:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0a4789b1-4f05-4481-982d-3b49904f5027/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=1093bd4eedc00d5ccb3c484469a39ab8b314cb231a5f525a9691e63d283f38a2&X-Amz-SignedHeaders=host&x-id=GetObject)


Make our PasscodeView conform to UITextInputTraints to able to set keyboard to numPad

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/84609132-ba78-4ca1-875f-41f815f8d83f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=044db6d9115c3b0b92babcd1d554458a6ca0ddd77fd0a39cffa4b4b006d0bfdc&X-Amz-SignedHeaders=host&x-id=GetObject)


Result


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/346019f1-2ad6-4256-a36d-8209576cd02d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=8b4109e0ac16b83b1798e78d2ee109446cd4aa1b5c9383f4861e3d7962c7b73a&X-Amz-SignedHeaders=host&x-id=GetObject)


Add a callback when user finished input.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/901d3e99-a1f0-4105-827c-ab09a82b5e8e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=4ed95c1b2f941486b771e8a8b99df5799fc26ee5f97fc2028336fd8d056ea89e&X-Amz-SignedHeaders=host&x-id=GetObject)


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/aec8117a-7962-4933-8028-ea505b0aebf6/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202423Z&X-Amz-Expires=3600&X-Amz-Signature=beebce5375878c418e07a8e9f5a82e37a4cdeeff78a1ff15fb9185016144163c&X-Amz-SignedHeaders=host&x-id=GetObject)


Full source code at:
[https://github.com/viettrungphan/Passcode.git?source=post_page-----a6ddae69f405----------------------](https://github.com/viettrungphan/Passcode.git?source=post_page-----a6ddae69f405----------------------)


Please notice the project written by Xcode 11 beta. Your can simple copy all Prefix Passxxx and Pin files to your xcode project to test.
