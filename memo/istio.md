---
author: 
created_time: 2021-07-20
tags: tool
created: 2019-06-09
---

Istio is an implementation of the Service mesh architecture, which is a network of microservices that interactive with each other to form an application. Besides Istio, there are several concept applying service mesh architecture such as Linkerd, Consul.

# Service mesh vs API gateway

Service mesh has been really a hot term recently, comparing to another microservice architecture, **API gateway**, which is considered simpler and a more mature solution. Therefore before digging into Istio, it is necessary to have a comparison between Service mesh and API gateway, to find out the pros/cons and the use case of each architecture, thus have a better overview for Istio.

## API gateway

The key objective API Gateway is to expose microservices as managed API. API Gateways comes with a number of powerful features such as load balancing, health checks, API versioning and routing, authentication & authorization, data transformation, analytics, logging, SSL termination, etc. Kong, Ambassador is two of successful open source API gateways.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ef4b9120-9f57-4d11-a1ee-79d2bac9b9a8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=3291ad3b062f5f5fa74c7a2e373a23437ed5d3fd2faca6f18c780806f7e52083&X-Amz-SignedHeaders=host&x-id=GetObject)

**Pros**

* Microservices can focus on business logic
* Authentication, logging, and monitoring can be handled by the API Gateway
* Flexibility to use completely independent protocols in which clients and microservice can talk
* Can handle failures/retries

**Cons**

* API Gateways are fairly centralized, so it could be a single point of failure if it is not well managed and scaled.
* Although they can be scalable, they still require a single point to register new APIs or change configuration
* From an organizational perspective, they are likely to be maintained by a single team

### **Service Mesh**

Unlike API Gateways, Service meshes are focus on decentralized and self-organizing networks between microservices. that handle load balancing, service discovery, health checks, monitoring, and tracing. The mesh work by attaching small agents container, also known as "sidecar" alongside with every instance that manipulate the inbound/outbound traffic and handles instance registration, metric collection, and tracing. Istio, Linkerd are the most known service meshes.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d51e87e8-1852-4c10-b124-2c55e5c48ee3/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=c00c159cd9aae3b2cb59f14741dfc8de18b2daa4acf9656df9964c798bd1dde3&X-Amz-SignedHeaders=host&x-id=GetObject)


**Pros**

* Because of the decentralization, service mesh entities handle their own traffic without being gathered at a single point.
* Service meshes are more dynamic and can easily shift shape and accommodate new functionalities and endpoints.
* Their decentralized nature makes it easier to work on microservices for development teams
* Resilience, failure/retry handling is as power as API gateway

**Cons**

* Service meshes is complex and require quite lot of resource.
* It requires the deployment of a separate traffic manager, a telemetry gatherer, a certificate manager and a sidecar process for each instance.
* They are still young, and need a lot more of development to be fully ready for a production grade microservice network.

# A nutshell

It’s easy to see that both API Gateway and Service mesh have the strength that each other misses, so many developers agree that the best practice for microservices network are combining both of them. Istio is the very first pioneer in this approach, making it the worthiest architecture in the world, that’s why it is backed by many engineers from tech giants like Google, IBM and Redhat.

# What leads to Istio

Let's begin with Kubernetes - the famous container orchestration platforms To make a microservices network, k8s basically run these 3 entities:

* Pod - a group of one or more containers, with shared storage/network
* Deployment - manages pod definition and defines replicas of pods
* Service - an abstraction, an access point to a set of Pods

So we have the microservices the Kubernetes way:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/99043530-c763-4b7a-99e3-3311d05d5c31/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=af6ba2aae42946d18bfe83f802bf37e7b7989210bb890c6e55433fe95af4be52&X-Amz-SignedHeaders=host&x-id=GetObject)


What if  I found microservices grow up like this?

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6da149d9-eaad-49d1-9a9e-13b303886b26/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=8076290b7cabfa7433c5db5cbbcb8a9194bf0df8ba882d7ef2e02518b8b91224&X-Amz-SignedHeaders=host&x-id=GetObject)


Definitely it will become a multiple points of failure. This is where the savior Service Mesh come in, and Istio can solve the problem. Istio injects a sidecar in every pod in the network:


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d5f400be-6f7e-4612-8aef-e6d08e9f08b4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=c12f3507ed7e344119efde54150f2684a98a0d3d725ac1fe05ef73ac7e810efd&X-Amz-SignedHeaders=host&x-id=GetObject)


