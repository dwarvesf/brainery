---
author: 
created_time: 2021-07-20
tags: react.js
created: 2019-05-02
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/65557410-db8d-4323-87eb-1857a44c513d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202408Z&X-Amz-Expires=3600&X-Amz-Signature=83425ee7f6ccaddd072356ef7ecf30508cc22322f36fdd17676345716e07e804&X-Amz-SignedHeaders=host&x-id=GetObject)


## Introduction

create-react-app is an official CLI to create react application sometime you need to customize it such as add an alias or add plugin babel config, you end up ejected.

In this article, i’m going to demonstrate how to create simple webpack config to run react app. After reading this article, you will be able to create your own react webpack config and tweak it as you liked

## Setup projects

First you need to config three file such as:

* webpack.dev.js: this is our webpack config use in develop environment
* webpack.prod.js: this is our webpack config use in production enviroment

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/de5f7182-7df0-4a5c-a5ec-7c687d17a8e8/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202408Z&X-Amz-Expires=3600&X-Amz-Signature=b40d51d1415b6276aa76fba4e41a4271fe0d3d063f283c842f0a849cb08c2cb9&X-Amz-SignedHeaders=host&x-id=GetObject)

## Webpack development config

In your webpack.config.js we will need to install babel to transpile javascript ES6 into ES5 and transpile react.js and jsx into javascript. You will also need to install css-loader to resolve import and style-loader to load your css into style tag in head tag.

You will also need to install webpack-dev-server which automatically reload your content in the

```javascript
yarn add -D babel-loader @babel/core @babel/preset-react webpack webpack-cli css-loader style-loader
```


In your webpack.config.js specify entry in webpack config to point to index.js file then configure babel-loader to run with js file extension. Loader in webpack is a optimizer, transformer that run against some specific file type. Specify file type with use key(which use regular express) and loaders which specify which loader run with that type of file.

```javascript
const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },  {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
}
```


Then add some babel preset. Which babel preset include bunch of babel plugin.

* babel-present: will automatically transpile es6 code into es5 code
* babel-react: will transpile react code into es5 javascript code

```javascript
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```


Create App component and remember to wrap it with hot import by react-hot-loader when exported to make react work with HMR:

```javascript
import { hot } from 'react-hot-loader/root'
const App = () => <div>Hello World!</div>
export default hot(App)
```


Then create index.js (entry point) then import App component and render it using render method of ReactDOM:

```javascript
// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/App'

ReactDOM.render(
  <App/>,
  document.getElementById('app')
)
```


## Webpack production config

In production config. We may want use mode production by set key mode to ‘production’. You will also want to install mini-extract-css plugin which extract our css into external css file and html-webpack-plugin which automatically inject your transform css, javascript, assest file… etc into your predefined html file.

```javascript
yarn add -D mini-css-extract-plugin html-webpack-plugin
```

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }, {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader",
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],

}
```


Then create index.html in root folder, html webpack plugin will automatically inject generated

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Demo</title>
</head>
<body>
  <div id="app">
    You must enable JavaScript to view this page
  </div>
</body>
</html>
```

## Wrap Up

The last thing is to create npm script to run your react application

```javascript
"scripts": {
    "dev": "webpack-dev-server index.js --config webpack.dev.js --hot",
    "build": "webpack index.js --config webpack.prod.js"
},
```


**Command**

* build: build react application using production mode
* develop: start develop the application using webpack dev server

In dev script we run webpack-dev-server point to our index.js file with -hot to settings it to run it in HotModuleReplace mode. — config flag allow to make it use custom config. The same applied for build script

## Conclusion

Here is the full repository that includes setup in this article: [https://github.com/PhmNgocNghia/SetupReactWebpack\](https://github.com/PhmNgocNghia/SetupReactWebpack%5C)
