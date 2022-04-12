
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require("compression-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common("prod"), {
  plugins:
    [
      new CompressionPlugin({
        test: /\.js(\?.*)?$/i,
        algorithm: "gzip",
        deleteOriginalAssets: false,
      }),
    ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            defaults: true,
            pure_funcs: [
              'console.log',
              'console.debug',
            ]
          },
          format: {
            comments: false,
          },
        },
        extractComments: false
      })
    ]
  }
});
