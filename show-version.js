let chalk = require('chalk')

let pkg = require('./package.json')

module.exports = function showVersion (print) {
  print(`print-shapshots ${chalk.bold(pkg.version)}`)
}
