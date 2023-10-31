---
author: 
created_time: 2021-07-20
tags: js
created: 2019-09-07
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/640a5ba2-ab3b-4d80-8622-32c654a148ef/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=8f53a4a42e4b8a29c5a2b355f5f1768920586348e7a781d487594122963c7acd&X-Amz-SignedHeaders=host&x-id=GetObject)

# Introduction

Imagine you have a lot of components and you imported it like this:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b1ad5bbb-1dbb-4a7c-bd02-e940952bd0b0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=dcc7bde6b6fc21cd7110f0e31732c86f9841e605ad3b98caf5f676fdd851ef5b&X-Amz-SignedHeaders=host&x-id=GetObject)

Instead of importing component like above. You would want to import your components like this:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/cf4fe369-8cc8-4649-a900-1265a98e85f9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=bfd52578ffe1d9c0d159e9dbdc3c0335c9e9622b6878794cfe8956a4cae72e2c&X-Amz-SignedHeaders=host&x-id=GetObject)

**The pros of this style are**

* Your project structure now grouped into multiple namespaces. You can image It’s like C# namespace. Each namespace is a root folder in our project.
* Don’t have to remember exactly path of your components.

**The cons are**

* Can’t export members who name has been exported already. Eg: Component/A export A member so Component/B cannot export A member.

# Implementation

To implement this style, We use re-export statement which is all feature of Javascript ES6: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)

It’s syntax like bellow. All named export or all export data from the module, whose path is something, will re-export from the file that use re-export syntax

```javascript
export {named export} from 'somthing'
export * from 'something'
```

Then when you import the name using re-export syntax. It’s will contain member which It’s re-export.

I implemented a small example at codesandbox: [https://codesandbox.io/s/admiring-hill-esw1j](https://codesandbox.io/s/admiring-hill-esw1j)

In this example, I have a folder named component in the root folder. In the folder, I have component1 and component2 and a folder named `nested-component`.

Inside that folder also have `nested-component1` and `nested-component2`.

Let’s say from the app component in the directory I want to import component1,2; nested-component1,2. I have to import it like this

```javascript
import React from "react";
import ReactDOM from "react-dom";
import Component1 from '../src/components/component1'
import Component2 from '../src/components/component2'
import NestedComponent1 from '../src/components/nested-component/nested-component1'
import NestedComponent2 from '../src/components/nested-component/nested-component2'
import "./styles.css";
function App() {
  return (
    <div className="App">
    <Component1/>
    <Component2/>
    <NestedComponent1/>
    <NestedComponent2/>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

I will refactor it by creating a file named index.js in a components folder that exports all content of Its child.

```javascript
export {component1} from "./component1";
export {component2} from "./component2";
```

or

```javascript
export {component1} from "./component1";
export {component2} from "./component2";
export {NestedComponent1} from './nested-component/nested-component1'
export {NestedComponent2} from './nested-component/nested-component2'
```

Please note that the export all identifier above is not re-export the export default state of the module. eg: In module A exported default a and exported named b. Only b will be re-exported.


Then in your app component, you can

```javascript
import { component1 as Component1, component2 as Component2, NestedComponent1, Nested} from "./components";
```

## @Autogen-export Package

I implemented those packages to automation the create export file job. It’s work with any ES6 Code (React, Vue) as long as you provide a correct babel configuration file for @babel/core parsed the code properly.
Auto-generate-export file is a utility tool which generates index file exported all of Its child folder (that contain exportable index file) and child file.

It’s work with Typescript, Javascript ES6. It has many configurable options that allow you to tweak all of Its aspects:

* Extension type of a generated file.
* Extension of a file that will be parsed.
* Ignore specific folder.

It has been published as an NPM package.

* [https://www.npmjs.com/package/@autogen-export/core](https://www.npmjs.com/package/@autogen-export/core)
* [https://www.npmjs.com/package/@autogen-export/cli](https://www.npmjs.com/package/@autogen-export/cli)

I also created examples on how to use those packages: [https://github.com/phmngocnghia/AutoGenerateReExportFile/tree/master/examples](https://github.com/phmngocnghia/AutoGenerateReExportFile/tree/master/examples)


What do you think about this pattern? Please express your idea
