const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  mode: 'development',
  devtool: 'source-map',
}
if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
  config.devtool = 'hidden-source-map';
}

module.exports = {
  mode: config.mode,
  entry: {
    scripts: './src/index.ts',
  },
  output: {
    filename: 'js/[name].js',
    assetModuleFilename: "assets/[name][ext][query]",
    clean: true,
  },
  devServer: {
    open: true,
    static: {
      directory: './src',
      watch: true
    }
  },
  devtool: config.devtool,
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: "./src/pug/pages/index.pug"
    }),
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: "./src/pug/pages/404.pug"
    })
  ],
  module: {
    rules: [{
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          (config.mode === 'development') ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      // {
      //   test: /\.svg$/,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'images/[name][ext]'
      //   },
      //   use: 'svgo-loader'
      // },
      // {
      //   test: /\.(png)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'images/[name][ext][query]',
      //   },
      // },
      // {
      //   test: /\.(jpg)$/i,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'images/[name][ext][query]',
      //   },
      // },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: {
          //     presets: ['@babel/preset-env']
          // }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
}