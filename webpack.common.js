/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const PreloadPlugin = require("@vue/preload-webpack-plugin");

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

const apmSource = fs.readFileSync(path.join(__dirname, "./newrelic.apm.js"), "utf8");
const isEnableApm = false;

const createHtmlWebpackPluginEntry = (name, isProd) => {
  return new HtmlWebpackPlugin({
    template: "./src/Code/index.ejs",
    filename: `${name}.html`,
    chunks: [name],
    publicPath: "",
    apmSource: isProd && isEnableApm ? apmSource : "",
    scriptLoading: "defer"
  })
};

module.exports = ({ isProd }) => {
  return {
    entry: entries,
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "dist"),
      publicPath: "auto",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        "azure-devops-extension-sdk": path.resolve("node_modules/azure-devops-extension-sdk"),
        "react": "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",     // Must be below test-utils
        "react/jsx-runtime": "preact/jsx-runtime"
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
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  exportLocalsConvention: "dashesOnly",
                  mode: "local",
                  auto: true,
                  exportGlobals: true,
                }
              }
            },
            "azure-devops-ui/buildScripts/css-variables-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader"
          ],
        },
        {
          test: /\.woff$/,
          type: "asset/resource",
        },
        {
          test: /\.png$/,
          type: "asset/resource",
        }
      ],
    },
    plugins: [
      ...Object.entries(entries)
        .map(([name]) => createHtmlWebpackPluginEntry(name, isProd)),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new PreloadPlugin({
        rel: "preload",
        include: "allAssets",
        fileWhitelist: [/\.woff$/, /\.png$/],
        as(entry) {
          if (/\.woff$/.test(entry)) return "font";
          if (/\.png$/.test(entry)) return "image";
          return "script";
        }
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new ESLintPlugin({
        emitError: true,
        emitWarning: true,
        failOnError: true,
        failOnWarning: true,
        extensions: ["ts", "tsx", "js", "jsx"],
      }),
    ],
  }
};
