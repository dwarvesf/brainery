---
author: 
created_time: 2021-07-20
tags: js, testing
created: 2019-08-02
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7efa8c16-2ea4-4eee-8687-09a4fad5ab06/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202419Z&X-Amz-Expires=3600&X-Amz-Signature=92b9d73a130806b4b99c3473d28ab641e051a22121f90c051063e7b7798196dd&X-Amz-SignedHeaders=host&x-id=GetObject)


## Introduction

End-to-end testing is a methodology used to test whether the flow of an application is performing as designed from start to finish. It’s like testing as a user perspective and not involve thing like assert internal code state or mock… etc

Cypress is an e2e testing framework that offers simplicity API and performant test runner https://www.cypress.io/

## Application being tested

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0c23b056-dfdb-438c-a0e0-437af659017b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202419Z&X-Amz-Expires=3600&X-Amz-Signature=53de44e0b726e59872e87d09f316104dd4c74246f1dd5785734cecdeac23d8d9&X-Amz-SignedHeaders=host&x-id=GetObject)


The application that we are going to test against is autocomplete textbox. Features

* Enter filter text and render list item that has text match filter text
* Select item in the list will replace filter text with text in the list item

## Installation

Clone this project for application setup (This repo. Install project dependencies with yarn install) https://github.com/PhmNgocNghia/TestingReact

Since this is a react project using custom webpack template. Here is some command to start the project:

* yarn dev: start develop using webpack hot replacement server
* yarn build: build production application

We must first start run yarn dev for testing server at localhost:9000

To start writing test, create a npm script that starts cypress with npm command: cypress open


```plain_text
"scripts": {
   "e2e": "cypress open"
},
```

Try running command yarn e2e first time, it will create folder named cypress. Create file named AutoComplete.spec.js in e2e/integration folder. Test files are located in `cypress/integration` by default, but can be configured to another directory.

Cypress integrate with mocha test runner and chai assert library by default. Each describes statement create a section of the test case and each statement create a test case. Mocha also has a hook which will run the function inside it. My test file bellow use beforEach hooks which will run the function you pass in it in every test case


```plain_text
describe('Auto Complete', function () {
  beforeEach(function () {
    cy.visit('localhost:9000')
  })
  it('Filter source of the textbox correctly', function () {

  })
  it ('Set textbox input when click into list item', function () {

  })
}
```


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0e91deb3-155c-4661-9a45-e891e6455af4/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202419Z&X-Amz-Expires=3600&X-Amz-Signature=808c7371fe58c6897b53a3caacb7b1c99f605c7ff258af1339481969f272deda&X-Amz-SignedHeaders=host&x-id=GetObject)


Run command yarn e2e it will show window and browser like this. A window is for select test and the browser is for testing result
E2E Testing
In the first test case: Filter source of the textbox correctly. That means we going to type in the textbox and expect it’s return list of item that includes the text in the textbox. Cypress syntax is chainable, you can chain it like

`cy.get('input').type('abc')`


The command above will get the element input tag and type word ‘abc’ in it. Cy.get take string parameter as CSS Selector. should statement allow you to do assertion. You must chain it after getting statement.


The should command allow us to do assertion.Should have two kind syntaxes:

* should(‘assertion_name, assertion_value)
* should(assertion_function)

With type 1, you can view all available assertion_name at https://docs.cypress.io/guides/references/assertions.html#Common-Assertions

```javascript
it('Filter source of the textbox correctly', function () {
    // get input and type 'one' in it
    cy.get('input').type('one')

    // as seed data: one should return 1 li element have text one
    cy.get('li').should('have.length', 1)

    // li:first-of-type: select first element of li. This is psuedo css selector
    cy.get('li:first-of-type').should('contain', 'one')
  })
```

With type 2, you pass a function in should that allow you to do multiple asserts. The function takes one parameter which is Jquery object. Since cypress builtin with chai assert library, you can use chai assertion to assert it.

```javascript
it ('Set textbox input when click into list item', function () {
    cy.get('input').type('on')
    cy.get('li:first-of-type').click()

    // Should assertion type 2
    cy.get('input').should($input=>{
      // $input is jquery wrapper. expect().to.be(xyz) is chai assertion
      expect($input[0].value).to.be.equal('one')
    })
  })
```

After inserting e2e test into the spec file. Run yarn e2e again to see the result of the test:

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/86f521ed-3987-435d-b700-1b33e4c8f709/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202419Z&X-Amz-Expires=3600&X-Amz-Signature=a501f447a20fdd6771afb1ffd6305cd276dda2b5f234e02caf005854a07eb9fc&X-Amz-SignedHeaders=host&x-id=GetObject)


## Conclusion

In this article, I didn’t cover all feature of cypress, mocha task runner and chai assertion library. You can check its document at:

* Chai assertion: [https://www.chaijs.com/api/bdd/](https://www.chaijs.com/api/bdd/)
* Cypress: [https://docs.cypress.io](https://docs.cypress.io/)

You can view the full working repository at [https://github.com/PhmNgocNghia/TestingReact](https://github.com/PhmNgocNghia/TestingReact)
