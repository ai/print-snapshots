let { exec } = require('child_process')
let { promisify } = require('util')
let chalk = require('chalk')

let showSnapshots = require('./show-snapshots')

let execCommand = promisify(exec)

async function updateAndShowSnaphots (print, error, cwd, filter) {
  print(chalk.blue('\nUpdating snapshots... \n'))

  let { stdout, stderr } = await execCommand('"./node_modules/.bin/jest" -u', {
    cwd
  })

  print(chalk.grey(stdout))
  error(stderr)

  print(chalk.green('Snapshots updated! \n'))

  await showSnapshots(print, cwd, filter)
}

module.exports = updateAndShowSnaphots
