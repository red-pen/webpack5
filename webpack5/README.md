在平时工作项目中，我们一般都会使用 webpack 或者 vite 去构建项目。很多小白却不理解 webpack 到底有什么作用。

### 1.作用

webpack 能将我们项目中的 es6、less、scss 等浏览器不识别的语言转换成浏览器能识别的语言，不同的 loader 能处理不同类型的文件。

### 2.组成

###### 2.1 入口文件-entry

告诉 webpack 从哪个文件开始上手去构建内部依赖图，默认值是./src/index.js

###### 2.2 输出-output

告诉 webpack 它创建好的`bundle`应该输出到哪里去，以及应该如何命名这些文件。默认值为 ./dist/main.js。其他生成文件默认放到 dist 文件夹

###### 2.3 模式-mode

不同的环境设置不同的值。`development`为开发环境，`production`为生产环境。

###### 2.4 插件-plugin

是一种可扩展的机制，可以在打包过程中添加其他的额外功能，如打包分析`BundleAnalyzerPlugin`，css 提取`MiniCssExtractPlugin`

###### 2.5 module

loader 配置

### 3.文件创建

###### 3.1、初始化 package.json 文件

运行 yarn init 初始化一个 package.json 文件

```
yarn init
```

###### 3.2、安装依赖

为了快速步入正轨，我先把要安装的包先提供出来。

```
{
  "name": "webpack5-demo",
  "version": "1.1.0",
  "description": "webpack5 Demo",
  "main": "index.js",
  "scripts": {
    "start": "node scripts/start.js -hot",
    "build": "webpack --config webpack.prod.js"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "homepage": "",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@swc/core": "^1.3.53",
    "@types/react": "^18.0.38",
    "@types/react-dom": "^18.0.11",
    "browserslist": "^4.21.5",
    "css-loader": "^6.7.3",
    "css-minimizer-webpack-plugin": "^5.0.0",
    "html-webpack-plugin": "^5.5.1",
    "less": "^4.1.3",
    "less-loader": "^11.1.0",
    "mini-css-extract-plugin": "^2.7.5",
    "path": "^0.12.7",
    "postcss": "^8.4.23",
    "postcss-loader": "^7.2.4",
    "resolve-url-loader": "^5.0.0",
    "style-loader": "^3.3.2",
    "swc-loader": "^0.2.3",
    "terser-webpack-plugin": "^5.3.7",
    "typescript": "^5.0.4",
    "webpack": "^5.80.0",
    "webpack-bundle-analyzer": "^4.8.0",
    "webpack-cli": "^5.0.2",
    "webpack-dev-server": "^4.13.3",
    "webpack-manifest-plugin": "^5.0.0",
    "webpack-merge": "^5.8.0",
    "react-dev-utils": "^12.0.0"
  }
}
```

###### 3.2 新增文件

新建一个 webpack.dev.js 文件，webpack.prod.js 文件，新建一个 src 文件夹，src 目录下新增 index.tsx，app.tsx，app.less。目录结构如下

```
-public
  -index.html
-src
  -index.tsx
  -App.tsx
  -app.less
-webpack.dev.js
-webpack.prod.js

```

index.tsx

```
import React from 'react';

import App from './App';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root') as Element);
root.render(<App />);

```

App.tsx

```
import React from 'react';
import './app.less';
import icon from './pig.jpeg';
const App = () => {
  return (
    <div className="test">
      <div className="img"></div>
      <img src={icon} alt="" />
      demo测试
    </div>
  );
};

export default App;

```

app.less

```
.test {
  color: red;
  .img {
    background-image: url('./pig.jpeg');
    width: 200px;
    height: 200px;
    background-size: contain;
  }
  img {
    width: 100px;
    height: 100px;
  }
}
```

public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

到此，我们文件夹就创建完成了。

### 4.webpack 配置

webpack 有两个配置文件，一个是开发环境的配置文件（`webpack.dev.js`），用于开发环境的编译（`webpack.prod.js`），一个是生产环境的配置文件，用于生产环境的打包构建。因为它们的大部分配置都差不多，所以可以抽离一个公共的方法供两个文件使用，这里我们命名为`webpack.base.js`。

###### 4.1 webpack.base.js

入口文件配置`entry`

```
 entry: './src/index.tsx',
```

输出目录配置`output`

```
output: {
  filename: 'js/main.[contenthash:8].js',
  clean: true, // 每次build清除上一次build的目录，重新生成新的hash文件
},
```

编译代码环境`target`,如果想在类 Node.js 环境编译代码，则 target 字段配置为 node,默认值就是‘web’

```
target: 'web',
```

模块解析`resolve`,根据项目文件扩展名灵活配置。

```
resolve: {
  extensions: ['.tsx', '.js', '.json', '.ts', '.jsx'],
},
```

处理项目各个模块`module`。这里没有使用 babel-loader,因为 swc-loader 编译速度更快。 注意：css 分离需要用 MiniCssExtractPlugin.loader 取代 style-loader,这些 css 资源会在 HTML 文件  `<head>`  元素中的  `<link>`  标签内引入。

```
module: {
      rules: [
        {
          test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 1024,
            },
          },
        },
        {
          test: /\.(jsx|js|ts|tsx)?$/,
          // 官方SWC的编译速度相对于Babel可提升近20倍
          use: ['swc-loader'],
          include: path.resolve(__dirname, 'src'),
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
        },
      ],
    },
```

`plugin`,解决 loader 无法实现的其他事情。例如`HtmlWebpackPlugin`
生成 html 文件，在 body 中使用  `script`  标签引入你所有 webpack 生成的 bundle。

```
plugins: [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './public/index.html',
  }),
],
```

