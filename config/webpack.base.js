/**
 * WEBPACK COMMON
 * ---
 * Webpack takes an entry and outputs a transpiled javascript. We can also have a devServer configuration.
 * Having a common file means that we're able to diverge two webpack environments without duplicating code.
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    app: path.resolve(__dirname + "/../", "src/index.tsx")
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "INSERT TITLE",
      template: path.resolve(__dirname + "/index.html"),
      inject: true
    }),
    new Dotenv({ systemvars: true })
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(tsx|ts)$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"]
      }
    ]
  }
};
