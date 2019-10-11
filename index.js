#!/usr/bin/env node

const cosmiconfig = require('cosmiconfig')
const chalk = require('chalk')
const server = require('./lib/server')
const _ = require('lodash')

const explorer = cosmiconfig('envoy')
const result = explorer.searchSync()

if (!result) {
  console.error(chalk.red('Config not found'))
  process.exit(1)
}

const DEFAULT_OPTIONS = {
  port: 3001,
  saveResponse: false,
  fileType: 'es6'
}

const options = {
  ...DEFAULT_OPTIONS,
  ...result.config
}

const checkOptions = _.difference(['target', 'routesPath'], Object.keys(result.config))

if (checkOptions.length > 0) {
  console.error(chalk.red(`Missing config key: ${checkOptions.join(', ')}`))
  process.exit(1)
}

if (options.saveResponse && !options.hasOwnProperty('responsePath')) {
  console.error(chalk.red('Missing config key: responsePath'))
  process.exit(1)
}

const routes = require(options.routesPath)

server(routes, options)
