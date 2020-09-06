const path = require("path");
const merge = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const common = require("./webpack.base.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "[name].[chunkhash].js",
    publicPath: "/",
    sourceMapFilename: "[name].js.map",
    path: path.resolve(__dirname + "/../", "dist"),
  },
  plugins: [new CopyPlugin(["manifest.json"], { from: "../", to: "./dist" })],
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
    version: false,
  },
});
