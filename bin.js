#!/usr/bin/env node

import parseArgs from 'command-line-args'
import { red } from 'nanocolors'

import { showVersion } from './show-version.js'
import { showHelp } from './show-help.js'
import { update } from './update.js'
import { watch } from './watch.js'
import { show } from './show.js'

const ARGS_SCHEMA = [
  {
    name: 'version',
    type: Boolean
  },
  {
    name: 'help',
    type: Boolean,
    alias: 'h'
  },
  {
    name: 'update',
    type: Boolean,
    alias: 'u'
  },
  {
    name: 'watch',
    type: Boolean,
    alias: 'w'
  },
  {
    name: 'filter',
    type: String,
    defaultOption: true
  }
]

function error(message) {
  process.stderr.write(red(message) + '\n')
}

function print(...lines) {
  process.stdout.write(lines.join('\n') + '\n')
}

async function run() {
  let cwd = process.cwd()

  let args
  try {
    args = parseArgs(ARGS_SCHEMA)
  } catch (e) {
    if (e.name === 'UNKNOWN_OPTION') {
      error(`Unknown argument ${e.optionName}\n`)
      showHelp(print)
      process.exit(1)
    } else {
      throw e
    }
  }

  if (args.version) {
    showVersion(print)
  } else if (args.help) {
    showHelp(print)
  } else if (args.update) {
    await update(print, cwd, args.filter)
  } else if (args.watch) {
    await watch(print, error, cwd, args.filter)
  } else {
    await show(print, cwd, args.filter)
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
