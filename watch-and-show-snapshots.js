let fs = require('fs')
let path = require('path')
let chokidar = require('chokidar')
let pkgUp = require('pkg-up')
let parseGitignore = require('parse-gitignore')

let updateAndShowSnaphots = require('./update-and-show-snapshots')

async function watchAndShowSnaphots (print, error, cwd, filter) {
  let ignored = ['.git', 'node_modules']

  let rootPath = path.dirname(await pkgUp())
  let gitignorePath = `${ rootPath }/.gitignore`

  if (fs.existsSync(gitignorePath)) {
    ignored = [...new Set([
      ...ignored,
      ...parseGitignore(fs.readFileSync(gitignorePath)).map(
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
