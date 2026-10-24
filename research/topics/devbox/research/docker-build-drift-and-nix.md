---
title: "Why Docker builds drift and how Nix pins them: unstable packages, shadow copies, nixpkgs and fixed hashes"
description: Why the same Dockerfile gives different images over time, and how Nix fixes it with pinned nixpkgs, fixed-output derivations and layered image builds.
slug: docker-build-drift-nix-reproducible-builds
kind: essay
date: 2024-08-01
authors:
  - baenv
tags:
  - devbox
  - docker
  - nix
redirect:
  - /research/topics/devbox/research/shadow-copies
  - /nMW5EA
  - /research/topics/devbox/research/unstable-package-installation
  - /uVFu9A
  - /research/topics/devbox/research/pinning-nixpkgs
  - /sUefhg
  - /research/topics/devbox/research/fixed-output-derivation
  - /lShD4w
  - /research/topics/devbox/research/nix-is-faster-than-docker-build
  - /CgQjYA
type: research
topic: platform-ops
---

Docker build is not deterministic. The same `Dockerfile` can give different images at different times, because a build has access to the public internet. This note covers the two problems that causes, how Nix answers them with pinned package sets and fixed hashes, and why a Nix-built Docker image builds faster. It is part of the research behind [why we use Devbox](../introduction/why-we-use-devbox.md).

## Two problems with Docker builds

### Unstable package installation

Take this `Dockerfile`:

```Dockerfile
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y python3
```

Say the first build installs Python 3.8.1. Today the latest Python is 3.9.1, and you build the image again. The two images differ even though the `Dockerfile` is the same. You cannot reproduce the environment your application ran in.

The obvious fix is to pin the version:

```Dockerfile
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y python3=3.8.10-0ubuntu1~20.04.1
```

Pinning lowers the instability and does not remove it, for three reasons:

- **Indirect dependencies.** You pin the main package. Its dependencies are out of your control and can change over time.
- **Unsupported packages.** Ubuntu repositories change. The build fails once a required package or version is removed.
- **Mirrors.** Ubuntu mirrors, the copies of the main repositories, change too. The build fails when the packages you need are no longer available.

Better solutions exist, and the note only names them here for reference: a local cache, a private registry and multistage builds.

### Shadow copies

Shadow copies are a second issue that comes from the same internet access. They are redundant files that stay behind after new versions of packages are installed. For example:

```Dockerfile
FROM ubuntu:20.04
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y some-package
```

A Docker build creates a separate layer for each `RUN` statement. In this file:

- The base layer is Ubuntu.
- The second layer holds every file that `apt-get upgrade` updated.
- The third layer holds the new packages.

The upgrade happens in the second layer and leaves the base layer alone. New versions of packages arrive without the old files that are no longer used being removed. The image grows for no reason. Multistage builds can also fix this.

The question is why we do not resolve all of these issues at the root cause.

## How Nix answers them

Nix knows the exact contents of packages and dependencies before a build. Two mechanisms make a build repeatable at any time.

### Pinning nixpkgs

Pinning nixpkgs means you choose the version of nixpkgs. All packages needed to build your application and its dependencies then come from that version, and each package version stays the same over time.

```nix
let
  nixpkgs = fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/20.09.tar.gz";
    sha256 = "1wg61h4gndm3vcprdcg7rc4s1v3jkm5xd7lw8r2f67w502y94gcy";
  };
  pkgs = import nixpkgs {};
in
```

Without a pinned version, Nix uses your local nixpkgs version by default.

### Fixed-output derivations

Nix builds on different machines with different nixpkgs versions produce different packages. A fixed-output derivation handles this. The result of a Nix build, called a derivation, is represented by a fixed hash. Any change on rebuild changes the hash. When the current hash and the new hash differ, the build fails.

You do not know the hash at the first build. Put in a made-up value, run the build, and read the right hash from the error message:

```bash
hash mismatch in fixed-output derivation '/nix/store/...':
  wanted: sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
  got:    sha256-ACTUALCORRECTHASHHEREXXXXXXXXXXXXXXXXXXXXX=
```

The mechanism does more than guard against a wrong global nixpkgs. It also checks that whatever the build downloads from the internet is the right file. Nix has mechanisms that reduce the risk of downloading from unreliable sources, and it controls everything the build downloads. The result is that a build can produce the same package at any time.

## Why a Nix build of a Docker image is faster

Nix knows the exact content of packages and dependencies before the build. It uses that to avoid building duplicate layers that have the same content but different instructions. It also uses content-addressable storage, and goes further:

- **An exact dependency tree.** Nix groups closely related packages and their dependencies into the same layer. Large files can go in a separate layer to maximize the cache. The result is fewer layers, used more effectively.
- **Layer order by changeability.** Nix evaluates how likely each package is to change, from its update history, its place in the dependency tree and its type. The least-changed layers sit at the bottom.
- **Links instead of copies.** Instead of copying the same files into different layers, Nix creates symlinks or hardlinks to share resources between layers. The image gets smaller and keeps its logical structure. Pull and push speed rises significantly, and when a dependency changes, only the reference links need an update.
- **No base image.** Nix creates Docker images from scratch. A normal Docker build needs an existing base image such as Ubuntu or Alpine.
- **No build-time tools in the image.** Building a Docker image in Nix means building the program into a Nix package, checking that it works, and turning it into an image. Build-time dependencies are not needed, so build tools and redundant libraries are easy to leave out.

## References

- _Understanding the image layers_. (n.d.). Docker Docs. Retrieved August 2, 2024, from <https://docs.docker.com/guides/docker-concepts/building-images/understanding-image-layers/>
- _Using the build cache._ (n.d.). Docker Docs. Retrieved August 2, 2024, from <https://docs.docker.com/guides/docker-concepts/building-images/using-the-build-cache/>
- _FAQ/Pinning Nixpkgs_. (n.d.). NixOS Wiki. Retrieved August 2, 2024, from <https://nixos.wiki/wiki/FAQ/Pinning_Nixpkgs>
- _Nix: what are fixed-output derivations and why use them?_ (2023, February 24). Brian McGee. Retrieved August 2, 2024, from <https://bmcgee.ie/posts/2023/02/nix-what-are-fixed-output-derivations-and-why-use-them/>
- _Advanced Attributes - Nix Reference Manual_. (n.d.). nix.dev. Retrieved August 2, 2024, from <https://nix.dev/manual/nix/2.18/language/advanced-attributes.html?highlight=outputHash>
- Wang, E. (2022, September 13). _Construction and analysis of the build and runtime dependency graph of nixpkgs_. Tweag. Retrieved August 2, 2024, from <https://www.tweag.io/blog/2022-09-13-nixpkgs-graph/>
- _What is the difference between a symbolic link and a hard link?_ (2008, October 9). Stack Overflow. Retrieved August 2, 2024, from <https://stackoverflow.com/questions/185899/what-is-the-difference-between-a-symbolic-link-and-a-hard-link>
- Rugyt, A. (2024, March 15). _Nix is a better Docker image builder than Docker's image builder_. Xe Iaso. Retrieved August 2, 2024, from <https://xeiaso.net/talks/2024/nix-docker-build/>
