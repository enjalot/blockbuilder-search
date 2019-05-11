var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ['./src/main.js'],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: '#inline-source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ["css-loader", "sass-loader"]
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.json']
  }
}
