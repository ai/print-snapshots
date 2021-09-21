#!/usr/bin/env node

import { red } from 'nanocolors'

import { showVersion } from './show-version.js'
import { showHelp } from './show-help.js'
import { update } from './update.js'
import { watch } from './watch.js'
import { show } from './show.js'

function error(message) {
  process.stderr.write(red(message) + '\n')
}

function print(...lines) {
  process.stdout.write(lines.join('\n') + '\n')
}

async function run() {
  let cwd = process.cwd()

  let args = {}

  for (let i = 2; i < process.argv.length; i++) {
    let arg = process.argv[i]
    if (arg === '--version') {
      args.version = true
    } else if (arg === '--help' || arg === '-h') {
      args.help = true
    } else if (arg === '--update' || arg === '-u') {
      args.update = true
    } else if (arg === '--watch' || arg === '-w') {
      args.watch = true
    } else if (!arg.startsWith('-') && !args.filter) {
      args.filter = arg
    } else {
      error(`Unknown argument ${arg}\n`)
      showHelp(print)
      process.exit(1)
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
