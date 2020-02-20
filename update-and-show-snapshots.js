let { spawn } = require('child_process')
let chalk = require('chalk')

let showSnapshots = require('./show-snapshots')

async function updateAndShowSnaphots (print, cwd, filter) {
  print(chalk.blue('\nUpdating snapshots... \n'))

  let spawned = spawn('npx', ['jest', '--no-install', '-u'], {
    cwd, stdio: 'inherit'
  })

  spawned.on('exit', async () => {
    print('\n')
    await showSnapshots(print, cwd, filter)
  })
}

module.exports = updateAndShowSnaphots
