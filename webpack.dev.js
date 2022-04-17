/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-env node */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common({isProd: false}), {
  devtool: 'source-map',
  devServer: {
    watchFiles: ['src/**/*', 'dist/**/*'],
    devMiddleware: {
      publicPath: '/dist/',
    }
  },
});
