var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./internals/webpack/webpack.dev.babel')

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  historyApiFallback: true,
  publicPath: "http://localhost:8001/static/",
  headers: {
    "Access-Control-Allow-Origin": "\*"
  },
}).listen(8001, '127.0.0.1', function (err, result) {
  if (err) {
    console.log(err)
  }

  console.log('Listening at 127.0.0.1:8001')
})
