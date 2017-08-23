const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractCss = new ExtractTextPlugin('[name].[chunkhash].css');
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const publicPath = '_REPL_ASSETS_HOST_';
const cssVariablesPath = path.resolve(__dirname, './src/css/_variables.scss');

let extractWebfontCssLoader = ['style-loader', 'css-loader'];
if (isProd) {
  extractWebfontCssLoader = extractCss.extract({
    fallback: "style-loader",
    use: [
      {
        loader: 'css-loader',
        options: {
          url: false,
        }
      }
    ]
  });
}

let thirdPartyLibs = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/moment/min/moment.min.js',
  './node_modules/moment-duration-format/lib/moment-duration-format.js',
  './node_modules/moment/locale/zh-cn.js',
  './node_modules/fastclick/lib/fastclick.js',
];
thirdPartyLibs = thirdPartyLibs.map(function (scriptPath) {
  return path.resolve(__dirname, scriptPath);
});

const sharedFiles = [].concat(glob.sync('./src/store/**/*', {nodir: true}), glob.sync('./src/shared/**/*', {nodir: true})).map(function (scriptPath) {
  return path.resolve(__dirname, scriptPath);
});

// from angular-cli
const packageChunkSort = function (packages) {
  return function sort(left, right) {
    const leftIndex = packages.indexOf(left.names[0]);
    const rightindex = packages.indexOf(right.names[0]);
    if (leftIndex < 0 || rightindex < 0) {
      return 1;
    }
    if (leftIndex > rightindex) {
      return 1;
    }
    return -1;
  };
};

const assetsRepalcementOption = {
  flags: isProd ? "g" : '',
  search: isProd ? "/assets/" : '',
  replace: isProd ? publicPath + "/assets/" : ''
};
const assetsReplacementLoader = 'string-replace-loader?' + JSON.stringify(assetsRepalcementOption);
const config = {
  entry: {
    'global': thirdPartyLibs,
    'libs': ['vue', 'vue-router', 'vuex', 'vuex-router-sync', 'vee-validate', 'axios', 'autosize', 'vee-validate/dist/locale/zh_CN'],
    'shared': sharedFiles,
    'main': './src/main.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash].js',
    publicPath: isProd ? publicPath : '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            require('autoprefixer')(),
            require('cssnano')({
              preset: ['default', {
                discardComments: {
                  removeAll: true,
                },
              }],
            }),
          ],
          preLoaders: {
            scss: "sass-variables-inject-loader?" + cssVariablesPath,
          },
          postLoaders: {
            ts: assetsReplacementLoader,
            scss: assetsReplacementLoader,
            html: assetsReplacementLoader,
          },
          extractCSS: isProd,
          preserveWhitespace: false,
        },
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[chunkhash]'
        }
      },
      {
        test: /\.js$/,
        use: ['script-loader'],
        include: thirdPartyLibs,
      },
      {
        test: /\.font\.(js|json)$/,
        use: [
          ...extractWebfontCssLoader,
          {
            loader: 'webfonts-loader',
            options: {
              fileName: 'assets/[chunkhash]-[fontname].[ext]'
            },
          },
        ],
      },
      {
        enforce: 'post',
        test: /\.(ts|js|scss|css)$/,
        loader: assetsReplacementLoader,
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.vue', '.js', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
  devServer: {
    contentBase: 'src',
    historyApiFallback: true,
    port: 9000,
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: {
      // Add chunk information (setting this to `false` allows for a less verbose output)
      chunks: true,
      // Add built modules information to chunk information
      chunkModules: true,
      // Add the origins of chunks and chunk merging info
      chunkOrigins: true,
      // Add built modules information
      modules: true,
    },
  },
  stats: {
    // Add chunk information (setting this to `false` allows for a less verbose output)
    chunks: true,
    // Add built modules information to chunk information
    chunkModules: true,
    // Add the origins of chunks and chunk merging info
    chunkOrigins: true,
    // Add built modules information
    modules: true,
  },
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunksSortMode: packageChunkSort(['manifest', 'global', 'libs', 'shared', 'main']),
      template: path.resolve(__dirname, './src/index.html'),
    }),
    new webpack.NormalModuleReplacementPlugin(
      // This plugin is responsible for swapping the environment files.
      // Since it takes a RegExp as first parameter, we need to escape the path.
      // See https://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
      new RegExp(path.resolve(__dirname, './src/env/environment.ts')
        .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')), path.resolve(__dirname, "./src/env/environment" + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '') + ".ts")
    ),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['shared', 'libs', 'global', 'manifest'],
      minChunks: 2,
    }),
    // new webpack.optimize.ModuleConcatenationPlugin(), // module concatenation: https://medium.com/webpack/webpack-freelancing-log-book-week-5-7-4764be3266f5
  ]
};

if (isProd) {
  config.devtool = 'source-map';
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    extractCss,
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin([
      {from: path.resolve(__dirname, './src/assets'), to: path.resolve(__dirname, './dist/assets')},
    ]),
  ]);
}

module.exports = config;
