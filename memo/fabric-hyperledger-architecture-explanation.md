---
author: 
created_time: 2021-07-20
tags: blockchain, architecture
created: 2019-05-15
---

# What is Hyperledger

Hyperledger is an open source community focused on developing a suite of stable frameworks, tools and libraries for enterprise-grade blockchain deployments.

It serves as a neutral home for various distributed ledger frameworks including Hyperledger Fabric, Sawtooth, Indy, as well as tools like Hyperledger Caliper and libraries like Hyperledger Ursa.

## Key concept of Blockchain in Hyperledger

### A Distributed Ledger

Records all the transactions that take place on the network

Replicated across many network participants, each of whom collaborate in its maintenance

### Smart Contracts

Self-executing contract if match pre-defined rules

### Consensus

* Consensus problem( A fundamental problem in distributed-computing and multi-agent systems is to achieve overall system reliability in the presence of a number of faulty processes by agrees some data value that is needed during computation)
* Append value through transaction to network
* Update only when transactions are approved by the appropriate participants
* Update with the same order in any participants

## Hyperledger Fabric Models

### Assets

Asset definitions enable the exchange of almost anything with monetary value over the network as a collection of key-value pairs.

### Chaincode

Enforces the rules for defining, modifying  assets, it's the business logic. Execute against the ledger's current state database and initiated through a transaction proposal -> results in a set of key-value writes that can be submitted to the network and applied to the ledger on all peers.

### Ledger

Ledger is the sequenced, tamper-resistant record of all state transactions in the fabric. There is one ledger per channel, each peer maintains a copy of the ledger of their channels.

### Permissioned Vs Permissionless

**Similarities**

Both are unalterable digitally signed ledgers which are distributed through peer-to-peer network Both maintain ledgers which are updated through a protocol named as consensus. Both claim to maintain an immutable ledger

**Differences**

1. Permissioned

* Varying decentralization: members of the blockchain network are free to negotiate and come to a decision concerning the level of decentralization that the network will have
* Close: consortia members have the ability to restrict access. Not required to be transparent, members can choose to do so freely, depending on the inner organization of the businesses.
* Clean Governance structure: governance is decided by members of the business network. Decisions are made on a central level, where the entirety of the network must agree to a change

=> More control on the central level, more private -> use for B2B business models

2. Permissionless

* Decentralized: no central entity has the authority to edit the ledger, shut down the network or change protocols.
* Open: anyone can access, participate in the validation process
* Public: anything running is verifiable on the networks by everybody, running full nodes, store full history of all transactions
* Anonymity: members join the network as fully anonymous, networks don't need to recognize the member

→ Easier to join, widely access, globally accept  -> cryptocurrency

## Hyperledger Architecture

### Identity

The actors in a blockchain network(peers, orderers, client applications, administrators..) has a digital identity encapsulated in an X.509 digital certificate. - Properties of an actor's identity(organization, organizational unit, role..) wrap as Unique ID.

### PKIs (public key infrastructure)

Is a collection of internet technologies that provides secure communications in a network.

Base on the properties of a peer, cryptography constructing a pair of public and private key(prevent reading messages by third parties), Certificate Authority(CA) is an entity that issues this digital certificates, allows relying parties to rely upon signatures or on assertions made about the private key that corresponds to the certified public key. So that, any message passing to a peer can only be read by this peer.

**Root CAs**: CAs as root

**Intermediate CAs**: issued by root CA.

**Fabric CA**: is a private root CA provider capable of managing digital identities if Fabric participants.

**Certificate Revocation List(CRL)**: a list of references to certificates that a CA knows to be revoked.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0b71211a-c3d5-4e66-831b-fd98c8bb78ed/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=8de8255db425accd80311c1c0d450f467f46adac25c28c3b53f137d9d874caa9&X-Amz-SignedHeaders=host&x-id=GetObject)


### MSP (Membership Service Provider)

Identifies which Root CAs and Intermediate CAs are trusted to define the members of a trust domain. Also identify specific roles an actor might play either within the scope of the organization the MSP represents, defining access privileges in the context of a network and channel.

**Organizational Unit**: is a managed group of members(multinational corporation, flower shop) under a single MSP.

**Local MSPs**: hold Root CAs of an Organization, authenticate at organization level(communications between peer, node). Only one local MSP per node or peer.

**Channel MSPs**: hold Root CAs of connected Organization through channel to identify each other, there will be a local copy of channel MSP in each node or peer.

**MSP level**

* Network MSP: defines who are the members in the network by defining the MSPs of the participants organization.
* Channel MSP: provides private communications between a particular set of organizations.
* Peer MSP: is a local MSP provides private communications between peer belong to an Organization.
* Orderer MSP: is a local MSP, function like Peer MSP, only apply for node.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/dc2d26d9-4daf-462e-ab38-116306936114/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=762f37a3aa76c55c004cf7f9907fc541ac0b688b663beb2067b7fb5f855cc724&X-Amz-SignedHeaders=host&x-id=GetObject)


## Transaction Flow from Application

* Applications generate a transaction proposal
* Send it to required peers ( indicate by transaction it own )
* These peers the n become endorsing peers, then independently executes a chaincode -> proposal responses(difference peers can return different, inconsistent transaction responses, application is free to discard inconsistent transaction responses)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/96fedd91-d0cc-4926-a5a9-06f12f595811/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=f83320a0b1049d29b521d781fb02d133c8151ef69036d2c33511a645d96e732c&X-Amz-SignedHeaders=host&x-id=GetObject)

* Orderer receives transactions containing endorsed transaction proposal responses from many applications
* Orders each transaction relative to other transactions
* packages batches of transactions into blocks ready for distribution back to all peers connected to the orderer ( stop signal of packaging phase: block of the desired size or after a maximum elapsed time)
* Strict order: transactions can be packaged in any order into a block, and it’s this sequence that becomes the order of execution
* No ledger fork: Once transactions are captured in a block, history cannot be rewritten for that transaction at a future point in time.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/801f5cd1-a734-47ed-b9ef-741047538e0b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=ee7e47a2a69010f6d4644de2f86087b5e617d7dfd10562805f7dc5d5290d1dc5&X-Amz-SignedHeaders=host&x-id=GetObject)



* Each transaction after order sending to peers within a block is validated by each peer.
* Failed transactions are retained for audit, but are not applied to the ledger
* Every time a block is committed to a peer's ledger, that peer generates an appropriate event(include full block content)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/56053c62-ac43-47aa-be56-a8f92d627d53/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202421Z&X-Amz-Expires=3600&X-Amz-Signature=1f2dfec06532a90344178df35c4699bd7f228bbf2688a045854acb0626bd6352&X-Amz-SignedHeaders=host&x-id=GetObject)
