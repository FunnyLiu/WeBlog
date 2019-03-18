
module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
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
  }
};
