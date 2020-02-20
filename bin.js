#!/usr/bin/env node

let chalk = require('chalk')

let showSnapshots = require('./show-snapshots')
let updateAndShowSnaphots = require('./update-and-show-snapshots')
let watchAndShowSnaphots = require('./watch-and-show-snapshots')
let showVersion = require('./show-version')
let showHelp = require('./show-help')

let cwd = process.cwd()

function error (message) {
  process.stderr.write(chalk.red(message) + '\n')
}

function print (...lines) {
  process.stdout.write(lines.join('\n') + '\n')
}

async function run () {
  let arg = process.argv[2] || ''
  let filter = process.argv[3] || ''

  if (arg === '--version') {
    showVersion(print)
    return
  }

  if (arg === '--help') {
    showHelp(print)
    return
  }

  if (arg === '--update') {
    await updateAndShowSnaphots(print, cwd, filter)
    return
  }

  if (arg === '--watch') {
    (await watchAndShowSnaphots(print, cwd, filter))
      .on('error', err => error(err.stack || err))
    return
  }

  if (arg.startsWith('--')) {
    error(`Unknown argument ${ arg }\n`)
    showHelp(print)
    process.exit(1)
  }

  await showSnapshots(print, cwd, arg)
}

run().catch(e => {
  if (e.own) {
    error(e.message)
  } else {
    error(e.stack)
  }
  process.exit(1)
})
