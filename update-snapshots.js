let childProcess = require('child_process')

let findSnapshotTests = require('./find-snapshot-tests')

module.exports = async function updateSnapshots (cwd) {
  let tests = await findSnapshotTests(cwd)

  let args = ['jest', '-u'].concat(tests)

  let child = childProcess.spawn('npx', args)

  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
}
