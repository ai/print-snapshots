let kleur = require('kleur')

let pkg = require('./package.json')

module.exports = function showVersion (print) {
  print(`print-shapshots ${kleur.bold(pkg.version)}`)
}
