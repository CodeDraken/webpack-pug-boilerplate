// generate HTML files
const HtmlWebpackPlugin = require('html-webpack-plugin')
// generate CSS files
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const glob = require('glob-all')
const PurifyCSSPlugin = require('purifycss-webpack')

const path = require('path')

const prod = process.env.NODE_ENV === 'production'
const cssDev = [ 'style-loader', 'css-loader', 'postcss-loader', 'sass-loader' ]
const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [ 'css-loader', 'postcss-loader', 'sass-loader' ],
  publicPath: '/dist'
})

const config = {
  entry: {
    index: './src/scripts/index.js',
    about: './src/scripts/about.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'scripts/[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: prod ? cssProd : cssDev
      },

      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      },

      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader']
      },

      {
        test: /\.(png|jpg|svg|gif)$/,
        use: [
          'file-loader?name=images/[name].[ext]',
          'image-webpack-loader'
        ]
      }
    ]
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
    hot: true,
    stats: 'errors-only'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Homepage',
      minify: {
        collapseWhitespace: prod
      },
      hash: true,
      template: './src/index.pug',
      chunks: [ 'index' ]
    }),

    new HtmlWebpackPlugin({
      title: 'About',
      filename: 'about.html',
      minify: {
        collapseWhitespace: prod
      },
      hash: true,
      template: './src/about.pug',
      chunks: ['about']
    }),

    new ExtractTextPlugin({
      filename: 'stylesheets/index.css',
      disable: !prod,
      allChunks: true
    }),

    // hot module reloading
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    // remove unused CSS
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/*.pug'))
    })
  ]
}

module.exports = config
