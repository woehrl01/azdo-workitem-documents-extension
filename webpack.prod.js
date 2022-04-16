/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require("compression-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common({ isProd: true }), {
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
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        
      },
    },
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
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
      }),
    ]
  }
});
