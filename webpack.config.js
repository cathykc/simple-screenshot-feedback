const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const htmlWebpackPlugin = new HtmlWebpackPlugin({
//   template: path.join(__dirname, "examples/src/index.html"),
//   filename: "./index.html"
// });

module.exports = {
  // entry: ["@babel/polyfill", path.join(__dirname, "examples/src/index.tsx")],
  entry: ["@babel/polyfill", path.join(__dirname, "src/index.ts")],
  output: {
    path: path.resolve('lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    react: 'react',
    reactDOM: 'react-dom'
  },
  module: {
    rules: [
      {
          test: /\.(ts|js)x?$/,
          use: "babel-loader",
          exclude: /node_modules/
      },
      {
          test: /\.css$/,
          use: ["style-loader", { loader: "css-loader", options: { modules: true }}],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'url-loader',
        ],
      },
    ]
  },
  // plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
  },
  devServer: {
    port: 3001
  }
};