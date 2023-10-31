---
author: 
created_time: 2021-07-21
tags: swift
created: 2020-03-23
---

SwiftUI are nice and fun to working with. You can read my previous article to get a bit knowledge about create circular control, it will make you easy to working with this article. This article also use Shape and Path, if you have worked with CoreGraphic before you will find it similar With CALayer, CAShapeLayer and UIBezierPath.

> Create Circular Text using SwiftUI

First of all, let split watch to small components for easy coding. A watch has these following parts:

* *Circular Bezel*
* *Ticks-Markers*
* *Hour, Minus, Second hands.*
* *Number markers. from 1 to 12*

As usual, open Xcode and create new project, don’t forget to choose SwiftUI, add new SwiftUI file and named it Watch.

### Draw Circular Bezel

Path is similar to BenzierPath, you can draw Oval, rectangle, line, arc using Path.
I choose Arc for now. Later on we can using Arc, Oval or Circle to make different watch face style.
Add a new struct and named it Arc conform to Shape protocol.
Xcode will guild you add missing path method to conform with Shape.

Path methods provided us rect which is the frame we are using to draw on it.
the Act function required center point, starting angle and ending angle, we need complete circle so let start with 0 and end with 2pi which 2 angle of circle in radiants

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ba48f1fb-2537-4f88-96f5-1b57bc6dacc9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=7ab410d8559e02dc4aae9376e1e324c8975a1be2caf9ecdf4422090c50317d98&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7ea9cdf7-806b-4956-b8a9-d923d4158a87/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=f62ea5f4bead5ce5cb6426433a270f28e6c699b9b1702945cba2a3723eb8eb9d&X-Amz-SignedHeaders=host&x-id=GetObject)

Try our new Arc struct, nice we have a black circle, you can try replace stroke(lineWidth) by fill() and see what happened, also try different starting and ending angle to see what happened.

### Draw Ticks-Markers

Create new Struct Named Tick, it also conform to Shape.
This tick shape simple draw a line front top center down to 5 points

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/75d4c2af-73eb-46ec-a107-6fd7473e24f8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=5cd73d7f1736f588c161ddc0afeeb8fc8cec41464bebe03c8fd076a6caafcc68&X-Amz-SignedHeaders=host&x-id=GetObject)


Try out our new Tick, also embed all of them inside ZStack and give frame to make all view inside Stack have same size.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a136afc2-2df9-445d-958f-69b1fac7e8cb/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=a70df41698fc1057e23cf95a83468eb332a558cccc71b73edd6542f512923537&X-Amz-SignedHeaders=host&x-id=GetObject)


Our next job is simple, just repeat 60 times and rotated it.
The angle for each tick just a circle divided by 60 (2pi/60)
For readable and maintainability, I create new view named Ticks for it.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/177d3a5f-eb25-46ce-a0c1-77ce04e7d13e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=d4e6c7a64b89296c3c8470f2afc14fc43cc06ee39e9e7fe268d238fb18f18e01&X-Amz-SignedHeaders=host&x-id=GetObject)


This is What we have after repeat 60 time.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/cb7b8861-f39b-45c5-82a6-41ba040321de/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=5f1fb832e3949628e6926d3e773347e36d09acb2da364b1b35f8777a7eaf3f6c&X-Amz-SignedHeaders=host&x-id=GetObject)


However at 5, 10, 15, 20… minutes we should make tick a bit longer.
Let change our Tick and Ticks View a bit to add this extra.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9883c511-bddb-459b-b683-2ccce0265fdb/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=0373595d228c593e21241fc9c8942b4f4842d00f66abc104c6cef1c6beb03285&X-Amz-SignedHeaders=host&x-id=GetObject)

We have finished draw ticks, let move on hour Numbers.

### Draw Numbers

This use the same technique with [my previous article](https://medium.com/@phanviettrung/create-circular-text-using-swiftui-32cd7e5b6414), feel free to read it.

Basically we create a VStack with Text and Spacer to make the text at alignment top and as tall as parent view. This trick helping us easy to rotate the texts and keep the same radius.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f14e58ed-508b-4c41-bf7a-b52c4b360a7b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=42010bfdc22c2d0bc26db2dd3fc074b5bde7b32f538f62e2b7d69b4736ce3c86&X-Amz-SignedHeaders=host&x-id=GetObject)


Just like Tick, we repeat it 12 times, because number in Watch show from 1 to 12, I use 1 -> 13 instead of 0 -> 12

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0d815eb9-51c5-4540-bb8f-92e527803713/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=a92ec48beeedf4bdbb4e723f368992d1907712c1a6e822b0e3293f3290265fdf&X-Amz-SignedHeaders=host&x-id=GetObject)


Try it and We got beautiful numbers indicator.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/61162620-a0e7-4318-95e7-50cb09b14d63/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=e1504944eee6960fefd56ee4be5466cac9e02290cdf87d769050d3e1ac1bce2b&X-Amz-SignedHeaders=host&x-id=GetObject)


