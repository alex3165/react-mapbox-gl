var webpack = require('webpack')
var path = require('path')

module.exports = {
  watch: true,
  entry: [
    './src/index.js'
  ],
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react-mapbox-gl': path.join(__dirname, '../lib/index.js')
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/
      }, {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/static/',
    filename: 'bundle.js'
  }
}

