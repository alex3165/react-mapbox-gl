var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: path.join(__dirname, "node_modules/mapbox-gl/js/mapbox-gl.js"),
  output: {
    path: "./src/",
    filename: "mapbox-gl-js.bundle.js",
  },
  devtool: "eval",
  resolve: {
    alias: {
      "webworkify": "webworkify-webpack"
    }
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: "json-loader"
    }, {
      test: /\.js$/,
      include: path.resolve(__dirname, "js/render/painter/use_program.js"),
      loader: "transform/cacheable?brfs"
    }],
    postLoaders: [{
      include: /node_modules\/mapbox-gl/,
      loader: "transform",
      query: "brfs"
    }]
  }
}