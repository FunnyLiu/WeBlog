
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
    hot: true,
    host: 'localhost',
    stats: {
        colors: true
    }
};
//设置配置
webpackDevServer.addDevServerEntrypoints(config, options);

var compiler = webpack(config);
var server = new webpackDevServer(compiler, options);

server.listen(8081, 'localhost', () => {
    console.log('dev server listening on port 8081');
});