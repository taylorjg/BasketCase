const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const packageJson = require('./package.json')

const BUILD_FOLDER = path.resolve(__dirname, "build")

module.exports = {
  mode: 'production',
  entry: './src/js/app.js',
  output: {
    path: BUILD_FOLDER,
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
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
    contentBase: BUILD_FOLDER,
  }
}
