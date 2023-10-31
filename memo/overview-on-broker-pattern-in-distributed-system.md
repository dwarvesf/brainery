---
author: 
created_time: 2021-07-20
tags: distributed
created: 2019-08-24
---

# Definition

The broker pattern is an architectural pattern that can be used to structure distributed software systems with decoupled components that interact by remote procedure calls. A broker component is responsible for coordinating communication, such as forwarding requests, as well as for transmitting results and exceptions.

# Component

1. Clients: implements user functionality, send requests to server through a client-side proxy
1. Server: Implements services, registers itself with the local broker, send responses and exceptions back the client through a server-side proxy
1. Broker(a messenger that is responsible for the transmission of requests from clients to servers): registers server, offers interface(APIs, ...), transfer messages, error recovery, interoperates with other brokers through bridges, locates servers
1. Client-side proxy(a layer between clients and the broker): encapsulates system-specific functionality, mediates between the client and the broker
1. Server-side proxy: calls services within the server, encapsulates system-specific functionality, mediates between server and the broker
1. Bridge( responsible for communication among brokers): encapsulates network-specific functionality, mediates between the local broker and the bridge of a remote broker

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c04d58b6-9d74-4181-8062-7db4f7eb76ae/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202411Z&X-Amz-Expires=3600&X-Amz-Signature=fe5c735b17a383e6be4fc380c5cf75941df68aac31194b1966882dda449d2729&X-Amz-SignedHeaders=host&x-id=GetObject)

# The role of Broker Patter

* Our system need to be dynamically removing or adding new agent(server, client)
* The agents in our system need the ability to be independent of each other( scalable, partition functionality into independent agents)

# The ability of Broker Pattern

In the decoupled behavior, Broker acts like an interface, when a new server was adding on the system, it just like add a new object, and the only thing we need to do is to register the new server with Broker.

Based on the idea of the independent agent(server, client), Broker pattern give us free control to individual agents(it doesn't care about what we do with agents). Thus, the agent freely from scaling itself has its functionality
