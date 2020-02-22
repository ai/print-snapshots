let { spawn } = require('child_process')

let find = require('./find')
let show = require('./show')

module.exports = async function update (print, cwd, filter) {
  let { tests } = await find(cwd)

  let spawned = spawn('npx', ['jest', '--no-install', '-u', ...tests], {
    cwd, stdio: 'inherit'
  })

  spawned.on('exit', () => {
    print('')
    show(print, cwd, filter)
  })
}