So instead of continuously writing code for the routing, the circuit breaker or every networking stuff, we can focus on the business logic of each application in the network.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/521c00aa-0af5-4e75-8f4c-fa243f5e6516/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=7e9f1c08ea6c0ee8d17c1aec859650341609ebb0ecb6d36be4c7956af80be8c6&X-Amz-SignedHeaders=host&x-id=GetObject)


Our system's network now becomes more under controlled:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/920df72c-b847-4662-8f11-2fcf682526d2/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=ecde569de8f7c5fb1cb57cf488b6d229820f4da5f43cc7328573238c1d9ccacb&X-Amz-SignedHeaders=host&x-id=GetObject)

# Istio Architecture

## Envoy

Istio utilizes an expanded Envoy proxy version which is a high-performance proxy built in C++ for all facilities in the service mesh to mediate all inbound and outbound traffic of the entire mesh network. Istio leverages many integrated characteristics of Envoy, making it the core component in establishing service meshes, such as:

* Dynamic service discovery
* Load balancing
* TLS termination
* HTTP/2 and gRPC proxies
* Circuit breakers
* Health checks
* Staged rollouts with percentage based traffic split
* Fault injection
* Rich metrics

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b44f1f1c-7710-4bc1-bf3e-9c08512ae004/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=ed600014d73b419f9440a6d608a1111157c551068e907678a442fc9ff7b4b9b3&X-Amz-SignedHeaders=host&x-id=GetObject)

Envoy is deployed along side with every Kubernetes pods as a sidecar to the appropriate proxy. This deployment allows Istio to extract information about traffic behavior as attributes. Istio can, in turn, use these attributes in Mixer to enforce policy decisions, and send them to monitoring systems to provide information about the behavior of the entire mesh.

## Pilot

Pilot provides service discovery for the Envoy sidecars, traffic management capabilities for intelligent routing (e.g., A/B tests, canary rollouts, etc.), and resiliency (timeouts, retries, circuit breakers, etc.).

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0322d2f2-4fbe-43b8-b28d-95426ef32301/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=31efe9649e281b11d18d1657ae310e6b6ae0df8e0a28dc0dc52e8bd06e2ff8d0&X-Amz-SignedHeaders=host&x-id=GetObject)

Pilot transforms high-level scheduling rules into Envoy-specific settings that regulate the traffic and propagates them in real time to the sidecars. Pilot summarizes and synthesizes platform-specific service discovery processes (Kubernetes, Consul, etc) into a normal file that can be consumed by any sidecar compliant with the APIs of the Envoy data plane. This loose coupling allows Istio to run on multiple environments while maintaining the same operator interface for traffic management.

## Mixer

Mixer enforces access control and utilization strategies across the system mesh and gathers information from the Envoy Proxy and other facilities for telemetry. In another word, Mixer is the monitoring agent of Istio network.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e1e091fa-d16f-48ca-a057-326c18b45fc8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=25b8560cbb83a1d162f3b6afd2263ef8b9397ec2890ef791e41c60dfa4d17aa8&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/331b9741-e60f-44a2-8aa8-9cddff793d48/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=bbe1f1bff3385be415382d3a52f7966274a1236887991be28ef5462f2e6a0c26&X-Amz-SignedHeaders=host&x-id=GetObject)


Mixer involves a versatile plugin system. It allows Istio to interact with multiple backend infrastructures. Istio therefore extracts from these information of the Envoy Proxy and Istio-managed facilities.

## Citadel

Citadel enables strong service-to-service and end-user authentication with built-in identity and credential management. Citadel can be used to upgrade unencrypted traffic in the service mesh.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bcc08093-ae89-4119-8bcb-7ddcd87fb369/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202413Z&X-Amz-Expires=3600&X-Amz-Signature=d7b41375d084b147d471fa582b183d9fb8d5f3a7502453d5232a472992872f47&X-Amz-SignedHeaders=host&x-id=GetObject)

##  Galley

Galley is Istio’s configuration validation, ingestion, processing and distribution component. It is responsible for insulating the rest of the Istio components from the details of obtaining user configuration from the underlying platform (e.g. Kubernetes).

# References

* Book: Istio In Action - Christian Posta
* Istio docs: [https://istio.io/docs/concepts/what-is-istio/](https://istio.io/docs/concepts/what-is-istio/)
* [https://medium.com/microservices-in-practice/service-mesh-vs-api-gateway-a6d814b9bf56](https://medium.com/microservices-in-practice/service-mesh-vs-api-gateway-a6d814b9bf56)