const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    // In development mode and hot reload we can't use contenthash
    filename: `js/[name]${process.env.NODE_ENV === 'development' ? '' : '.[contenthash]'}.js`,
    publicPath: '/'
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          // In development mode and hot reload we can't use contenthash
          name: `[name]${process.env.NODE_ENV === 'development' ? '' : '.[contenthash]'}.[ext]`,
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
    },
    ...process.env.NODE_ENV === 'production' && {
      minimize: true,
      minimizer: [new TerserPlugin(), new OptimizeCss()]
    }
  },
  // Allows to omit extensions in import statements
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new Dotenv({ path: process.env.NODE_ENV === 'development' ? './.dev.env' : './.prod.env' }),
    // Extract CSS
    new MiniCssExtractPlugin({
      // In development mode and hot reload we can't use contenthash
      filename: `css/[name]${process.env.NODE_ENV === 'development' ? '' : '.[contenthash]'}.css`
    }),
    // Inline generated bundles into html
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ],
  ...process.env.NODE_ENV === 'development' && {
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './build',
      port: 3000,
      historyApiFallback: true,
      hot: true
    }
  }
}