/**
 * WEBPACK DEV
 * ---
 * Using webpack common we are able to have a simpler way of starting a dev server.
 * I've looked for a better webpack-dev-server, but there seems to not be a great alternative.
 * - there's alternatives, but they tend to be limited in scope. And althought they promise faster
 *    development they end up falling behind in other scenarios.
 * - `create-react-app` uses the same as well, I'm surprised that Facebook hasn't created their own.
 * - We take out the `stats` because at this point for me, it's no longer valuable to know that
 *   webpack has appropriately compiled all of the files. I just want to know that its compiled.
 *
 */

const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.base.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "cheap-module-source-map",
  output: {
    filename: "[name].js",
    publicPath: "/"
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    hot: true,
    inline: true,
    historyApiFallback: true,
    proxy: {
      "/api": "http://localhost:9000"
    },
    stats: {
      assets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      entrypoints: false,
      hash: false,
      modules: false,
      timings: false,
      version: false
    }
  }
});
