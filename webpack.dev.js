
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

module.exports = merge(common, {
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "/123/dist",
      watch: true,
    },
    watchFiles: ["src/**/*", "dist/**/*"],
  },
});
