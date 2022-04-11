const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = {};

// Loop through subfolders in the "Code" folder and add an entry for each one
const codeDir = path.join(__dirname, "src/Code");
fs.readdirSync(codeDir).filter((dir) => {
  if (fs.statSync(path.join(codeDir, dir)).isDirectory()) {
    entries[dir] =
      "./" + path.relative(process.cwd(), path.join(codeDir, dir, dir));
  }
});

module.exports = {
  entry: entries,
  output: {
    filename: "[name]/[name].js",
    publicPath: "dist",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "azure-devops-extension-sdk": path.resolve(
        "node_modules/azure-devops-extension-sdk"
      ),
    },
  },
  stats: {
    warnings: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "azure-devops-ui/buildScripts/css-variables-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.woff$/,
        use: [
          {
            loader: "base64-inline-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        loader: "file-loader",
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:7].[ext]',
              publicPath: '',
            },
          },
        ],

      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "**/*.html", context: "src/Code" }],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
