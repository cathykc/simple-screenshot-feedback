const path = require("path");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "examples/src/index.html"),
  filename: "./index.html"
});

module.exports = merge(common, {
  entry: ["@babel/polyfill", path.join(__dirname, "examples/src/index.tsx")],
  devServer: {
    port: 3001
  },
  plugins: [htmlWebpackPlugin],
});