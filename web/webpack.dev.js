const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  output: {
    filename: 'js/[name].js'
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build',
    port: 3000,
    hot: true
  }
});