var path = require('path');
// var SRC_DIR = path.join(__dirname, '/react-client/src/components/student-video-view');

var SRC_DIR = path.join(__dirname, '/react-client/src/components/owner-homepage-view');
var DIST_DIR = path.join(__dirname, '/react-client/dist');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : SRC_DIR,
        loader : 'babel-loader',      
        query: {
          presets: ['react', 'es2015']
       }
      }
    ]
  }
};