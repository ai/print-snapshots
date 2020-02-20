let fs = require('fs')
let path = require('path')
let chokidar = require('chokidar')
let parseGitignore = require('parse-gitignore')

let updateAndShowSnaphots = require('./update-and-show-snapshots')

let rootPath = path.dirname(require.main.filename)

async function watchAndShowSnaphots (print, error, cwd, filter) {
  let ignored = ['.git', 'node_modules']

  if (fs.existsSync(`${ rootPath }/.gitignore`)) {
    ignored = [...new Set([
      ...ignored,
      ...parseGitignore(fs.readFileSync(`${ rootPath }/.gitignore`)).map(
        p => /\/$/.test(p) ? p.replace(/\/$/, '') : p
      )
    ])]
  }

  let watcher = chokidar.watch('**/*.js', {
    cwd, ignored
  })

  watcher
    .on('change', () => updateAndShowSnaphots(print, cwd, filter))
    .on('error', err => error(err.stack || err))
}

module.exports = watchAndShowSnaphots
