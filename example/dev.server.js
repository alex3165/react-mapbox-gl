var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('./webpack.config.js');

var host = '127.0.0.1';
var port = 3001;

new WebpackDevServer(webpack(config), {
  hot: true,
  watchOptions: {
    ignored: /node_modules/
  },
  stats: { colors: true },
  historyApiFallback: true
}).listen(port, host, function listen(err) {
  if (err) {
    console.log(err);
  }
});
