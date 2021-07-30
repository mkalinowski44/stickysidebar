const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
   entry: {
      stickysidebar: './src/index.js',
   },
   output: {
      filename: "[name].js"
   },

   module: {
      rules: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: "babel-loader",
                  options: {
                     presets: ['@babel/preset-env']
                  }
               },
            ]
         },
         {
            test: /\.html$/,
            use: [
               {
                  loader: "html-loader",
               }
            ]
         },
      ]
   },

   plugins: [
      new HtmlWebPackPlugin({
         template: "./src/index.html",
         filename: "./index.html",
         inject: ['head']
      })
   ]
}