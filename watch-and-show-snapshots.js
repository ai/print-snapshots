let fs = require('fs')
let chokidar = require('chokidar')
let parseGitignore = require('parse-gitignore')

let updateAndShowSnaphots = require('./update-and-show-snapshots')

module.exports = async function watchAndShowSnaphots (print, cwd, filter) {
  let ignored = ['.git', 'node_modules']

  if (fs.existsSync(`${ cwd }/.gitignore`)) {
    ignored = [...new Set([
      ...ignored,
      ...parseGitignore(fs.readFileSync(`${ cwd }/.gitignore`)).map(
        p => /\/$/.test(p) ? p.replace(/\/$/, '') : p
      )
    ])]
  }

  let watcher = chokidar.watch('**/*.js', {
    cwd, ignored
  })

  return watcher
    .on('change', async () => {
      await updateAndShowSnaphots(print, cwd, filter)
    })
}
