---
title: "DeFi, DApps and DAOs: definitions, components and uses"
description: What DeFi is and the two criteria that define it, how a DApp is built from smart contracts, a frontend and off-chain storage, and how DAOs organize people without a central authority.
slug: defi-dapps-daos
kind: reference
announce: false
draft: true
date: 2026-08-27
authors: []
credit: a16z crypto, Mastering Ethereum and d-core.net
tags:
  - blockchain
  - defi
  - dapp
redirect: []
type: research
topic: digital-assets
---

DeFi, DApps and DAOs describe three layers of the same idea. DeFi is the set of financial services that run on blockchains. DApps are the applications those services are built as. DAOs are the organizations that govern them without a central authority. This note defines each one, then covers how a DApp is put together and where DAOs are used.

## DeFi

### Definition

DeFi is an ecosystem of financial services built on blockchain technologies, typically using [[Smart Contract]]. It consists of applications and peer-to-peer protocols developed on decentralized blockchain networks. These require no access rights for easy lending, borrowing or trading of financial tools.

### Three waves of innovation

DeFi is built from 3 waves of blockchain innovation:

1. 2009, starting with Bitcoin, brought the distributed ledger (blockchain). It enabled peer-to-peer (P2P) transfer and a non-sovereign digital asset.
2. Ethereum, defined by its native language Solidity, can build any kind of application. It makes the network a supercomputer open to anyone.
3. The coin boom of 2017 marked the sponsorship of a series of DApps, which led to a decentralized financial ecosystem.

The 4th wave is DeFi, which combines the 3 waves above.

### Two criteria

- **Permissionless**: it serves anyone, regardless of faction, with no central authority.
- **Transparency**: all documents can be inspected and reviewed because they are open source. Every transaction is recorded on a blockchain, which makes data available for investment research or investigation.

Adapted from [Decentralized Finance: What It Is, Why It Matters](https://a16zcrypto.com/posts/article/what-is-decentralized-finance/), a16z crypto (also at [future.a16z.com](https://future.a16z.com/cryptos-fourth-wave-defi-poised-for-breakthrough/)).

## DApps

![The Web3 suite of components that make up a DApp](https://github.com/ethereumbook/ethereumbook/raw/develop/images/web3suite.png)

### What is a DApp

A DApp is an application that is **mostly** or **entirely** decentralized. These aspects of an application may be decentralized:

- Backend
- Frontend
- Data storage
- Message communications
- Name resolution

### Advantages

- **Resilience**: a DApp has no downtime and stays available as long as the platform is still operating.
- **Transparency**: everyone can inspect the code. Every interaction with the DApp is stored forever on the blockchain.
- **Censorship resistance**: no service provider, not even the owner of the smart contract, can alter the code once it is deployed on the network.

### Components

#### Backend (smart contract)

- You can think of a smart contract as replacing the server-side component (the "backend") of a regular application.
- Any computation executed in a smart contract is very expensive, so keep it as small as possible.
- Smart contracts on the network can call each other and pass data between them, reading and writing their own state variables as they go. Their complexity is restricted only by the block gas limit.
- A key constraint in smart contract design is that you cannot change the code of a smart contract once it is deployed.
- _Check gas cost here: [gas cost](https://github.com/djrtwo/evm-opcode-gas-costs/blob/master/opcode-gas-costs_EIP-150_revision-1e18248_2017-04-12.csv)_

#### Frontend

- The client-side interface of a DApp can use standard web technologies (HTML, CSS, JavaScript and so on), and can be mobile as well.
- It links to Ethereum through the _web3.js_ JavaScript library, which is bundled with the frontend resources and served to a browser by a web server.

#### Data storage

- Because of high gas costs and the currently low block gas limit, smart contracts are not well suited to storing or processing large amounts of data.
- Most DApps use **off-chain** data storage services. They store the bulky data off the Ethereum chain, on a data storage platform.
- The storage platform can be centralized (a cloud database) or decentralized, stored on P2P platforms (IPFS, Swarm).

#### IPFS

- The _Inter-Planetary File System_ (IPFS) is a decentralized, content-addressable storage system that distributes stored objects among peers in a P2P network.
- "Content addressable" means each piece of content (file) is hashed, and the hash identifies that file. You can then retrieve any file from any IPFS node by requesting it by its hash.

Adapted from [Mastering Ethereum, chapter 12 (DApps)](https://github.com/ethereumbook/ethereumbook/blob/develop/12dapps.asciidoc).

## DAOs

### Decentralized autonomous organization

Usually an organization has a person who makes decisions on its behalf. Administrators represent shareholders, and politicians represent citizens. In such organizations there is often a moral hazard, when the rights sit with a person who puts personal interests above the common good.

In a traditional organization, the relationship between the organization and an individual rests on an agreement (law, paperwork, tacit agreement). The rights and obligations of each party are regulated and enforced by a third party or an individual.

A DAO is an organization of a group of people interacting according to a self-enforcing, open-source protocol. Keeping the network secure and performing on other networks earns you tokens of that network. The members of a DAO are not bound to each other by a single legal entity. Smart contracts govern them instead.

### How a DAO works

- A group of people operates the program (based on a smart contract).
- Next comes the stage of raising capital by buying shares, also known as an ICO (Initial Coin Offering).
- Once there are enough funds, the DAO is put into operation.
- Participants who buy shares have the right to vote on decisions made with the DAO.
- The DAO is not owned by anyone. It is a piece of software that runs on top of the Ethereum system. People who contribute shares to the DAO can vote on decisions, but they do not own the DAO.

### Public interest

- From 2020 to 2021, along with the development of DeFi, DAOs began to be mentioned more.
- At the time of writing, no country recognized DAOs, and there were no clear legal regulations. DAOs were still widely used in the DeFi market, and were recognized in places of legal autonomy (for example [Wyoming in USA](https://www.cryptopolitan.com/wyoming-recognizes-eos-based-dao/)).

### What DAOs are used for

- Aggregating resources to buy and sell expensive NFT artworks for profit.
- Funding blockchain public goods that are necessary but have no business model behind them, with votes issued as donations and donations matched by a pool.
- Basic crowdfunding that runs on blockchain without a business model, with votes issued as donations and donations combined by a team. Providing policy options on DeFi protocols.
- Accepting and rejecting members who want to join the organization, and making decisions in the organization.
- Creating talent and non-hierarchical organizations.
- Buying and selling digital assets, such as tokenized real estate or cryptocurrency.

### Is the world moving towards a DAO model

- The legal system began to monitor DAOs closely.
- DAO pioneers argue that DAOs can replace paper organizations, even governments. Whether or not governments soon run countries on-chain, many use cases suggest that combining DAOs with other blockchain-based options will make them more popular. As on-chain solutions and DApps evolve, so will the accessibility and utility of DAOs.

Adapted from [d-core.net](https://d-core.net/decetranlized-autonomous-organizations-explained/).
