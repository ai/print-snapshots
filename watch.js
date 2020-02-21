let fs = require('fs')
let path = require('path')
let chokidar = require('chokidar')
let pkgUp = require('pkg-up')
let parseGitignore = require('parse-gitignore')

let update = require('./update')

module.exports = async function watch (print, error, cwd, filter) {
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
    .on('change', () => update(print, cwd, filter))
    .on('error', err => error(err.stack || err))
}
