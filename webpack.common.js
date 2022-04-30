/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */

const optionalRequire = (name) => {
  try {
    return require(name);
  } catch (e) {
    return {};
  }
};

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PreloadPlugin = require('@vue/preload-webpack-plugin');
const customDefines = optionalRequire('./defines.js');

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = {};

// Loop through subfolders in the "features" folder and add an entry for each one
const codeDir = path.join(__dirname, 'src/features');
fs.readdirSync(codeDir).filter((dir) => {
  if (fs.statSync(path.join(codeDir, dir)).isDirectory()) {
    entries[dir] =
      './' + path.relative(process.cwd(), path.join(codeDir, dir));
  }
});

const createHtmlWebpackPluginEntry = (name) => {
  return new HtmlWebpackPlugin({
    template: './src/features/index.ejs',
    filename: `${name}.html`,
    chunks: [name],
    publicPath: '',
    title: name,
    scriptLoading: 'defer'
  })
};

module.exports = ({ isProd }) => {
  return {
    entry: entries,
    output: {
      filename: '[name].js',
      path: path.join(__dirname, 'dist'),
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        'react': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',     // Must be below test-utils
        'react/jsx-runtime': 'preact/jsx-runtime',
        /* the following, need to be in-sync with tsconfig.json:"compilerOptions.paths" */
        'hooks': path.resolve(__dirname, 'src/hooks'),
        'services': path.resolve(__dirname, 'src/services'),
        'components': path.resolve(__dirname, 'src/components'),
      },
    },
    stats: {
      warnings: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  exportLocalsConvention: 'dashesOnly',
                  mode: 'local',
                  auto: true,
                  exportGlobals: true,
                }
              }
            },
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ],
        },
        {
          test: /\.woff$/,
          type: 'asset/resource',
        },
        {
          test: /\.png$/,
          type: 'asset/resource',
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __APP_INSIGHTS__: JSON.stringify(customDefines.APP_INSIGHTS || process.env.APP_INSIGHTS),
        __DEV__: !isProd,
      }),
      ...Object.entries(entries)
        .map(([name]) => createHtmlWebpackPluginEntry(name)),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new PreloadPlugin({
        rel: 'preload',
        include: 'allAssets',
        fileWhitelist: [/\.woff$/, /\.png$/],
        as(entry) {
          if (/\.woff$/.test(entry)) return 'font';
          if (/\.png$/.test(entry)) return 'image';
          return 'script';
        }
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new ESLintPlugin({
        emitError: true,
        emitWarning: true,
        failOnError: true,
        failOnWarning: true,
        extensions: ['ts', 'tsx', 'js', 'jsx'],
      }),
    ],
  }
};
