const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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

const apmSource = fs.readFileSync(path.join(__dirname, './newrelic.apm.js'), 'utf8');

const createHtmlWebpackPluginEntry = (name, env) => {
  return new HtmlWebpackPlugin({
    template: "./src/Code/index.ejs",
    filename: `${name}.html`,
    chunks: [name],
    publicPath: '',
    apmSource: env === 'prod' ? apmSource : ''
  })
};

module.exports = (env) => {
  return {
    entry: entries,
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "dist"),
      publicPath: "",
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
          test: /\.png$/,
          type: "asset/resource",
        }
      ],
    },
    plugins: [
      ...Object.entries(entries).map(([name]) => createHtmlWebpackPluginEntry(name, env)),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  }
};
