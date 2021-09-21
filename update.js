import { spawn } from 'child_process'

import { find } from './find.js'
import { show } from './show.js'

export async function update(print, cwd, filter) {
  let { tests } = await find(cwd)

  let spawned = spawn('npx', ['jest', '--no-install', '-u', ...tests], {
    cwd,
    stdio: 'inherit'
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
