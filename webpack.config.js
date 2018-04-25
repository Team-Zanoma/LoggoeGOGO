const webpack = require('webpack');
const path = require('path');

const parentDir = path.join(__dirname, '/react-client/src/');
const distDir = path.join(__dirname, '/react-client/dist');

module.exports = {
  entry: [
    path.join(parentDir, 'index.jsx')
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },{
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      }
    ]
  },
  output: {
    path: distDir,
    filename: 'bundle.js'
  }
};