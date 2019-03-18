
    
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const WebpackConfig = require(`./webpack.config`)

const app = express()
const compiler = webpack(WebpackConfig)


app.use(webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    chunks: false
  }
}))


app.use(express.static(__dirname))

const port = process.env.PORT || 8081
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
