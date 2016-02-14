var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: [
      './react/main.js'
	  ],
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    progress: true,
    colors: true,
    devtool: "#inline-source-map",
    module: {
        loaders: [{
          test: /\.js?$/,
			    include: path.join(__dirname, 'react'),
          loader: "babel-loader",
          query: {
            presets: ['es2015', 'react']
          }
        }, {
          test: /\.scss$/,
          loader: 'style!css!sass'
        }],
    },
    resolve: {
      extensions: ['', '.js', '.jsx', '.scss', '.css', '.json']
    }
};
