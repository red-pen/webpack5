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
      cachedModules: true, // 是否要缓存（非内置）模块的信息。
    },
  });
};
