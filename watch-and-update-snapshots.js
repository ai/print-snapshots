let chokidar = require('chokidar')
let childProcess = require('child_process')

let findSnapshotTests = require('./find-snapshot-tests')

module.exports = async function watchAndUpdateSnaphots (cwd) {
  let tests = await findSnapshotTests(cwd)

  let watcher = chokidar.watch(tests, {
    cwd,
    ignored: ['node_modules']
  })

  watcher
    .on('change', path => {
      let child = childProcess.spawn('npx', ['jest', '-u', path])

      child.stdout.pipe(process.stdout)
      child.stderr.pipe(process.stderr)
    })
}
