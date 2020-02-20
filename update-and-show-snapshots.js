let { spawn } = require('child_process')

let showSnapshots = require('./show-snapshots')

async function updateAndShowSnaphots (print, cwd, filter) {
  let spawned = spawn('npx', ['jest', '--no-install', '-u'], {
    cwd, stdio: 'inherit'
  })

  spawned.on('exit', () => {
    print('\n')
    showSnapshots(print, cwd, filter)
  })
}

module.exports = updateAndShowSnaphots
