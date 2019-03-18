const  webpack = require('webpack') 

module.exports = {
  entry: {
    // 入口使用socket方式
    bundle1: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000','./main1.js'],
    bundle2: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000','./main2.js']
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules:[
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]
};
