const path = require("path");

module.exports = {
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
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
  },
};