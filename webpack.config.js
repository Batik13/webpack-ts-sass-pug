const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const globule = require("globule");
const fs = require("fs");

const config = {
  mode: 'development',
  devtool: 'source-map',
}
if (process.env.NODE_ENV === 'production') {
  config.mode = 'production';
  config.devtool = 'hidden-source-map';
}

const mixins = globule
  .find(["src/pug/blocks/libs/**/_*.pug", "!src/pug/blocks/libs/_libs.pug"])
  .map((path) => path.split('/').pop())
  .reduce((acc, currentItem) => acc + `include ${currentItem}\n`, ``);

fs.writeFile("src/pug/blocks/libs/_libs.pug", mixins, (err) => {
  if (err) throw err;
  console.log("Mixins are generated automatically!");
});

const paths = globule.find(["src/pug/pages/**/*.pug"]);

fs.writeFile("src/pug/temp/_environment.pug", `block variables\n\  - var ENV = '${process.env.NODE_ENV}'`, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("Environment variable file created.");
});

module.exports = {
  mode: config.mode,
  entry: {
    scripts: './src/index.ts',
  },
  output: {
    filename: 'assets/js/[name].js',
    assetModuleFilename: "assets/img/[name][ext][query]",
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/styles.css'
    }),
    ...paths.map((path) => {
      return new HtmlWebpackPlugin({
        template: path,
        filename: `${path.split(/\/|.pug/).splice(-2, 1)}.html`,
      });
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
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        exclude: /(node_modules|bower_components)/,
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
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
}