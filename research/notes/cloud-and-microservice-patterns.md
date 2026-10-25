---
draft: true
title: Cloud and microservice patterns, notes on six distributed system patterns
description: Notes on Publisher-Subscriber, Saga, CQRS, Sharding, Circuit Breaker and Throttling, with the problem each solves, how it works, when to use it and what to watch for.
slug: cloud-and-microservice-patterns
kind: reference
announce: false
authors:
  - "neko-anon"
date: 2026-10-18
tags:
  - microservice
  - cloud-pattern
  - system-design
  - pattern
type: research
topic: architecture
---

Distributed systems fail in predictable ways: components need to talk without waiting on each other, data lives in several stores, load outgrows one database, and one broken service drags down the rest. These notes cover six patterns that answer those problems. Publisher-Subscriber handles messaging between components. Saga and CQRS handle data consistency and data access. Sharding scales the data store. Circuit Breaker and Throttling protect a system under failure and load.

_Merged and rewritten by neko-anon, the Dwarves editorial desk bot, from older notes in the research archive._

Source: the [Azure Architecture Center cloud design patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/) and [microservices.io](https://microservices.io/patterns/data/saga.html). The notes restate their ideas in shorter form, with extra remarks. Each section lists its own references.

## Messaging

### Publisher-Subscriber

#### Context

In cloud-based and distributed applications, components often need to tell other components about events as they happen. Asynchronous messaging is an effective way to decouple senders from consumers, because the sender does not block while it waits for a response.

#### Solution

Add an asynchronous messaging subsystem with these parts:

- An input messaging channel used by the sender. The sender packages events into messages in a known format and sends them through this channel.
- One output messaging channel per consumer. Consumers are called subscribers.
- A mechanism that copies each message from the input channel to the output channel of every subscriber interested in it. An intermediary such as a message broker or an event bus usually does this.

![Publisher-Subscriber diagram](../assets/pubsub.png)

#### Frameworks and libraries

- Redis, RabbitMQ, Kafka
- Cloud services: Azure (Service Bus, Event Bus, Event Grid), Google Cloud (Pub/Sub), AWS (Pub/Sub messaging)

#### When to use

- An application needs to broadcast information to a large number of consumers.
- An application can send information to consumers without needing real-time responses from them.
- An application needs to talk to one or more independently developed applications or services, which may use different platforms, programming languages and communication protocols.

#### Considerations

- Subscription handling: a consumer can subscribe and unsubscribe as needed.
- Security: only authenticated services may access the channels.
- Subsets of messages: a consumer can choose what to subscribe to through topic or content filtering.
- Wildcard subscribers: a consumer can use wildcards to subscribe and unsubscribe.
- Bi-directional communication: the pattern is one-way, with no two-way contact.
- Message ordering: the order in which consumer instances receive messages is not guaranteed and does not necessarily reflect the order they were sent in.
- Message priority.
- Poison messages: prevent messages with invalid data, or messages that could break the service.
- Repeated messages: the messaging infrastructure should detect and remove duplicates.
- Message expiration.
- Message scheduling.

References:

- https://docs.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber
- https://hackernoon.com/publish-subscribe-design-pattern-introduction-to-scalable-messaging-781k3tae

## Data consistency and access

### Saga

The saga pattern manages data consistency across microservices in distributed transaction scenarios.

#### Context

You applied the Database per Service pattern, so each service owns its database. Some business transactions still span several services, so you need a mechanism for transactions that cross services.

For example, you build an e-commerce store where customers have a credit limit. The application must make sure a new order does not exceed the customer's credit limit. Orders and Customers sit in different databases owned by different services, so the application cannot use a local ACID transaction.

#### Solution

Implement each business transaction that spans services as a saga. A saga is a sequence of local transactions. Each local transaction updates its database and publishes a message or event that triggers the next local transaction in the saga. If a local transaction fails because it breaks a business rule, the saga runs a series of compensating transactions that undo the changes made by the earlier local transactions.

There are two ways to coordinate sagas:

- Choreography: each local transaction publishes domain events that trigger local transactions in other services.
- Orchestration: an orchestrator (an object) tells the participants which local transactions to run.

![From two-phase commit to saga](../assets/From_2PC_To_Saga.png)

#### Resulting context

- Benefit: the application keeps data consistent across multiple services without distributed transactions.
- Drawback: the programming model is more complex.

#### When to use

- You need data consistency in a distributed system without tight coupling.
- You need to roll back or compensate if one operation in the sequence fails.

References:

- https://microservices.io/patterns/data/saga.html
- https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga
- https://blog.couchbase.com/saga-pattern-implement-business-transactions-using-microservices-part/

### Command query responsibility segregation (CQRS)

CQRS separates read and update operations for a data store.

#### Why

- Large systems with heavy database load see a huge number of reads and writes. That can hurt performance and data consistency.
- Traditional architectures use the same data model to query and update a database. That is simple and works well for basic CRUD, but it becomes unwieldy in more complex applications.
- Reads and writes are often asymmetrical.

#### How

CQRS uses separate models for reads and writes. Commands update data and queries read it.

- Commands should be task-based, not data-centric. "Book hotel room" is a command, "set ReservationStatus to Reserved" is not.
- Commands may go on a queue for asynchronous processing instead of running synchronously.
- Queries never modify the database. A query returns a DTO that holds no domain knowledge.

For greater isolation, you can physically separate the read data from the write data. Then the read database can have its own schema, optimized for queries. The read store can be a read-only replica of the write store, or the two stores can have entirely different structures.

#### Benefits

- Independent scaling: reads and writes scale separately, and there may be fewer lock contentions.
- Optimized data schemas: the read side uses a schema built for queries, and the write side uses one built for updates.
- Security: it is easier to make sure only the right domain entities write data.
- Separation of concerns.
- Simpler queries.

#### Considerations

- Complexity.
- Messaging.
- Eventual consistency: the read and write databases need to be kept consistent.

References:

- https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs
- https://martinfowler.com/bliki/CQRS.html

## Scaling data

### Sharding

Sharding is an advanced pattern for scaling data horizontally.

#### Context

A centralized database can run into several limits:

- Storage space: a huge volume of data that may grow significantly over time.
- Computing resources: the number of concurrent users can overwhelm a single database.
- Network bandwidth.
- Geography: laws sometimes require data to stay in the country, for example in Vietnam or China.

Vertical scaling is only a temporary solution for a big system.

#### Solution

Divide the data store into horizontal partitions, called shards. Each shard has the same schema but holds its own distinct subset of the data. A shard is a data store in its own right: it can hold data for many entity types and runs on a server that acts as a storage node. In table terms, the rows of one table are split into several partitions. Each partition has the same schema and columns but entirely different rows.

Benefits:

- Horizontal scaling: scaling means adding more shards, and it does not need very strong hardware.
- Less contention and better performance through load balancing across shards.
- In the cloud, shards can sit physically close to users.

Every shard should use the same data-dividing algorithm. Where a piece of data goes should depend on one or more attributes of the data. Those attributes should be static and should not depend on data that might change.

When an application accesses data, the sharding logic should direct it to the right shards. Sharding is often implemented at the application level: the application includes code that decides which shard receives reads and writes. Some database management systems have built-in sharding, so you can implement it at the database level instead.

![Database sharding diagram](../assets/DB_image_1_cropped.png)

#### Sharding strategies

- Lookup strategy: you create and maintain a lookup table that uses a shard key to track which shard holds which data. A lookup table holds a static set of information about where specific data lives. For example, data with region code 1 (Asia) is stored in Asia's shard.
- Range strategy: you shard data by ranges of a given value. Say a database stores a retailer's whole product catalog. You could create a few shards and divide each product's information by the price range it falls into.
- Hash strategy: you take a value from newly written data, such as a customer's ID number, a client application's IP address or a ZIP code, and run it through a hash function to decide which shard the data goes to.

Each strategy suits specific requirements, so choose carefully based on business and system logic.

#### When to shard

- The amount of data would exceed the storage capacity of a single database node. Ethereum is an example.
- The volume of reads or writes goes beyond what one node or its read replicas can handle, which causes slow responses or timeouts.
- The required bandwidth outpaces what a single node can offer.

In very large systems, sharding is the right call.

#### Considerations

- Huge complexity.
- Unbalanced shards.
- No way back: once you shard, it is very hard to return.
- Not every database engine supports it natively.

References:

- https://www.digitalocean.com/community/tutorials/understanding-database-sharding
- https://docs.microsoft.com/en-us/azure/architecture/patterns/sharding

## Resilience and load control

### Circuit breaker

#### Context

In a distributed environment, faults can come from unanticipated events and take much longer to fix, which can end in the complete failure of a service. Then it is pointless for an application to keep retrying an operation that is unlikely to succeed. The application should quickly accept that the operation failed and handle the failure.

A failed service can also hurt other services through delay, lower performance and a worse user experience.

#### Solution

A circuit breaker acts as a proxy for operations that might fail. The proxy watches the number of recent failures and uses it to decide whether to let the operation proceed or to return an exception immediately.

The proxy has three states:

- Closed: requests from the application go through to the operation. The proxy counts recent failures. If the count passes a threshold, it sets the state to Open.
- Open: requests or messages from the application fail immediately and an exception is returned. A timeout starts, and when the timer expires the state becomes Half-Open.
- Half-Open: a limited number of requests go to the service. If they succeed, the service seems healthy and the state returns to Closed.

#### Considerations

- Exception handling
- Logging
- Recoverability
- Testing failed operations
- Manual override

References:

- https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
- https://martinfowler.com/bliki/CircuitBreaker.html

### Throttling

Throttling controls the consumption of resources used by an application instance, an individual tenant or an entire service.

#### Context

- The load on a cloud application usually varies over time with the number of active users and the kind of activity they perform.
- Sometimes a huge number of requests exceeds the system's capacity, which causes poor performance or even failure.

#### Solution

When autoscaling is not suitable, the alternative is to let applications use resources only up to a limit and throttle them once they reach it. Options:

- Reject requests from an individual user who has accessed the system APIs more than n times per second over a given period.
- Disable or degrade selected nonessential services so essential ones run unimpeded with enough resources. For example, an application streaming video could switch to a lower resolution.
- Use load leveling to smooth the volume of activity, together with the Priority Queue pattern. The Queue-based Load Leveling pattern covers this in detail.
- Defer operations performed on behalf of lower-priority applications or tenants.

![Throttling pattern diagram](../assets/Pattern_Throttling.png)

#### Considerations

- Throttling affects the whole system, so consider it early in system design.
- Throttling must happen quickly.
- When a service temporarily denies a request, it should return a specific error code so the client application understands why.
- Throttling can serve as a temporary measure while a system autoscales.
- If the system still cannot operate after throttling, scale it up for more capacity.

#### When to use

- To make sure a system keeps meeting its service level agreements.
- To stop a single tenant from monopolizing the resources of an application.
- To handle bursts in activity.
- To optimize cost.

References:

- https://docs.microsoft.com/en-us/azure/architecture/patterns/throttling
- https://docs.firstdecode.com/microservices-architecture-style/design-patterns-for-microservices/throttling-pattern/
