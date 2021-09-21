import { existsSync, readFileSync } from 'fs'
import parseGitignore from 'parse-gitignore'
import { dirname } from 'path'
import chokidar from 'chokidar'
import pkgUp from 'pkg-up'

import { update } from './update.js'

function throttle(fn) {
  let next, running
  return () => {
    clearTimeout(next)
    next = setTimeout(async () => {
      await running
      running = fn()
    }, 200)
  }
}

export async function watch(print, error, cwd, filter) {
  let ignored = ['.git', 'node_modules']

  let rootPath = dirname(await pkgUp())
  let gitignorePath = `${rootPath}/.gitignore`

  if (existsSync(gitignorePath)) {
    ignored = [
      ...new Set([
        ...ignored,
        ...parseGitignore(readFileSync(gitignorePath)).map(p =>
          /\/$/.test(p) ? p.replace(/\/$/, '') : p
        )
      ])
    ]
  }

  let watcher = chokidar.watch('**/*.js', {
    cwd,
    ignored
  })

  watcher
    .on(
      'change',
      throttle(() => update(print, cwd, filter))
    )
    .on('error', err => error(err.stack || err))
}
