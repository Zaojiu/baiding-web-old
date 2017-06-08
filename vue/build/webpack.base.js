'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FlowtypePlugin = require('flowtype-loader/plugin')
const config = require('./config')
const _ = require('./utils')
const fs = require('fs')

module.exports = {
  entry: {
    'babel-polyfill': 'babel-polyfill',
    client: './src/index.js'
  },
  output: {
    path: _.outputPath,
    filename: '[name].js',
    publicPath: config.publicPath
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    alias: {
      root: path.join(__dirname, '../src'),
      components: path.join(__dirname, '../src/components')
    },
    modules: [
      _.cwd('node_modules'),
      // this meanse you can get rid of dot hell
      // for example import 'components/Foo' instead of import '../../components/Foo'
      _.cwd('client')
    ]
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'flowtype-loader', enforce: 'pre', exclude: /node_modules/ },
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
        options: {
          preLoaders: {
            js: 'flowtype-loader'
          },
        }
      },
      {
        test: /\.js$/,
        loaders: 'babel-loader',
        exclude: [/node_modules/]
      },
      {
        test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader'
      },
      {test: /\.font\.(js|json)$/, loader: 'style-loader!css-loader!fontgen-loader'}
    ]
  },
  plugins: [
    new FlowtypePlugin(),
    new HtmlWebpackPlugin({
      title: config.title,
      template: path.resolve(__dirname, 'index.html'),
      filename: _.outputIndexPath
    }),
    new webpack.LoaderOptionsPlugin(_.loadersOptions()),
    new CopyWebpackPlugin([
      {
        from: _.cwd('./static'),
        // to the roor of dist path
        to: './'
      }
    ])
  ],
  target: _.target
}