### Draw Hour, Minus, and Second Hands

Make a pad circle for our Watch Hands. This completed by helping of building circle

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2a8c1fa3-7af3-4856-ab12-7528dacbe654/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=9837a46fa728c7c1a9d145a96a8e052d5a6593d866361c073cfcc8b71a254eda&X-Amz-SignedHeaders=host&x-id=GetObject)

Now the Hand, we draw a round rectangle from center to some where between center and top, depending on it is an hour, a minus or a second hand.

Create new Shape, named Hand, to adjust height we adding offset property

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0bb615c0-2f00-4917-a8dd-01bce4e97255/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=beb529d46609b025919fb8d67ef16e64ad2e3e73e1705b7f58a3eca37d7ec6ab&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/31d3d5ac-3fc7-4528-80e7-dca1b61320c2/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=e58334a6223b974e8c57f80ceb4aeda176baf4ae448fb7213a9034943bfdc206&X-Amz-SignedHeaders=host&x-id=GetObject)


Test minute hand, using frame width to adjust how wide it will.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/822027c1-a2de-488c-832d-67ae5a2d739f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=4c0e2b6bd356855e474bd1db89bce91b8368a32c37c4c3493bb8f9fb27ed035d&X-Amz-SignedHeaders=host&x-id=GetObject)


Now repeat with hour and second hand

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/04298a23-017d-4a2d-b62a-7afba7d1d3c7/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=9e124662551370a87277478d92dc26feb173bf4d7fe89588393e47c8d0d711df&X-Amz-SignedHeaders=host&x-id=GetObject)


It hard to see because it overlapping each other. You can use debug view hierarchy view to verify it.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8b8d1373-b693-47cd-8b04-9b2e80c7d92f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=5fdecb268d0302ee277c7ef26e6ff072aa7718387a5ab089770118360dd61b3c&X-Amz-SignedHeaders=host&x-id=GetObject)


We are not finished yet, our watch look better if we add a red dot for second hand.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6beace31-f392-4e1d-b016-42ac3c83031a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=f0d1ba35ae605ee36d2d3eb5b8fe7d8528d1c21fe8523b16b98440b5fdf598f1&X-Amz-SignedHeaders=host&x-id=GetObject)

We are finished our Watch View but let it “run-able” by make hands tick real time.

Add a date State property wrapper. We will update this property each one second, Hour, Minus and Second hand will know this change and make adjustments.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f1057934-6533-4369-a236-e0acda650642/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=c0ad97a9ae58f562298a1fcb026720b1ab3a1990c665ea32b4d5c252f70a659d&X-Amz-SignedHeaders=host&x-id=GetObject)


Add a method to automatically update “date” variable.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/16e05432-da9e-49ee-be84-45e608460cf2/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=72401efb110b4554299af3fb3e3b3296a2ae176f34c6b188719c124657a2fbf9&X-Amz-SignedHeaders=host&x-id=GetObject)


Call this on view appear event of ZStack

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3e9062f3-4fc7-4995-bc89-4b8826662e75/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=26bc4f44efda39b369494e4528c86c3dea8c275213e1c5cf8616c9e5f41cf1a1&X-Amz-SignedHeaders=host&x-id=GetObject)


The final thing is base on current date time, we calculate an angle for hour, minus and second hand

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7376734c-6cfd-469e-b0c6-41c6b138bbb9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=a06ff520bffceeb3a7e9cfbbb942d20ab28a8ebc9db3d36adfed4724b23a7ac1&X-Amz-SignedHeaders=host&x-id=GetObject)


The code is it self explanatory, I don’t have anything else to tell you.

Now use angles above to make our hands rotation

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4434ae61-647e-4f56-9985-03b8f1467aea/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=ec3da8c1ea5f76f119ee99aeb1283f89c1fefe8685f585b983e66d97f3e8475f&X-Amz-SignedHeaders=host&x-id=GetObject)


Congratulations, our watch now run as normal watch.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/835bdec3-b85f-4924-a9ab-5ca23e33ea89/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=23a6e12ae7e86a99773df832bcbbabd96e5d12a8bd86baf5517ff342ed108454&X-Amz-SignedHeaders=host&x-id=GetObject)


### Bonus part

You can change Arc to Circle, mix with different color to get more watch face

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3516483a-7242-44c7-a703-42973e28f516/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202403Z&X-Amz-Expires=3600&X-Amz-Signature=5ab6f8b98f055ab8c1f5728f67709576407cbf95f421eea691053c94067699ed&X-Amz-SignedHeaders=host&x-id=GetObject)


View more at: [https://github.com/viettrungphan/SwiftUIGeometryPractice](https://github.com/viettrungphan/SwiftUIGeometryPractice)
