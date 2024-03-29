import { sep } from 'path'
import glob from 'fast-glob'

export async function find(cwd) {
  let files = await glob('**/*.snap', {
    cwd,
    ignore: ['node_modules']
  })

  if (files.length === 0) {
    let err = Error('Snapshots were not found')
    err.own = true
    throw err
  }

  let snaps = files.sort().reverse()
  let tests = snaps.map(snap =>
    snap.replace(/\.snap$/, '').replace('__snapshots__' + sep, '')
  )

  return { snaps, tests }
}
