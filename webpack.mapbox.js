var webpack = require("webpack");
var path = require("path");

var nodeModules = path.join(__dirname, "node_modules");

module.exports = {
  entry: path.join(nodeModules, "mapbox-gl/js/mapbox-gl.js"),
  output: {
    path: path.join(__dirname, "vendor"),
    filename: "mapbox-gl.bundle.js",
    library: "fluorine",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: ["", ".js"],
    alias: {
      webworkify: "webworkify-webpack"
    }
  },
  module: {
    loaders: [
      {
        test: /\.json/,
        loader: "json"
      },
      {
        test: /\.js$/,
        include: path.join(nodeModules, "webworkify/index.js"),
        loader: "worker"
      },
      {
        test: /mapbox-gl.+\.js$/,
        loader: "transform/cacheable?brfs"
      }
    ]
  }
};
