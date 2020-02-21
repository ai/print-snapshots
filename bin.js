#!/usr/bin/env node

let chalk = require('chalk')
let argv = require('command-line-args')

let showSnapshots = require('./show-snapshots')
let updateAndShowSnaphots = require('./update-and-show-snapshots')
let watchAndShowSnaphots = require('./watch-and-show-snapshots')
let showVersion = require('./show-version')
let showHelp = require('./show-help')

let cwd = process.cwd()
let argsSchema = [
  {
    name: 'version',
    type: Boolean
  },
  {
    name: 'help',
    type: Boolean
  },
  {
    name: 'update',
    type: Boolean
  },
  {
    name: 'watch',
    type: Boolean
  },
  {
    name: 'filter',
    type: String,
    defaultOption: true
  }
]

function error (message) {
  process.stderr.write(chalk.red(message) + '\n')
}

function print (...lines) {
  process.stdout.write(lines.join('\n') + '\n')
}

async function run () {
  try {
    let args = argv(argsSchema)

    if (args.version) {
      showVersion(print)
    } else if (args.help) {
      showHelp(print)
    } else if (args.update) {
      await updateAndShowSnaphots(print, cwd, args.filter)
    } else if (args.watch) {
      await watchAndShowSnaphots(print, error, cwd, args.filter)
    } else {
      await showSnapshots(print, cwd, args.filter)
    }
  } catch (e) {
    if (e.name === 'UNKNOWN_OPTION') {
      error(`Unknown argument ${ e.optionName }\n`)
      showHelp(print)
      process.exit(1)
    } else {
      throw e
    }
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
