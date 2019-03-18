var path = require("path");

module.exports = {
  entry: {
    main:'./main.js'
  },
	optimization: {
		runtimeChunk: true
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].[chunkhash].js",
		chunkFilename: "[name].[chunkhash].js"
	}
};
