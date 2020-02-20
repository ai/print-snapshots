let { exec } = require('child_process')
let { promisify } = require('util')
let chalk = require('chalk')

let showSnapshots = require('./show-snapshots')

let execCommand = promisify(exec)

module.exports = async function updateAndShowSnaphots (print, cwd, filter) {
  print(chalk.blue('Updating snapshots... \n'))

  await execCommand('"./node_modules/.bin/jest" -u', {
    cwd
  })

  print(chalk.green('Snapshots updated! \n'))

  await showSnapshots(print, cwd, filter)
}
