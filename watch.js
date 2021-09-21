import { dirname, resolve, parse, join } from 'path'
import { existsSync, readFileSync } from 'fs'
import parseGitignore from 'parse-gitignore'
import chokidar from 'chokidar'

import { update } from './update.js'

async function findUp(name, cwd = '') {
  let directory = resolve(cwd)
  let { root } = parse(directory)

  while (true) {
    let foundPath = await resolve(directory, name)

    if (existsSync(foundPath)) return foundPath
    if (directory === root) return undefined

    directory = dirname(directory)
  }
}

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

  let rootPath = dirname(await findUp('package.json', cwd))
  let gitignorePath = join(rootPath, '.gitignore')

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
