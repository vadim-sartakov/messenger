const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[contenthash].[ext]',
          outputPath: 'img'
        }
      }
    ]
  },
  optimization: {
    // Preserve external bundles hashes
    moduleIds: 'hashed',
    // Separate runtime chunk
    runtimeChunk: 'single',
    // Separate bundle for external packages
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  // Allows to omit extensions in import statements
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // Inline generated bundles into html
  plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })]
}