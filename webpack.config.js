const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const packageJson = require('./package.json')

const serverPublic = path.join(__dirname, 'server', 'public')

module.exports = {
  // mode: 'production',
  mode: 'development',
  entry: './src/js/app.js',
  output: {
    path: serverPublic,
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { context: './src', from: '*.html' },
      { context: './src', from: '*.css' },
      { context: './src', from: 'templates/**/*.html' },
      { context: './src', from: 'assets/**/*.{png,gif,jpg}' }
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
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
