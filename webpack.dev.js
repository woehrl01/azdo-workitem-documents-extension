/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-env node */

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');

let enableHttps = false
if (fs.existsSync('/certs/localhost.key')) {
  enableHttps = true
}

module.exports = merge(common({ isProd: false }), {
  devtool: 'source-map',
  devServer: {
    watchFiles: ['src/**/*', 'dist/**/*'],
    devMiddleware: {
      publicPath: '/dist/',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    server: enableHttps ? {
      type: 'https',
      options: {
        key: fs.readFileSync('/certs/localhost.key'),
        cert: fs.readFileSync('/certs/localhost.pem'),
        requestCert: false,
      },
    } : {}
  },
});
