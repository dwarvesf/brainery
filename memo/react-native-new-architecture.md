---
author: 
created_time: 2022-06-14
tags: frontend, engineering, radio
created: 2022-06-14
---

📖 Introducing react-native's new architecture changes that boost performance, bringing react-native back into the race with Flutter


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/16c50586-b49f-4e65-aa2d-12c2cce677ca/react-native-re-architecture-banner.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=a3b0136f0d2fe284ba0fffebf773746a00e5738a22645c828a5782e064382909&X-Amz-SignedHeaders=host&x-id=GetObject)

## Introduction of react-native 📱

> React Native is a JavaScript framework for writing high-performance mobile apps that leverage iOS and Android native components. It is based on React, and is very accessible to React Web developers

After a long announcement, planned from 2018, appeared in 2020, merged in 2021 and officially published in April 2022, react-native has a new architecture that improves performance dramatically. excel, helping it get back into the cross-platform app development race with Flutter.

We will find out what changes this new architecture have made to improve the performance of the application, and whether we should upgrade to this new version right away.


The content of the post will include the following main sections:

1. **Old architecture of react-native **📺
1. **What's new in New Architecture **🌟
1. **Fabric - JSI - Turbo module  **🚀
1. **Migrate to the new architecture? **⬆️

# **Old architecture of react-native **📺

Basically, the old react-native architecture was standing on 3 threads running in parallel

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2a1bcba3-cf24-47cf-9922-027af9b6827c/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=1312bdfcab6bf2f5fbd5f790ba41df6ef544ba401934604f396d29efa736283d&X-Amz-SignedHeaders=host&x-id=GetObject)

1. **JavaScript thread: **Where the JS code is read and compiled and where the React Native app business logic is handled
1. **Native UI thread:** Responsible for the app's UI, this is where the native code is executed
1. **Shadow thread**: Where React Native calculates your app's layout using Facebook's Yoga (its own layout engine), which turns flexbox-based styles and turns them into native height, spacing, width...

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/035da268-ee5d-4400-88fd-01f9330dd5ad/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=c08ac789cfd68eca646305b773dab0a63687e0130c989bd2e160e568b3078f48&X-Amz-SignedHeaders=host&x-id=GetObject)

## Cause of congestion, slowness, f**rame drop -** **Bridge  **🐌

**In order to make the communication between the Native and the JS thread possible, you had to use a C++ module: Bridge.**

**Here's how it works:**

1. Each time it receives data from the Native or the JS thread
1. It serializes it as JSON
1. Sends it to the queue
1. And decode upon arrival.

***This bridge-based structure is prone to delays.***

Threads based on a JSON signal stream get sent over a Bridge asynchronously, but certain events on the JS thread can block the UI events.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a215efe5-bab8-4f47-a16a-da36c671d158/Screen_Shot_2022-06-14_at_01.28.11.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=bffaf1de510eecc667e45b06d300db1f9e58dd79251b4961c8cc5c05eab3decf&X-Amz-SignedHeaders=host&x-id=GetObject)

# 🌟 **What's new in New Architecture **🌟


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e28076c8-8034-4dfa-be6f-e49482f3d7eb/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=3e1d401b46801405ed78a7b156c888b070fbe4ccc0e764563946fb4a0b2750dc&X-Amz-SignedHeaders=host&x-id=GetObject)

* **Fabric: **Fabric is the rendering system, which will replace the current UI Manager.
* **JSI:** JavaScript Interface, general-purpose layer, written in C++ can be used by the JavaScript engine to directly invoke/call methods in the native realm.
* **Turbo modules: **This will significantly improve startup time for ReactNative apps.

---

# Fabric  🧩

* Fabric is the rendering system, which will replace the current UI Manager.
* The Fabric renderer seeks to improve the interoperability of React Native with host platforms, which are responsible for embedding React Native in Android, iOS, macOS, Windows, etc.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/21732465-3c1b-472d-86a0-d31657e0f07e/Screen_Shot_2022-06-14_at_01.30.54.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=0180553da8f555ddca9f6ae252afdae206825ef0f15bad64d3627184be8c48e2&X-Amz-SignedHeaders=host&x-id=GetObject)

ReactElementTree (JavaScript) --> ReactShadowTree(C++) --> HostViewTree(Native) 


# **JSI - JavaScript Interface **🎨

Through the JSI, Native methods will be exposed to JavaScript via C++ Host Objects. JavaScript can hold a reference to these objects. And can invoke the methods directly using that reference.

* JavaScript has a direct reference to a native module
* It calls a method on this native module, via the JavaScript Interface

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4ad635e9-6d0a-4933-85d8-8828c98da5b6/Screen_Shot_2022-06-14_at_01.37.35.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=a5d88bd6b2049db79a191664cb5e68fb74c8123b3f87be8c1229e5f9922b25d7&X-Amz-SignedHeaders=host&x-id=GetObject)

# **Turbo modules **🚀

* Turbo Modules are basically an enhancement over these old Native modules
* JavaScript will be able to hold reference to these module
* Which will allow JS Code to load each module only when it is required. This will significantly improve startup time for react-native apps

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/db145db6-4ec5-4111-8829-3f85cccff301/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202224Z&X-Amz-Expires=3600&X-Amz-Signature=5e50e7269ba31f9723d95c874d590b5d8eeffd89f76527b2e2b1947677edf2b2&X-Amz-SignedHeaders=host&x-id=GetObject)

## **The advantages of the New architecture**

1. **Huge performance gains for your react-native apps**
1. **Better app launch time**
1. **Shorter app development time**
1. **The possibility to use it for large system goals (with all that C++ power at your disposal)**

---

# **Should I migrate to the new architecture? **⬆️

Not yet!

There are many libraries that support new architectures (Fabric not yet), for example reanimated library is an important animation library in react-native community, it doesn't support Fabric yet leading to many other UI libraries like gorhom/react-native-bottom-sheet also get error. 

My project that uses react-native-maps on android (AirMap in native) also doesn't support Fabric so it also got an error, forcing me to disable the new architecture. At the same time, the FlexBox layout on version 0.68.0 is also unstable. So my advice to you is if your project is in a rush, it's not a great time to update it to a new architecture, we should wait for the next 1 or 2 version. (0.69.x) is much more stable and bug-free, and other libraries also support the new architecture for better performance.

If you want to try something new on your personal project, you can update right away.
