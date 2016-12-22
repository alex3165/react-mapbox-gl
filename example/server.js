var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var config = require('./webpack.config')

var compiler = webpack(config)
var port = 8080;
var host = 'localhost';

var server = new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  noInfo: true
})

server.listen(port, host, function() {
  console.log(`☕️  Server is listening on http://${host}:${port}.`);
})
