'use strict'
module.exports = {
  port: 9000,
  title: 'baiding-web-vue',
  publicPath: '/',
  postcss: [
    require('autoprefixer')(),
    require('postcss-nested')
  ],
}
