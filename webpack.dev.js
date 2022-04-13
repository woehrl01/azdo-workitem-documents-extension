
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");

module.exports = merge(common("dev"), {
  devtool: "source-map",
  devServer: {
    watchFiles: ["src/**/*", "dist/**/*"],
    devMiddleware: {
      publicPath: "/dist/",
    }
  },
});