到这里`webpack.base.js`的简易配置就完成了,完整代码如下

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    entry: './src/index.tsx',
    output: {
      filename: 'js/main.[contenthash:8].js',
      clean: true, // 每次build清除上一次build的目录，重新生成新的hash文件
      assetModuleFilename: 'images/[hash:8][ext][query]',  // 指定图片资源输出目录
      path: path.resolve(__dirname, 'build'),
    },
    target: 'web',
    resolve: {
      extensions: ['.tsx', '.js', '.json', '.ts', '.jsx'],
    },
    module: {
      rules: [
        // 处理图片资源
        // webpack5 提供了一个新特性叫作 Asset Modules，在内部实现了对资源模块的支持。Asset Modules 提供了4种资源模块的类型，无需再额外配置其他的loader来对资源模块进行处理。详情见https://webpack.docschina.org/guides/asset-modules/
        {
          test: [/\.gif$/, /\.jpe?g$/, /\.png$/],
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 1024,
            },
          },
        },
        {
          test: /\.(jsx|js|ts|tsx)?$/,
          // 官方SWC的编译速度相对于Babel可提升近20倍
          use: ['swc-loader'],
          include: path.resolve(__dirname, 'src'),
        },
        {
          test: /\.css$/,
          // 为了让css分离，必须用MiniCssExtractPlugin.loader替代style-loader
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './public/index.html',
      }),
    ],
  };
};

```

###### 4.2 webpack.dev.js

在 webpack.dev.js 可以通过`merge`来合并 webpack.base.js 的配置。然后新增一些其他配置。

```
const base = require('./webpack.base.js');
const { merge } = require('webpack-merge');

module.exports = () => {
  return merge(base(), {
    ...
  });
};

```

配置`mode`模式

```
mode: development
```

使用`MiniCssExtractPlugin`插件实现 css 分离。

```
const base = require('./webpack.base.js');
const { merge } = require('webpack-merge');

module.exports = () => {
  return merge(base(), {
    ...,
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[contenthash:8].css',
      }),
    ]
  });
};

```

`devServer`配置端口号，gzips 压缩等。

```
const base = require('./webpack.base.js');
const { merge } = require('webpack-merge');

module.exports = () => {
  return merge(base(), {
    ...,
    devServer: {
      port: 3000,
      watchFiles: {
        options: {
          aggregateTimeout: 200,
          ignored: ['**/public','**/node_modules'],
        },
      },
      compress: true,
    },
  });
};

```

`stats`配置控制台打印信息。因为本人不喜欢控制台显示过多无用信息，就去掉了大部分显示

```
const base = require('./webpack.base.js');
const { merge } = require('webpack-merge');

module.exports = () => {
  return merge(base(), {
    ...,
    stats: {
      assets: false, // 是否展示资源信息
      entrypoints: false, // 是否展示入口文件与对应的文件 bundles。
      modules: false, // 是否添加关于构建模块的信息。
    },
  });
};

```

到此，webpack.dev.js 的简易配置就差不多完成了,完整代码如下：

```
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const base = require('./webpack.base.js');

const { merge } = require('webpack-merge');
module.exports = () => {
  return merge(base(), {
    mode: 'development',
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[contenthash:8].css',
      }),
    ],
    devServer: {
      port: 3000,
      watchFiles: {
        options: {
          aggregateTimeout: 200,
          ignored: ['**/public'],
        },
      },
      compress: true,
      client: {
        progress: true,
      },
    },
    stats: {
      assets: false, // 是否展示资源信息
      entrypoints: false, // 是否展示入口文件与对应的文件 bundles。
      modules: false, // 是否添加关于构建模块的信息。
    },
  });
};
```

执行 yarn start，可以看到启动完成。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45fb4b77e1b74380a7ebad13f2a1fa6b~tplv-k3u1fbpfcp-watermark.image?)

###### 4.3 webpack.prod.js

webpack.prod.js 配置和 webpack.dev.js 的配置大差不差，注意的是 webpack.prod.js 的 mode 应该为`production`,代表生产模式的环境。webpack.dev.js 的 mode 是`development`,代表开发环境。

```
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const base = require('./webpack.base.js');
const { merge } = require('webpack-merge');
module.exports = env => {
  return merge(base(env), {
    mode: 'production',
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
      }),
    ],
  });
};
```

###### 4.4 自定义配置启动时的相关输出信息

虽然一般情况都是建议通过 cli 运行 webpack-dev-server,但是我们也可以选择通过 api 启动服务器。

修改 package.json 的启动命令

```
"scripts": {
    "start": "node scripts/start.js",
     ...
  },

```

新建 scripts 目录并且在此目录下新建一个 start.js 文件，代码如下：

```
'use strict';
const Webpack = require('webpack');
const chalk = require('react-dev-utils/chalk');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.dev');
const clearConsole = require('react-dev-utils/clearConsole');

const compiler = Webpack(webpackConfig());
const devServerOptions = { ...webpackConfig().devServer, open: false };
const server = new WebpackDevServer(devServerOptions, compiler);
server.startCallback(() => {
  clearConsole(); // 去掉打印
  console.log(chalk.green('Starting server on http://localhost:3000'));
});
```

执行 yarn start

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4008a3e71340405e827e643770ab857d~tplv-k3u1fbpfcp-watermark.image?)
控制台看着确实清爽了不少。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb2ae399963548fea0f1a4c180ca778b~tplv-k3u1fbpfcp-watermark.image?)

这就是最终运行出来的效果

webpack5 的大致功能就先分享到这里，如果大家还想了解更多的功能可以去官网多看看https://webpack.docschina.org/。
