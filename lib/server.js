const express = require('express')
const bodyParser = require('body-parser')
const httpProxy = require('http-proxy-middleware')
const cors = require('cors')
const _ = require('lodash')
const chalk = require('chalk')
const zlib = require('zlib')
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const prettier = require('prettier')

var render = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../src/response.ejs'), 'utf8'))

function onProxyRes(proxyResponse, request, response, opts) {
  if (proxyResponse.statusCode !== 200) return
  let body = new Buffer([])

  proxyResponse.on('data', function(data) {
    body = Buffer.concat([body, data])
  })

  proxyResponse.on('end', function() {
    const bodyString = zlib.gunzipSync(body).toString('utf-8')

    const renderedResult = render({
      req: request,
      res: response,
      body: bodyString,
      fileType: opts.fileType
    })

    fs.writeFileSync(
      path.resolve(
        process.env.PWD,
        `${opts.responsePath}/${request.method}.${request.path
          .split('/')
          .slice(1)
          .join('.')}.js`
      ),
      prettier.format(renderedResult, { parser: 'babel', semi: false, singleQuote: true })
    )
  })
}

function server(routes, opts = {}) {
  const proxyOptions = {
    target: opts.target,
    pathRewrite: {},
    router: {},
    changeOrigin: true
  }

  if (opts.saveResponse) {
    proxyOptions.onProxyRes = (proxyResponse, req, res) =>
      onProxyRes(proxyResponse, req, res, {
        fileType: opts.fileType,
        responsePath: opts.responsePath
      })
  }

  const apiProxy = httpProxy(proxyOptions)

  const app = express()
  app.use(cors())

  app.use('/', (req, res, next) => {
    const response = _.get(routes, `${req.method}${req.path.split('/').join('.')}.response`)

    if (response) {
      res.send(response)
    } else {
      next()
    }
  })

  app.use('/', apiProxy)

  app.listen(opts.port, () => {
    console.log(chalk.green(`Running on http://localhost:${opts.port}`))
  })
}

module.exports = server
