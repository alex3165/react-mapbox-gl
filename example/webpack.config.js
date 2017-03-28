var webpack = require('webpack')
var path = require('path')

module.exports = {
  watch: process.env.NODE_ENV !== 'prod',
  entry: ['./src/index.js'],
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: [
      '.js', '.jsx'
    ],
    alias: {
      'react-mapbox-gl': path.join(__dirname, '../lib/index.js'),
      'mapbox-gl': path.join(__dirname, '../node_modules/mapbox-gl/dist/mapbox-gl-dev.js')
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'remove-flow-types-loader',
        include: /node_modules\/mapbox-gl/
      }, {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js'
  }
}
