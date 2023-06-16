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
