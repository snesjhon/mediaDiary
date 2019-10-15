/**
 * WEBPACK PRODUCTION
 * ---
 * Using the `common.js` we can solely focus on what matters in production.
 * - The mode, the devTool, and the output.
 * - Again, we remove the stats because I don't find it useful to know that something has been compiled.
 * - SourceMaps should reveal what you've compiled but only help you in what you've compiled. This is
 * 	 def a personal opinion.
 */

const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.base.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "[name].[chunkhash].js",
    publicPath: "/",
    sourceMapFilename: "[name].js.map"
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
});
