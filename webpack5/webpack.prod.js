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
