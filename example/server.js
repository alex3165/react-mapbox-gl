var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var config = require('./webpack.config')

var compiler = webpack(config)

var server = new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  noInfo: true
})

server.listen(8080, "localhost", function() {
  console.log('☕️  Server is listening on localhost:8080.');
})
