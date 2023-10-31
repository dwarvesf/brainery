---
author: 
created_time: 2021-07-20
tags: css
created: 2019-02-01
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a5e2ca13-4ff6-4a54-943c-b0e1a9be112a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=330fe6d307634f1535a7bba882f4227fb57edbeef5ce13862745ebda4c3e6703&X-Amz-SignedHeaders=host&x-id=GetObject)

# Introduction

Reducing assets size is one of the most practical ways to speed up your web application. I have a simple use case, lets imagine your HTML file looks like this

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Bootstrap</title>

  <link rel="stylesheet" href="./bootstrap-grid.min.css" />
</head>
<body>
  <div class="row">
    <div class="col-sm-4">.col-sm-4</div>
    <div class="col-sm-4">.col-sm-4</div>
    <div class="col-sm-4">.col-sm-4</div>
  </div>
</body>
</html>
```


Now look at

```javascript
bootstrap-grid.min.css
```

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0187f043-3695-4386-8ab4-b1501ae030ca/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=c3b8d10cd1976c2d9cdfa9a07654c3d82822fe9af6be1d7c7c0f3430a763a9e2&X-Amz-SignedHeaders=host&x-id=GetObject)

Quite huge isn’t it? Thanks to PurgeCss here is the CSS file after being purged will only contain parts of the CSS file (only used selectors), as you can see horizontal scrollbar is not very long:

# Usage

PurgeCSS can be installed with npm package

```javascript
npm i --save-dev purgecss
```

Basically, you run it against your CSS files and your HTML/JavaScript files. It will parse and analyze which CSS content will be used and remove unused CSS content.

PurgeCSS can be used as a CLI. This is our project structure, we gonna need to transform CSS files so we have to download bootstrap distro and get file we want to transform.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/4747d9cd-527c-4de3-bfd1-c5e97a696581/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=2d2f4529a9dc04b5632c2440cfc09025ef61b6c68f80baffe012e592d2d716ff&X-Amz-SignedHeaders=host&x-id=GetObject)


CLI command syntax

`purgecss --css <css file> --content <content file to parse css> --out <output-directory>`

Since Purgecss is installed in `/node_modules\` we must run this command through npm script. We use `--out dist` option to store output CSS files in dist folder after transformed. Now change the path of `bootstrap-grid.min.css` in `index.html` to:

`<link rel="stylesheet" href="./dist/bootstrap-grid.min.css" />`


Then create npm script to run purgecss

```javascript
{
  "name": "PurgeCSS",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^4.29.0"
  },
  "scripts": {
    "build": "purgecss --css bootstrap-grid.min.css --content index.html --out dist/"
  }
}
```


Then run npm run build, you should see new bootstrap-grid.min.css in dist folder with unused CSS content being removed

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/27529b33-2d27-4037-b566-0fb99830ed82/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=2582cff06a973285fc5f70407beec3ab51619092e9312d41c3f8f66848dde7f8&X-Amz-SignedHeaders=host&x-id=GetObject)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/3e6d20d7-4fe4-4175-9306-a62d92b86c57/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=cc8c816d138f4f136ccfca076317e1bc6b384d7549693e79fb45c7e337dc4d74&X-Amz-SignedHeaders=host&x-id=GetObject)

You can view full CLI options at [https://www.purgecss.com/cli\](https://www.purgecss.com/cli%5C)

Example repository: [https://github.com/PhmNgocNghia/purge\-css\-demo\-cli\](https://github.com/PhmNgocNghia/purge%5C-css%5C-demo%5C-cli%5C)

# Setup using Webpack

Purge CSS can be used together with built tools such as webpack, gulp, grunt,… etc. You can view it’s documentation at [https://www.purgecss.com/\](https://www.purgecss.com/%5C)

I’m going to demonstrate how to integrate with Webpack. This is my simple project which integrate project and Webpack

```javascript
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
  },
  module: {
    rules: [
      // javascript = babel + uglify
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{ loader: "babel-loader" }]
      },

      // css file: extract to css file with mini extract plugin
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },

  // uglifyjs
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },

  // plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
```


In my index.js file, I simply import bootstrap grid CSS.

`// Import CSS Grid min CSS`

`import 'bootstrap/dist/css/bootstrap-grid.min.css'`


Here is the build output which includes CSS grid file

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ca7bf12d-9d40-474d-aa23-907c34a1fc38/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=4984c89b582390aec718b220adbd37e206f4fa6dda4226b77667c61a7d44b63e&X-Amz-SignedHeaders=host&x-id=GetObject)


To use PurgeCss with Webpack simply install this Webpack plugin:
`npm i purgecss-webpack-plugin -D`

Then add it to plugin section in Webpack config file

```javascript
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob')
const path = require('path')

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "[name].js",
    path: __dirname + "/dist"
  },
  module: {
    rules: [
      // javascript = babel + uglify
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{ loader: "babel-loader" }]
      },

      // css file: extract to css file with mini extract plugin
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },

  // uglifyjs
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  },

  // plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`,  { nodir: true }),
    }),
  ]
};
```

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/897c26f8-b726-46db-9475-2a3bdcbcd504/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202410Z&X-Amz-Expires=3600&X-Amz-Signature=a1753030a0a4eeabd9624f3b4b7612d0dc3e3ef4d2d115baeea20f79014a5e1c&X-Amz-SignedHeaders=host&x-id=GetObject)


Full example repository: [https://github.com/PhmNgocNghia/purge\-css\-example\-webpack\](https://github.com/PhmNgocNghia/purge%5C-css%5C-example%5C-webpack%5C)

# Conclusion

With PurgeCSS, our `bootstrap-grid.main.css` file reduce from **47kb** to **601byte**. All unused selectors has been removed. You can view the documentation at [https://www.purgecss.com/\](https://www.purgecss.com/%5C) which contain details instruction and api references.

Not only bootstrap, you can use PurgeCSS with many css libraries such as TailwindCSS, Zurb foundation,... etc.
