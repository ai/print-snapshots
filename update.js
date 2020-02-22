let { spawn } = require('child_process')

let find = require('./find')
let show = require('./show')

module.exports = async function update (print, cwd, filter) {
  let { tests } = await find(cwd)

  let spawned = spawn('npx', ['jest', '--no-install', '-u', ...tests], {
    cwd, stdio: 'inherit'
  })

  await new Promise(resolve => {
    spawned.on('exit', exitCode => {
      if (exitCode === 0) {
        print('')
        show(print, cwd, filter)
      }
      resolve()
    })
  })
}
