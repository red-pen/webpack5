const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const base = require('./webpack.base.js');
const { merge } = require('webpack-merge');
module.exports = env => {
  return merge(base(env), {
    mode: 'production',
    plugins: [
      // 打包分析
      // new BundleAnalyzerPlugin(),

      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
      }),
    ],
    optimization: {
      minimize: true, // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle。
      minimizer: [
        // js压缩
        // 默认已开启，其实无需设置
        // new TerserPlugin({
        //   parallel: true,
        // }),

        // css压缩
        new CssMinimizerPlugin(),
      ],
    },
  });
};
