const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const packageJson = require('./package.json')

const serverPublic = path.join(__dirname, 'server', 'public')

module.exports = {
  // mode: 'production',
  mode: 'development',
  entry: './client/js/app.js',
  output: {
    path: serverPublic,
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: './client', from: '*.html' },
      { context: './client', from: '*.css' },
      { context: './client', from: 'templates/**/*.html' },
      { context: './client', from: 'assets/**/*.{png,gif,jpg}' }
    ]),
    new HtmlWebpackPlugin({
      template: './client/index.html',
      version: packageJson.version
    })
  ],
  devtool: 'source-map',
  devServer: {
    contentBase: serverPublic,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
