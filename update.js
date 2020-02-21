let { spawn } = require('child_process')

let show = require('./show')

module.exports = async function update (print, cwd, filter) {
  let spawned = spawn('npx', ['jest', '--no-install', '-u'], {
    cwd, stdio: 'inherit'
  })

  spawned.on('exit', () => {
    print('')
    show(print, cwd, filter)
  })
}
