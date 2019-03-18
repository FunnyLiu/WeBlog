module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.bundle\.js$/,
        use: {
          loader:'bundle-loader',
          options:{
            lazy:true
          }
        }
      }
    ]
  }
};
