---
author: 
created_time: 2021-07-20
tags: docker
created: 2016-02-04
---

When using Docker, you will quickly realize that the image using to run a project takes a big capacity. A simple image ubuntu took nearly 200MB, but you don’t take full advantage of its available tools. Other images like Node, Go, etc almost run in Ubuntu, debian and only set up more environments to easily deploy. However, downloading a new image takes more time because of its big capacity and it seems to be not necessary at all.


I found an empty image, except some added metadata by Docker

```javascript
docker pull scratch
```

Therefore, this Docker image has the smallest capacity

## How to deploy an app web with this Docker image

* I will demo with beego web.
* I cannot compile app go in this empty image because it has no Go complier. And while using Mac, I cannot compile a Linux library. In reality, we absolutely can cross-compile but I will not mention in this blog. You can refer to [here](https://golang.org/doc/install/source#environment)
* So I need to create an environment to compile and docker build source Go

```javascript
docker run --rm -it -v "$GOPATH":/go  -e "GOPATH=/go"  -v /var/run/docker.sock:/var/run/docker.sock -v $(which docker):$(which docker) golang bash
```

* With the above command, `-rm` will delete container after exit,`v "$GOPATH":/go` share directory GOPATH to container, `e "GOPATH=/go", -v /var/run/docker.sock:/var/run/docker.sock` is used to run Docker into container (docker in docker). `v $(which docker):$(which docker)` is used to share command docker, golang is image environment to build Go binary and build image, bash to begin Bash session.
* This time, because I went into container, I cd to project `/go/src/git.dwarvesf.com/ivkean/web.`
* Create a Dockerfile with the content below

```javascript
# scratch
FROM scratch

WORKDIR /web

# copy binary into image
COPY web web

# copy other necessary files
COPY conf conf
COPY static static
COPY views views

EXPOSE 8080

ENTRYPOINT ["/web/web"]
```



* Build source by command: `go build`
* And link library by:`CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o web .`
* Build with docker: `docker build -t beego-web .`

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b84fdaf2-0b3b-4c00-aa8a-0c36290f85bd/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=c9d5f62ba42cd13023b57b02673675a94003f8d7cbc889782b63b0b055ce5463&X-Amz-SignedHeaders=host&x-id=GetObject)



* Creating an image only takes 17.5MB

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/76d67572-288b-4f41-b72d-baf57dfa819a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=f19596121117f69ffa6a8d9bbf999b1b768e1c7f50298703e9c147999d8b06a0&X-Amz-SignedHeaders=host&x-id=GetObject)



* Your laptop had an image, which is beego-web

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f6bfaea6-e439-44f3-b09d-376fb87174c9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=4c0d066a23da5a4f9a9cb92c8ec3fe329a6d27f2beec41a81e47c080a440396a&X-Amz-SignedHeaders=host&x-id=GetObject)
