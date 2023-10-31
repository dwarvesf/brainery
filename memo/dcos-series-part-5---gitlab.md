---
author: 
created_time: 2021-07-21
tags: dcos
created: 2017-06-11
---

Gitlab an open source developer tool (like Github) that allows you to host git repositories, review code, track issues, host Docker images and perform continuous integration, and it is very compatible for a small team wit CE version.

DC/OS supports us to run our own private Gitlab to manage source code in house. This article will let you know how to setup Gitlab with HTTPS.

## Installing

You just need to go `Universe` > `Packages` and choose `Gitlab` to install it with `Advanced Installation`. We also may change these settings to have a smoothly Gitlab.

1. Setting up your gitlab domain

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/184cfc2a-6016-4a4c-b3e3-0690b6b23453/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=724e9c145481f34429fe5c7cfdf1293355fb7b62af5cb4e867eaebda7cfe7f9a&X-Amz-SignedHeaders=host&x-id=GetObject)



1. Setting up email client

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/94da9abd-c40c-46a1-a19e-c1e5a3c2f418/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=63df0708620e633876dbedb8ff0976637f36c93d0edb86352d4bbdbf71789d85&X-Amz-SignedHeaders=host&x-id=GetObject)



1. Set a specific private node IP, so when we need to restart or upgrade new gitlab version, we wont lost data

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4c49717c-2c8b-4f94-a8da-70ac742fcbe9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=5db28c85944966928664629a4b13e180e72a2255c3182e5f063c8ddcb773ce92&X-Amz-SignedHeaders=host&x-id=GetObject)


After all, we can do `Review and Install`. If everything is OK, Gitlab service will be like this:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/004e0b12-8bf4-421f-8a6c-21cf59e5eb60/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=fad8995d92a3fd238d42108ee0510f1761c5587e13c8542de0b5e90027878ba6&X-Amz-SignedHeaders=host&x-id=GetObject)


## Setting HTTPS

By default, Gitlab on DC/OS doesn’t supprt `HTTPS`, but we can customize a bit to make it more secure. To do that, we need to do a few things below to enable `HTTPS`, ok let’s do it now:

1. `Edit` service Gitlab and add below setting to env `GITLAB_OMNIBUS_CONFIG` then `Review & Run` it:

```plain_text
nginx['proxy_set_headers'] = {   \"X-Forwarded-Proto\" => \"https\",   \"X-Forwarded-Ssl\" => \"on\"  }
```



1. Copy your `.pem` files to public node which is running `marathon-lb`. For me, I will copy and paste it to`/srv/marathon-lb/domains/example-git-domain.com`

```plain_text
$ scp cert.pem core@public-ip:~
$ ssh core@public-ip
$ sudo mkdir -p /srv/marathon-lb/domains/ssl/example-git-domain.com
$ sudo mv cert.pem /srv/marathon-lb/domains/ssl/example-git-domain.com
```



1. Config `marathon-lb` service:

3.1. Add new sharing volumes


```plain_text
  {
    "containerPath": "/etc/ssl/domains",
    "hostPath": "/srv/marathon-lb/ssl/domains",
    "mode": "RO"
  }
```


3.2. Add `"/etc/ssl/domains/example-git-domain.com/cert.pem"\`to `args`in `JSON Editor`

![](https://res.cloudinary.com/dwf/image/upload/q_100/v1575366749/Websites/Blog/20171106-dcos-part-5-gitlab-5_hjdtyv.jpg)


3.3. `Review & Run` marathon-lb again to update new changes


After updating those settings, you now can go to `your-gitlab-domain.com` to enjoy your result.


If you face anything weird while setting up your Gitlab, you can contact me via `quang@dwarvesf.com.`
