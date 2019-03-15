const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: process.env.NODE_ENV || 'development',

    entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
        const fullDir = path.join(__dirname, dir)
        const entry = path.join(fullDir, 'app.js')
        if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
            entries[dir] = [ entry]
        }

        return entries
    }, {}),

    output: {
        path: path.join(__dirname, '__build__'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/__build__/'
    },

    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: {
                loader:'babel-loader',
                options:{
                    presets:['@babel/preset-react']
                }
            }},
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: 'shared',
                    filename: 'shared.js',
                    chunks: 'initial'
                }
            }
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};