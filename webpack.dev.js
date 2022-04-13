
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

module.exports = merge(common("dev"), {
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname),
      publicPath: "",
      watch: true,
    },
    watchFiles: ["src/**/*", "dist/**/*"],
  },
});
