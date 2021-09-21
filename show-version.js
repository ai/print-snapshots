import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { bold } from 'nanocolors'
import { join } from 'path'

export function showVersion(print) {
  let pkg = readFileSync(
    join(fileURLToPath(import.meta.url), '..', 'package.json')
  )
  print(`print-shapshots ${bold(JSON.parse(pkg).version)}`)
}
