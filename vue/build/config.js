'use strict'
module.exports = {
  port: 9000,
  title: 'baiding-web-vue',
  publicPath: '/',
  postcss: [
    require('autoprefixer')({
      // Vue does not support ie 8 and below
      browsers: ['last 2 versions', 'ie > 8']
    }),
    require('postcss-nested')
  ],
}
