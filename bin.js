#!/usr/bin/env node

let chalk = require('chalk')

let showSnapshots = require('./show-snapshots')
let showVersion = require('./show-version')
let showHelp = require('./show-help')
let updateSnapshots = require('./update-snapshots')

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
  } else if (arg === '--update') {
    updateSnapshots(process.cwd())
  } else if (arg.startsWith('--')) {
    error(`Unknown argument ${ arg }\n`)
    showHelp(print)
    process.exit(1)
  } else {
    await showSnapshots(print, process.cwd(), arg)
  }
}

run().catch(e => {
  if (e.own) {
    error(e.message)
  } else {
    error(e.stack)
  }
  process.exit(1)
})
