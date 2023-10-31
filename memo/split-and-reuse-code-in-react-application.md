---
author: 
created_time: 2021-07-20
tags: react.js
created: 2019-05-02
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c7818608-7e5e-4f60-8142-b24456ff6eed/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202408Z&X-Amz-Expires=3600&X-Amz-Signature=b1a9bd8c9d3635e4ef11d1d3eaaf43eeb036c9485623681a826a75d29bb3c444&X-Amz-SignedHeaders=host&x-id=GetObject)

## Introduction

Sometimes you found that some piece of code that is very repetitive in your react application such as:

* Modal: declare modal state and function to set modal state
* Fetch: declare fetch states such as loading and error

In some Vue.js, you got the feature that allows you to encapsulate state and methods into the package that you can easily insert to your component logic called mixins. What have we got in React.js?

Let’s take a look in the first repetitive problem above where you have to declare modal state and function to change modal state each time you want to use a modal.

## Problems

Bellow is the code that implements an app that store state and method to show, open and close the modal

```javascript
import React, { Component } from 'react';
import Modal from './Modal'
import './index.css'

class App extends Component {
  constructor () {
    super()
    this.state = {
      isOpenModal: false
    }
  }

  render() {
    const {
      isOpenModal
    } = this.state

    return (
      <div>
        <main>
          <h1>React Modal</h1>
          <button type="button" onClick={() => {
            this.setState({
              isOpenModal: true
            })
          }}>
            open
          </button>
          <Modal show={isOpenModal} handleClose={()=>{
            this.setState({
              isOpenModal: false
            })
          }} />
        </main>
      </div>
    );
  }
}

export default App;
```


Imagine if we want to create another dialog on another page in the current page. We will have to create another stage for it then have a function to manipulate the state.

## Render props pattern

It’s the pattern where we create a component, have it’s stored repetitive logic and state and expose it to children render function. Bellow is HOCComponent that store state and toggles logic of one component

```javascript
import React from 'react'

export default class HOCCOmponent extends React.Component {
  constructor () {
    super()
    this.state = {
      isOpen: false
    }
  }

  openModal = () => {
    this.setState({
      isOpen: true
    })
  }

  closeModal = () => {
    this.setState({
      isOpen: false
    })
  }

  render () {
    const {
      children
    } = this.props

    const {
      isOpen
    } = this.state

    const {
      openModal,
      closeModal
    } = this

    return (
      <>
        {children({
          openModal,
          closeModal,
          isOpen
        })}
      </>
    )
  }
}
```

React component has some reserve props and children is one it’s. It’s represent anything pass in this component

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/225e3033-7d41-4dc3-85fb-cb39f679f1f0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202408Z&X-Amz-Expires=3600&X-Amz-Signature=521c2faee71f732be943ea03098fd679fd8df4f2b1394f886285430891685576&X-Amz-SignedHeaders=host&x-id=GetObject)

For example, The Foo children prop ais the Bar component. The component above use child as a function since react is just the function that return react component. We pass repetitive data and methods that have been stored and processed in HOC Component to children function.

```javascript
import React, { Component } from "react";
import HOCModal from "./HOCModal";
import Modal from "./Modal";
import "./index.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isOpenModal: false
    };
  }

  render() {
    const { isOpenModal } = this.state;

    return (
      <div>
        <main>
          <h1>React Modal</h1>
          <HOCModal>
            {({ openModal, closeModal, isOpen }) => {
              return (
                <>
                  <button
                    type="button"
                    onClick={openModal}
                  >
                    open
                  </button>
                  {isOpen && (
                    <Modal show={isOpen} handleClose={closeModal} />
                  )}
                </>
              );
            }}
          </HOCModal>
        </main>
      </div>
    );
  }
}

export default App;
```


This method has some trade back such as only components inside the HOC Component can only access the data.

## React hooks

React hooks is the feature that has been implemented in react 16.8. There is one hook that is called useState hooks that allow storing state inside functional react component

If that component is used useState hook then It can return not just react component but can return anything it one. When it return component then it’s just normal component utilize react hook. When it return not react component then it behaves like the custom hook: store and process data inside it and return new data back

Remember that (custom) hooks must be used inside **a function react components.**

```javascript
import React, {
  useState
} from 'react'

const useModal = () => {
  const [isOpen, setIsOpen] = useState()

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(true)
  }

  return {
    openModal,
    closeModal,
    isOpen
  }
}

export default useModal
```


The use connect above return methods that allowed to change interstate of useModal hooks which is isOpen and also the data itself. useState return an array that have two elements:

* First element is datas
* Second element will be function to set datas

UseState work just like the state in class component. When you set the data using setter function it may rerender the components that use the hook base on react state mechanic.

```javascript
import React, { Component } from "react";
import HOCModal from "./HOCModal";
import Modal from "./Modal";
import useModal from "./useModal";
import "./index.css";

// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       isOpenModal: false
//     };
//   }

//   render() {
//     const { isOpenModal } = this.state;
//     return (
//       <div>
//         <main>
//           <h1>React Modal</h1>
//            {/* Traditional way */}
//           {/* <button type="button" onClick={() => {
//             this.setState({
//               isOpenModal: true
//             })
//           }}>
//             open
//           </button>
//           <Modal show={isOpenModal} handleClose={()=>{
//             this.setState({
//               isOpenModal: false
//             })
//           }} /> */}

//           {/* Render Props pattern way */}
//           {/* Demonstrate return */}
//           {/* <HOCModal>
//             {(a)=>{
//               console.log(a);
//               return (
//                 <div/>
//               )
//             }}
//           </HOCModal> */}

//           {/* UseConnect methods */}
//           <button type="button" onClick={isOpen}>
//             open
//           </button>
//           <Modal show={isOpenModal} handleClose={closeModal} />

//         </main>
//       </div>
//     );
//   }
// }

// export default App;

// use connect

export default () => {
  const { openModal, closeModal, isOpen } = useModal();
  return (
    <div>
      <main>
        <h1>React Modal</h1>

        {/* UseConnect methods */}
        <button type="button" onClick={openModal}>
          open
        </button>
        <Modal show={isOpen} handleClose={closeModal} />
      </main>
    </div>
  );
};
```


## Conclusion

Not only store data, you can also process data, fetch data from remote source, connect to internal source inside HOC Component and useState hooks

React hooks used to be proposed specification but since react 16.8: the one with hooks, It’s has been made to become official feature so your guys can just use it sparingly to splitting your repetitive code into.

Here is the full source code of our application: [https://github.com/phmngocnghia/modal-hook](https://github.com/phmngocnghia/modal-hook)
