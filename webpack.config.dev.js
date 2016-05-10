var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: "cheap-module-eval-source-map",
  entry: path.join(__dirname, "example/main.js"),
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    loaders: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: [ "react-hot", "babel-loader" ]
    },
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },
    {
      test: /\.json$/,
      loader: "json-loader"
    }]
  }
};
