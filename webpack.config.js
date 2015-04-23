var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: ['./demo/index.js']
  },
  output: {
    filename: "./build/demo/bundle.js"
  },
  //resolve: {
  //  root: [
  //    path.join(__dirname, "./src/")
  //  ],
  //  extensions: ['', '.js']
  //},
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {test: /\.json$/, loader: "json"}
    ]
  },
  plugins: []
};
