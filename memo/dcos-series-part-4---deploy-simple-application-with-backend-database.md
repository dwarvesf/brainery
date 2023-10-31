---
author: 
created_time: 2021-07-21
tags: dcos
created: 2017-06-10
---



## Create an Application with Golang

First of all, we will go with `Golang` because `Go` is easy to implement backend server and deploy in 1 min. So we will have a few code to initialize `todolist` application that provide `GET` tasks.


```plain_text
func main() {
    // connect DB
    db, err := gorm.Open("postgres",
        fmt.Sprintf("user=%v password=%v host=%v dbname=%v sslmode=disable",
            os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOST"), os.Getenv("DB_NAME")))
    if err != nil {
        panic(fmt.Sprintf("Failed to open sql connection: %v", err.Error()))
    }
    db.LogMode(true)
    db.AutoMigrate(models.Task{})

    // we will seed some data
    tasks := []string{"get a coffee cup", "write blog"}
    for _, v := range tasks {
        db.Create(&models.Task{Name: v})
    }

    // init API server
    r := gin.Default()
    r.GET("/tasks", func(c *gin.Context) {
        var data []models.Task
        err := db.Offset(0).Limit(10).Find(&data).Error
        if err != nil {
            c.JSON(http.StatusInternalServerError, err.Error())
        }
        c.JSON(200, gin.H{
            "data": data,
        })
    })
    r.Run()
}
```

Above code allow us easy to customize configuration of database connection. When we deploy application, we just need to change these settings below which are environment variables:

* DB_USER
* DB_PASSWORD
* DB_HOST
* DB_NAME

After that, We need to do some stuffs to dockerize application and push it to docker hub or private docker registry. To do that, let’s create a Dockerfile first:


```plain_text
FROM alpine:3.4

RUN apk add --no-cache ca-certificates

ENV GOPATH /go
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_HOST=localhost
ENV DB_NAME=todolist

WORKDIR /go/src/todolist/backend
ADD main /go/src/todolist/backend

CMD ["/go/src/todolist/backend/main"]
```

Following to these steps, you will be able to build and push your image to docker hub:


```plain_text
// this will help us to run app in image alpine
$ CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

// build image and push it to docker hub
$ docker build -t <namespace>/todolist .
$ docker push <namespace>/todolist
```

## #=Setting up database on DC/OS

Let’s go to our DC/OS and create a `postgres` service

Go to DC/OS and choose package tab, then find `postgres`:

![](https://res.cloudinary.com/dwf/image/upload/q_100/v1575366904/Websites/Blog/20171006-dcos-part-4-postgres-1_ctatpp.jpg)


Customize your configuration after click `Advance setting` from pop-up page:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6dc8b52e-069b-4c1c-97bf-45ae1f30fa0b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=75c1257e0f7b182f7b6fe2e5f12863061c91cfedae3e46b3854d0ec784a0168b&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/30087bc3-bf76-44f0-ac22-16a7303be21b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=4396e29b002db7363e7e7ece4de6521eb16ab146538182341cade089c7435d10&X-Amz-SignedHeaders=host&x-id=GetObject)


Finally, you need to wait a few minutes and get the result like this:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/43afee0e-b90c-428e-976a-8e9ae9d99ce9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=6a3d9e4d5eabda4f9955ee3cf1f5bdfe7df8d4663d5dc6681592a7111e4c45e4&X-Amz-SignedHeaders=host&x-id=GetObject)


You also need to config more a little bit to be able to backup data:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b939f3f5-d346-4b2c-aaf3-f3112a497047/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=2956c227e7040d5bf85497cb7621ae85c49a4957701811506dfa6882dec6e5ee&X-Amz-SignedHeaders=host&x-id=GetObject)


A very important thing is sharing volumes. You will need to set a specific node with public IP to make sure if service restart, it will only be deployed to a node that you have specified before. There are 2 things need to be config:

1. Set a specific node in `Service` tab:

![](https://res.cloudinary.com/dwf/image/upload/q_100/v1575367411/Websites/Blog/20171006-dcos-part-4-postgres-6_kbkyak.jpg)



1. Share volumes

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c606feb7-1278-49d2-a6ef-1c9c53a28d20/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=84b0043783cc992245e73469465b9130df6f5cf2b2b1e71d0bba12f9038458e0&X-Amz-SignedHeaders=host&x-id=GetObject)

For me, I usually share volumes inside container to `/srv` in node: `/srv/todolist/postgresql:/var/lib/postgresql/data`

Then, you also need to enable `LOAD BALANCED SERVICE ADDRESS`, it will allow your application connect to `postgres`

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2220dad6-3f35-40d3-ab37-35809aecc1ee/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=5824fe1103c8e67f6c98dfd4dea195abdb3e3c0f952fd172b1a761914245f61a&X-Amz-SignedHeaders=host&x-id=GetObject)

After all, click `REVIEW & RUN` to change setting

## Deploy application

As usual, we will need file `marathon.json` to define app and deploy:

You also need to replace your configuration `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`


```plain_text
{
  "id": "/todolist/backend",
  "cpus": 0.5,
  "mem": 512,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "docker": {
      "image": "<namespace>/todolist",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 8080
        }
      ],
      "forcePullImage": true
    }
  },
  "env": {
    "PORT": "8080",
    "DB_HOST": "todolistpostgresql.marathon.l4lb.thisdcos.directory",
    "DB_USER": "postgres",
    "DB_PASSWORD": "password!",
    "DB_NAME": "todolist",
    "BUILD_ID": "123"
  },
  "healthChecks": [
    {
      "portIndex": 0,
      "protocol": "TCP",
      "gracePeriodSeconds": 300,
      "intervalSeconds": 60,
      "timeoutSeconds": 20,
      "maxConsecutiveFailures": 0
    }
  ],
  "labels": {
    "HAPROXY_GROUP": "external",
    "HAPROXY_0_VHOST": "todolist.yourdomain.com"
  }
}
```

OK, we can deploy now !


```plain_text
$ dcos marathon app add marathon.json
```

As my expectation, it will be like this:

![](https://res.cloudinary.com/dwf/image/upload/q_100/v1575367579/Websites/Blog/20171006-dcos-part-4-postgres-9_quq2sq.jpg)


Everything is available now. Let’s check it:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a9a6b847-322c-45e3-89fd-e4d3a54bba7a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202400Z&X-Amz-Expires=3600&X-Amz-Signature=0e24d932adf5754744885602b6c1f36adc584869c1350c64311bdb025af38c28&X-Amz-SignedHeaders=host&x-id=GetObject)
