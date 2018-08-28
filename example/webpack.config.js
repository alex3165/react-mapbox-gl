var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var env = process.env.NODE_ENV;

var entries = [path.join(__dirname, 'src/index')];
var output = {
  filename: 'bundle.js',
  path: path.join(__dirname, 'dist')
};

// Add more files to copy to the dist folder (Eventually an assets folder)
var toCopy = [
  { from: 'index.html' },
  { from: 'style.css' }
];

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(env)
    }
  })
];

var devtool = '';

if (env === 'dev') {
  // entries = entries.concat(['webpack-dev-server/client?http://localhost:3001']);
  output.path = __dirname;
  devtool = 'eval';
  // plugins.push(new webpack.HotModuleReplacementPlugin());
} else {
  plugins = plugins.concat([
    new CopyWebpackPlugin(toCopy)
  ]);
}

module.exports = {
  entry: entries,
  output: output,
  devtool: devtool,
  devServer: {
    port: 3001,
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: plugins
};
