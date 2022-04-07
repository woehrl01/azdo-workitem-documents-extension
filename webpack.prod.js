
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require("compression-webpack-plugin")

module.exports = merge(common, {
  plugins: 
  [  
   new CompressionPlugin({    
      test: /\.js(\?.*)?$/i,    
      algorithm: "gzip",    
      deleteOriginalAssets: false,  
    }),
  ],
});
