const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
  return {
    entry: './src/index.tsx',
    output: {
      filename: 'js/main.[contenthash:8].js',
      assetModuleFilename: 'images/[hash:8][ext][query]', // 指定图片资源输出目录
      path: path.resolve(__dirname, 'build'),
      clean: true, // 每次build清除上一次build的目录，重新生成新的hash文件
    },
    target: 'web',

    resolve: {
      // 指定在导入语句没有带文件后缀时，可以按照配置的列表，自动补齐后缀。后缀列表要尽可能的少，减少不必要的匹配。
      extensions: ['.tsx', '.js', '.json', '.ts', '.jsx'],
      // 告诉webpack去哪些目录下寻找第三方模块，默认值是 ['node_modules']，webpack会先去当前目录的 ./node_modules 下去查找，没有找到就会再去上一级目录 ../node_modules 中去找，直到找到为止
      modules: [path.resolve(__dirname, 'node_modules')],
    },
    module: {
      rules: [
        // include: 只对命中的模块使用特定的 loader 进行处理
        // exclude: 指定排除的文件，不使用该 loader 进行处理
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
          // webpack5 提供了一个新特性叫作 Asset Modules，在内部实现了对资源模块的支持。Asset Modules 提供了4种资源模块的类型，无需再额外配置其他的loader来对资源模块进行处理。详情见https://webpack.docschina.org/guides/asset-modules/
          use: ['swc-loader'],
          include: path.resolve(__dirname, 'src'),
          exclude: /node_modules/, //排除 node_modules 目录
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
