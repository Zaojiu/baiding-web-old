declare module 'html-webpack-plugin' {
  import { Plugin } from 'webpack'

  class HtmlWebpackPlugin extends Plugin {
    constructor(options: {[key: string]: any})
  }

  module HtmlWebpackPlugin {} // https://github.com/Microsoft/TypeScript/issues/6656
  export = HtmlWebpackPlugin
}
