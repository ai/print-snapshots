#!/usr/bin/env node

let chalk = require('chalk')

let showVersion = require('./show-version')
let showHelp = require('./show-help')

function error (message) {
  process.stderr.write(chalk.red(message) + '\n')
}

function print (...lines) {
  process.stdout.write(lines.join('\n') + '\n')
}

async function run () {
  let arg = process.argv[2] || ''
  if (arg === '--version') {
    showVersion(print)
  } else if (arg === '--help') {
    showHelp(print)
  } else if (arg.startsWith('--')) {
    error(`Unknown argument ${ arg }\n`)
    showHelp(print)
    process.exit(1)
  }
}

run().catch(e => {
  error(e.stack)
  process.exit(1)
})
