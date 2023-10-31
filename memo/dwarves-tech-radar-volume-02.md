---
author: 
created_time: 2021-07-13
tags: radar
created: 2021-01-14
---

---


Once every month, we gather for Radar update to round up the cool techs and assess if we should adopt that to the team. Road to a wider and more diversified rings, Dwarves Tech Radar v2 contains the practices to <span style='color:pink_background'>**simplify the workflow**</span>, new techniques/ approach methods to <span style='color:pink_background'>**upgrade our current standards**</span><span style='color:pink_background'>,</span> and <span style='color:pink_background'>**expand the domain knowledge. **</span>


## Trial

### Earthly: The combination Dockerfile + Makefile

[https://earthly.dev/](https://earthly.dev/)

A repeatable syntax builds to untangle the debugging process between the local environment and the CI platform. Earthly allows our DevOps to merge all the tools into one "Earth", and eventually simplify the whole CI/CD flow. As DevOps must integrate different files from both Makefile and Dockerfile for integration testing, Earthfile was created to remove this burden, automatically. Reproduce CI failures is also what makes Earthly more valuable. This enables developers to run CI on their local env, instead of the constantly `git commit -m "try again"`


We applied it on Voconic, our complex on-going project about Cloud platform, to fully utilize the benefit. Earthly executes targets in parallel and makes our pipelines run much faster.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/33809ae8-67ba-482b-b8f1-c608080ab486/earthly.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202452Z&X-Amz-Expires=3600&X-Amz-Signature=1bcd08b784424fbd3eb57b65b95acb5a578a7fa4524660ca3d680097e9d35934&X-Amz-SignedHeaders=host&x-id=GetObject)


## Assess

### Webflow: Build visual canvas without coding techniques

 [https://webflow.com/](https://webflow.com/) 

At some point, we figure the development phase might take more time and resources than we need. Therefore, a no-code platform is what can resolve the issue. Webflow removes the usual misunderstanding between designers and developers - enables them to convert stunning designs into production without any coding techniques. 

Duy P, our UI designer, approached this with KiwiPay: [https://kiwipay.webflow.io/](https://kiwipay.webflow.io/)


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/90cfecfa-daca-42e3-9e47-4570cf541242/Screen_Shot_2021-01-14_at_15.17.26.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202452Z&X-Amz-Expires=3600&X-Amz-Signature=c491065abf44f4eb67385744f049f0cf415654b037b4b3bbde2952faa43f69ee&X-Amz-SignedHeaders=host&x-id=GetObject)


Besides the outstanding points: Sharing for multiple collaborators, easy working flow, codebases can be exported easily in HTML/ CSS & JSON data, Webflow still has its downside. The no-code mechanism prevents Webflow from performing complex animation, i.e., generates a limitation in the animated web. Furthermore, unstable responsiveness and errors in image display are things Webflow needs to work on.

### Volta: Hassle-free JS Tool Manager

[https://volta.sh/](https://volta.sh/) 

During our work with Javascript, each project comes with different node versions. Usually, managing these versions relies mostly on nvm, requiring developers to manually run their CLI every time switching between projects. It's a waste of time and can quickly cause errors.

One of our engineers started to work on Volta - a hassle-free approach to manage the CLIs. In short, Volta detects the node versions in the JSON package, unifies them into one place, and automatically switch them as developers change their projects. Since Volta supports quick engine setup, we get to install the npm package binaries into the toolchain once and for all and then let Volta take care of the rest.

## Adopt

### **Upptime: Real time status update **

[https://upptime.js.org/](https://upptime.js.org/)

We tried out CState as our monitoring service, but CState requires low level setup at infrastructure level and therefore not suitable for our bootstrapping kit. Upptime, on the other hand, only requires a simple Github repository and a config file to get it started. We gave Upptime a twist, and rolled out our version at [stt.daf.ug](http://stt.daf.ug/).


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e6fab069-0edd-4e22-9dac-27c340fd2304/Screen_Shot_2021-01-15_at_14.06.19.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202452Z&X-Amz-Expires=3600&X-Amz-Signature=3e9482c939ecfe449f0b338634d7043357a66ee65c6afdee5b3493ba2719fbf4&X-Amz-SignedHeaders=host&x-id=GetObject)



