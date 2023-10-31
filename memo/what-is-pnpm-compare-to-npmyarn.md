---
author: 
created_time: 2023-04-11
tags: engineering, web
created: 2023-04-11
---

<!-- table_of_contents 90121e99-78c1-42f9-93e8-067cc9d793c4 -->

## What is PNPM?

![](https://res.cloudinary.com/practicaldev/image/fetch/s--5LB7xZGh--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o8e2at4huuuv08y24jvg.png)

*At Dwarves Foundation, we are always on the lookout for new tech. Researching PNPM was originally from research on what package manager **[Next.js](https://github.com/vercel/next.js/)** uses. We then tried to experiment with it for **[dwarves/react-toolkit](https://github.com/dwarvesf/react-toolkit/pull/46)**, which has given us some insights into some of the cost-benefits of using the package manager.*

## Introduction

PNPM is a package manager for Node.js which stands for “Performant NPM”. It was introduced in 2016, the same year Yarn was released. PNPM is a fast, disk space efficient package manager that supports monorepos. It creates a non-flat `node_modules` by default, so code has no access to arbitrary packages. PNPM performs installation in three stages: 

1. **Dependency resolution **- The package manager identifies and fetches all required dependencies to the store.
1. **Directory structure calculation** - Based on these dependencies, it calculates the layout of the `node_modules` directory.
1. **Linking dependencies** - it retrieves and establishes hard links from the store to `node_modules` for all remaining dependencies.

## Advantages of PNPM

PNPM is a very performant alternative to most package managers. Here are a few advantages of using PNPM:

* Saves disk space by using a content-addressable store for packages
* Boosts installation speed with a three-stage process
* Creates a non-flat node_modules directory for larger projects

### Saving Disk Space

Supposing you have 10 Node.js projects on your personal computer if you use NPM/Yarn, you will have 10 `node_modules` folders with a heavy size.

If you use PNPM, things will be different. It introduces a new concept to us, called a *content-addressable store*. See the image below:

![*(source: **[https://pnpm.io/motivation#saving-disk-space](https://pnpm.io/motivation#saving-disk-space)**)*](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/464be4c9-8cd4-4718-961e-6a2bdaf603f4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202141Z&X-Amz-Expires=3600&X-Amz-Signature=00e32d8fa01a9442ab4d2f28f72623643f61c682fccba07b86aec7b7cd1458d0&X-Amz-SignedHeaders=host&x-id=GetObject)

As you can see, PNPM does not store packages in the `node_modules` folder, but rather in the content-addressable store. Therefore, in the `node_modules` folders of projects using PNPM, the packages are *linked* from the global store.

Thanks to this, package versions are only stored once on the disk

### **Boosting installation speed****[](https://pnpm.io/motivation#boosting-installation-speed)**

PNPM performs installation in three stages:

1. Dependency resolution: identifying and obtaining all necessary dependencies for the store.
1. Directory structure calculation: determining the layout of the `node_modules` directory based on these dependencies.
1. Linking dependencies: retrieving and establishing hard links from the store to `node_modules` for all remaining dependencies.

![*(source: **[https://pnpm.io/motivation#boosting-installation-speed](https://pnpm.io/motivation#boosting-installation-speed)**)*](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/86e5d4b2-189d-4f69-b1fc-82dbda452564/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202141Z&X-Amz-Expires=3600&X-Amz-Signature=7690e388bc6c9d8e68d13d1a637f41a644124f95e896eef9b6ee237d3b72129f&X-Amz-SignedHeaders=host&x-id=GetObject)

This approach is significantly faster than the conventional method of identifying, obtaining, and saving all dependencies directly to the `node_modules` directory.

![*(source: **[https://pnpm.io/motivation#boosting-installation-speed](https://pnpm.io/motivation#boosting-installation-speed)**)*](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/629dc048-0687-46b7-97e2-2b6690b0d1ae/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202141Z&X-Amz-Expires=3600&X-Amz-Signature=f1aebdfc7c63612006c17312f1b67753a67b1ab7f4f592c6b03743def3eacbd1&X-Amz-SignedHeaders=host&x-id=GetObject)

### **Creating a non-flat node_modules directory****[](https://pnpm.io/motivation#creating-a-non-flat-node_modules-directory)**

First of all, we must ask why NPM chooses the flat `node_modules` structure approach.

Going back in time, before the release of NPM version 3, at this point, `node_modules` in NPM were still in a non-flat structure. As shown in the example below:

```javascript
node_modules
└─ foo
   ├─ index.js
   ├─ package.json
   └─ node_modules
      └─ bar
         ├─ index.js
         └─ package.json
```

This approach has some issues such as:

* The issue of long directory paths on the Windows operating system occurred because the package created a dependency tree that was too deep
* Packages were copy-pasted in many places because they were required in different dependencies

Therefore, to solve this problem, NPM decided to flatten `node_modules`. After NPM version 3, the structure of the `node_modules` directory will become like this:

```javascript
node_modules
├─ foo
|  ├─ index.js
|  └─ package.json
└─ bar
   ├─ index.js
   └─ package.json
```

Consequently, the source code can access dependencies that are not explicitly declared in the project. Following the example above, even though the project only uses the **foo** package, we can completely use the **bar** package without declaring it in package.json.

Unlike NPM version 3, PNPM tries to solve the issues without flattening the dependency tree.  Follow the example below:

```javascript
node_modules
├─ foo -> .registry.npmjs.org/foo/1.0.0/node_modules/foo
└─ .registry.npmjs.org
   ├─ foo/1.0.0/node_modules
   |  ├─ bar -> ../../bar/2.0.0/node_modules/bar
   |  └─ foo
   |     ├─ index.js
   |     └─ package.json
   └─ bar/2.0.0/node_modules
      └─ bar
         ├─ index.js
         └─ package.json
---------------------------------------
->: a symlink (or junction on Windows)
```

The **foo** package still contains its dependency **bar** in the form of a symlink. And what’s special is that **foo** doesn’t have `node_modules` inside, this way the dependency tree of **foo** won’t be as deep as in NPM before the release of v3.

At first glance, the structure may seem complicated, but when working on larger projects you will see that this structure is clearer than NPM/Yarn

## Disadvantages of PNPM

However, there are a few disadvantages of using PNPM. One of them is that it can be slower than other package managers like Yarn or NPM when installing packages for the [first time](https://medium.com/@buffet_time/why-you-should-move-to-pnpm-82962f332418). It can also be difficult to use with some build tools like [Webpack](https://dev.to/stackblitz/what-is-pnpm-and-is-it-really-so-fast-and-space-efficient-29la).

PNPM's node_modules layout uses [symbolic links to create a nested structure of dependencies](https://pnpm.io/symlinked-node-modules-structure). This has some implications for certain setups, where Windows machines or certain permissioned Linux environments may have trouble accessing these links.

Another potential issue with PNPM is that its nested dependency structure may not be compatible with certain older packages. [This can cause issues when trying to install packages that have dependencies that are not compatible with PNPM’s nested structure](https://pnpm.io/limitations).

## **Showcase**

Thankfully, PNPM is employed by numerous large companies, demonstrating its effectiveness. For an updated list, you can visit [https://pnpm.io/users](https://pnpm.io/users).

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/196e0dde-ed42-4255-a12a-77b3f25e598e/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202141Z&X-Amz-Expires=3600&X-Amz-Signature=1819a7d5affccdcadcc0c091955c51560614e32f59c1850507b6761b4e0030ed&X-Amz-SignedHeaders=host&x-id=GetObject)

## Conclusion

PNPM is a package manager for Node.js that offers several advantages over other popular package managers, including saving disk space and boosting installation speed. It also creates a non-flat `node_modules` directory, which can be helpful for larger projects. However, there are some potential disadvantages to using PNPM, such as compatibility issues with certain older packages and slower initial package installation times. Despite these drawbacks, PNPM is used by numerous large companies and may be worth considering for your own projects.

Overall, PNPM offers some unique benefits and is a viable alternative to other package managers for Node.js. It's worth exploring whether it's the right choice for your specific use case.

## References:

* [https://pnpm.io/motivation](https://pnpm.io/motivation)
* [https://blog.bitsrc.io/pnpm-javascript-package-manager-4b5abd59dc9](https://blog.bitsrc.io/pnpm-javascript-package-manager-4b5abd59dc9)
* [https://pnpm.io/faq#what-does-pnpm-stand-for](https://pnpm.io/faq#what-does-pnpm-stand-for)
* [https://medium.com/pnpm/why-should-we-use-pnpm-75ca4bfe7d93](https://medium.com/pnpm/why-should-we-use-pnpm-75ca4bfe7d93)
* [https://medium.com/@buffet_time/why-you-should-move-to-pnpm-82962f332418](https://medium.com/@buffet_time/why-you-should-move-to-pnpm-82962f332418)
* [https://dev.to/stackblitz/what-is-pnpm-and-is-it-really-so-fast-and-space-efficient-29la](https://dev.to/stackblitz/what-is-pnpm-and-is-it-really-so-fast-and-space-efficient-29la)
* [https://refine.dev/blog/pnpm-vs-npm-and-yarn/](https://refine.dev/blog/pnpm-vs-npm-and-yarn/)