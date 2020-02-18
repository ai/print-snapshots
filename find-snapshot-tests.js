let { sep } = require('path')
let globby = require('globby')

module.exports = async function findSnapshotTests (cwd) {
  let snaps = await globby('**/*.snap', {
    cwd,
    ignore: ['node_modules']
  })

  if (snaps.length === 0) {
    let err = Error('Snapshots were not found')
    err.own = true
    throw err
  }

  return snaps
    .sort()
    .reverse()
    .map(snap => snap.replace(/.snap$/, '').replace('__snapshots__' + sep, ''))
}
