/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const EslintPLugin = require("eslint-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV;

// 生产
var isProduction = NODE_ENV === "production";

module.exports = {
  mode: NODE_ENV,
  devtool: false,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
    hunkLoading: "jsonp",
  },
  devServer: {
    static: path.join(__dirname, "public"),
    host: "localhost",
    port: 9000,
    open: true,
    compress: isProduction,
    hot: true,
    watchFiles: ["src/**/*.js"],
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" },
      },
    },
  },
  resolve: {
    extensions: [".ts", ".js", "tsx", "jsx"],
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        type: "asset/source",
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
        parser: {
          //如果图片大小小于某个阈值，则base64,大于某个阈值输出单独文件
          dataUrlCondition: {
            maxSize: 1024 * 32,
          },
        },
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
          !isProduction && "ts-loader",
        ],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new EslintPLugin({
      extensions: [".js", ".ts", ".jsx", ".tsx"],
    }),
    new webpack.DefinePlugin({
      'process.env.MY_NODE_ENV': '123'
   })
  ],
};
