---
author: 
created_time: 2021-07-21
tags: dcos
created: 2017-05-05
---

There are so many interesting things in DC/OS GUI (`Dashboard` with useful metrics/status from all nodes, `Services` tab help us to know which application/service is running on which node, its status, etc.).

In this article, we will try to deploy applications to DC/OS and run it.

# Universe packages

The Universe tab shows all of the available DC/OS services from package repositories. You can install packages from the DC/OS Universe with a single click. The packages can be installed with defaults or customized directly in the web interface

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e8f2641c-54b0-4bf4-85a7-50217302db8d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=5e4ebccb2a3d294f0ef10a9b359c5d7b1e57ecc30cdfb96361410087a14d07df&X-Amz-SignedHeaders=host&x-id=GetObject)


# DC/OS CLI

You also can use the DC/OS command-line interface (CLI) to manage your cluster nodes, install DC/OS packages, inspect the cluster state, and administer the DC/OS service subcommands, deploy application, etc.

## Installing

You can quickly install the CLI from the DC/OS web interface.

1. Click Install CLI from the top-left corner of the DC/OS web interface

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2bb5a09e-75ef-4eb5-b745-a15f1e84dfa3/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=a130286c05c113a1fd53eef98ad56244f57add6c9b98d57ed541f6a33d54cdc4&X-Amz-SignedHeaders=host&x-id=GetObject)



1. Copy and paste the code snippets into your terminal.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/723b9a0b-9df9-4adc-a0a0-2d766ccc8a64/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=64806e57e5aa9587ef90d478232f0163b7edfd4b62594ffb60b44e39559d5786&X-Amz-SignedHeaders=host&x-id=GetObject)


## Usage

To list available commands, either run dcos with no parameters or run dcos help

```javascript
Command line utility for the Mesosphere Datacenter Operating
System (DC/OS). The Mesosphere DC/OS is a distributed operating
system built around Apache Mesos. This utility provides tools
for easy management of a DC/OS installation.

Available DC/OS commands:

    auth               Authenticate to DC/OS cluster
    config             Manage the DC/OS configuration file
    experimental       Experimental commands. These commands are under development and are subject to change
    help               Display help information about DC/OS
    job                Deploy and manage jobs in DC/OS
    marathon           Deploy and manage applications to DC/OS
    node               Administer and manage DC/OS cluster nodes
    package            Install and manage DC/OS software packages
    service            Manage DC/OS services
    task               Manage DC/OS tasks

Get detailed command description with 'dcos <command> --help'.
```

OK. We will focus on command `dcos marathon app add <app-resource>`which help us deploy application to DC/OS

## Deploy a simple app

1. Create an app definition file named my-app.json with these contents

```javascript
{
    "id": "/nginx",
    "instances": 1,
    "cpus": 0.1,
    "mem": 64,
    "container": {
    "type": "DOCKER",
    "docker": {
          "image": "nginx",
          "network": "BRIDGE",
          "portMappings": [
            {"containerPort": 80}
          ]
        }
    }
}
```

**Note**
By default, applications will be deployed to `private node`, so if you want to deploy to `public node`, you can add `"acceptedResourceRoles": ["slave_public"]` to `my-app.json`

1. Add your app to Marathon:

```javascript
$ dcos marathon app add <my-app.json>
```


If this is added successfully, output will be something like this:

```javascript
Created deployment d562b50a-17b0-44ce-b7d2-02a0c3cc799e
```



1. Verify that the app is added with this command:

```javascript
$ dcos marathon app list
```


The output can be look like this:

```javascript
ID      MEM  CPUS  TASKS  HEALTH  DEPLOYMENT  CONTAINER  CMD
/nginx   64  0.1    0/1    ---      scale       DOCKER   None
```



1. Check application on DC/OS GUI

Click on `Services` tab, you will see list of applications that you are running. To check application’s information, just click on service and choose service ID that you want to see

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9683f34c-b18d-4370-a1d7-3488738709f7/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=bde1411dacb34ff2ca0998f4b283f60c569bd2da8f84407d6fe227be3d2dce01&X-Amz-SignedHeaders=host&x-id=GetObject)


As the picture above, you can check your application directly via `Endpoint`

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/cfdecb30-ebe1-46d5-98c5-c53d8af14c45/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=912c5250b6fc223b2ed2b6d02d832db342697b2f6344c7ba690023aff7ea53d2&X-Amz-SignedHeaders=host&x-id=GetObject)
