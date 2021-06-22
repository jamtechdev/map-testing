const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
  module.exports = {
    mode:"development",
    entry: {
       app: './src/index.js',
    },
    target: 'web',
   //devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        host:"localhost",
        port: 9000,
     hot:true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },            // Fonts
          {
              test: /\.(ttf|eot|woff|woff2)$/,
              loader: "file-loader",
              options: {
                  name: "fonts/[name].[ext]",
              }
          },
          // Files
          {
              test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
              loader: "file-loader",
              options: {
                  name: "static/[name].[ext]",// outputPath: 'images'
              }
          }
        ],
      },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Image map',
        inject: true,
        hash: true,
        template: './src/index.html',
        filename: 'index.html' 
      }),
      new CopyWebpackPlugin({patterns:[
        {from: path.resolve(__dirname,'src/images'),to:'images'},
        {from: path.resolve(__dirname,'src/data'),to:'data'}
    ]})
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
  };
