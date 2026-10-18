---
title: "Solana basics: accounts, tokens and compressed NFTs"
description: How Solana stores data in accounts, how tokens and NFTs are built on the token program, and how Metaplex compression cuts the on-chain cost of NFTs.
slug: solana-basics
kind: reference
date: 2022-06-07
authors:
  - trankhacvy
tags:
  - solana
  - blockchain
  - token
  - nft
redirect:
  - /research/topics/solana/metaplex-nft-compression
  - /2wFHbg
  - /research/topics/solana/solana-account
  - /GqoGDA
  - /research/topics/solana/how-tokens-work-on-solana
  - /QXkUZw
---

Solana separates logic and data into two components: programs and accounts. Programs do not keep data in internal variables. They interact with external data stored in accounts, and they can mutate it. This note starts with the account model and its rules, then shows how tokens and NFTs sit on top of it, and ends with Metaplex compression, which brings the cost of NFTs down.

## Accounts

### Account model

There are 3 kinds of accounts:

- Data accounts store data (the kind you use the most).
  - System owned accounts.
  - PDA (Program Derived Address) accounts.
- Program accounts store executable programs.
- Native accounts indicate native programs on Solana, such as System, Stake and Vote.

Each account has an address (usually a public key) and an owner (the address of a program account). An account stores these fields:

| Field      | Description                                    |
| ---------- | ---------------------------------------------- |
| lamports   | The number of lamports owned by this account   |
| owner      | The program owner of this account              |
| executable | Whether this account can process instructions  |
| data       | The raw data byte array stored by this account |
| rent_epoch | The next epoch that this account will owe rent |

### Ownership rules

A few ownership rules matter:

- Only a data account's owner can modify its data and debit lamports.
- Anyone is allowed to credit lamports to a data account.
- The owner of an account may assign a new owner if the account's data is zeroed out.

Programs are special accounts marked as `executable`. Their entire purpose is to store the compiled code of the program, and program accounts do not store state.

For example, say you create a counter program that lets you increment a counter. You must create two accounts. Account A stores the program's code (`executable = true`). Account B stores the counter value. Account A must be the owner of account B.

![Example of a program account and the data account it owns](assets/solana-account_account_example.5b70d95a.jpeg.webp)

### Rent

- Storing data on accounts costs SOL to maintain. It is funded by what is called `rent`.
- An account is rent-exempt if it holds at least 2 years worth of rent. Currently, all new accounts are required to be rent-exempt.
- Use the `getMinimumBalanceForRentExemption` RPC endpoint to calculate the minimum balance for a particular account size.
- If the account does not have enough to pay rent, the account is deallocated and its data is removed.

## Tokens

This section explains tokens for EVM developers. Say you want to create a new type of fungible token, mint some to yourself, and then transfer some to your friend. What would you do?

On an EVM chain, you deploy a new ERC20 smart contract. On Solana, you do not create a new contract. A single token program, deployed by the Solana team, is responsible for creating, minting and transferring tokens.

### Mint account

To create a new token, you send the `create` instruction to the token program. This creates a new `mint account`. Each type of token is associated with exactly one `mint account`. The mint account holds metadata about the token, such as `total supply`, `decimals`, `mint authority` (who is allowed to mint) and `freeze authority` (who is allowed to freeze accounts).

![A mint account holding the metadata of one token type](assets/how-tokens-work-on-solana_vuocgc7h.png.webp)

### Token account

You have created a new token, but you do not own any of it yet. From the `mint account`, you create a `token account`. A `token account` stores how many tokens a particular user has, for a particular type of token.

![A token account created from a mint account](assets/how-tokens-work-on-solana_jrckbifh.webp)

### Minting and transferring

With a `mint account` and a `token account`, you can mint tokens. You send the `mint` instruction to the token program, which tells it how many tokens to mint and whom to mint them to. Only one user is allowed to mint a token of a particular type: the `mint authority` described above.

To transfer tokens, you send the `transfer` instruction to the token program, which tells it how many tokens to transfer and to whom. The recipient must also own a `token account` for the type of token you transfer.

![Transferring tokens between two token accounts](assets/how-tokens-work-on-solana_c2fz6whh.webp)

### NFTs

An NFT uses the same token program, with some differences in how it is created and minted. An NFT is just a token with a `total supply` of one and zero `decimals`. To create one, you create a `mint account` with zero decimals. Then you mint a single token and disable future minting, which ensures there will only ever be one.

In practice, most people use Candy Machine to create NFTs, which hides this complexity.

### Token name and symbol

To configure the name and symbol of your token, create a pull request to the [Solana Token Registry](https://github.com/solana-labs/token-list). Include a JSON file with your token metadata (chain id, address, symbol, logo, name and so on).

## Compressed NFTs

NFTs on Solana are growing in demand. People want these digital assets to be as commonplace as any other item on the internet: every item in a game's inventory, proof of engagement in popular consumer apps, even a personal profile for every human on Earth.

The rent for an NFT on Solana is cheap (◎0.012), but it scales linearly, so a large number of NFTs gets costly. Compression drastically reduces the cost of on-chain storage for NFTs, so creators can use the technology to express themselves. With compression, the cost of 10,000 NFTs drops to ◎3.5 (34x cheaper), 1 million NFTs to ◎5 (2,400x cheaper) and 1 billion NFTs to ◎500 (24,000x cheaper).

![Cost comparison of NFT storage with and without compression](assets/metaplex-nft-compression-cost-comparation.webp)

### How compression works

Compressed NFTs are stored in Merkle trees through the Gummyroll program:

- Roots of Merkle trees are stored and updated on-chain in a buffer held in a program account.
- Modifications to a tree (for example mint, transfer and delegate) are encoded in the Solana ledger.
- Off-chain indexers observe changes to the tree through the ledger. They cache NFT-related metadata, and serve the data and proofs that power dApps and smart contracts.

The Merkle root's on-chain buffer in the Gummyroll program lets multiple write requests to a single Merkle tree be processed simultaneously. Each update changes the root. Because of how Merkle trees work, the program keeps outdated update requests valid if they would have updated a prior version of the tree.

![Diagram of how compression for NFTs works](assets/metaplex-nft-compression-how-it-work.png)

### Ecosystem support

Compression for NFTs will have a significant impact on the Solana ecosystem, and Metaplex is working to make it real. Metaplex is collaborating with partners, including wallets and RPCs. Partners that already implemented solutions include Solflare for wallets, Crossmint for enterprise tools, and GenysysGo and Triton for RPCs. Phantom for wallets and Quicknode and Alchemy for RPCs were expected to launch their solutions soon.

This is a brief overview. There is much more to explore, from the technical side and from potential use cases. The technology marks a significant shift in how users, developers and businesses can approach NFTs on Solana.

## References

- https://docs.solana.com/developing/programming-model/accounts
- https://solanacookbook.com/core-concepts/accounts.html
- <https://spl.solana.com/token>
- <https://spl.solana.com/associated-token-account>
- <https://twitter.com/pencilflip/status/1454141877972779013>
- https://www.metaplex.com/posts/expanding-digital-assets-with-compression-for-nfts
- https://metaplex.notion.site/Compression-for-NFTs-Public-94f9faa25f034110b513414a11a85bbe
