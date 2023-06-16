const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    entry: './src/index.tsx',
    output: {
      filename: 'js/main.[contenthash:8].js',
      clean: true, // 每次build清除上一次build的目录，重新生成新的hash文件
      assetModuleFilename: 'images/[hash:8][ext][query]',
      path: path.resolve(__dirname, 'build'),
    },
    target: 'web',
    resolve: {
      extensions: ['.tsx', '.js', '.json', '.ts', '.jsx'],
    },
    module: {
      rules: [
        // 处理css里面的图片资源
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
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './public/index.html',
      }),
    ],
  };
};
