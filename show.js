let { promisify } = require('util')
let { gray } = require('colorette')
let { join } = require('path')
let fs = require('fs')

let find = require('./find')

let readFile = promisify(fs.readFile)

module.exports = async function show (print, cwd, filter) {
  let { snaps, tests } = await find(cwd)

  let results = {}
  await Promise.all(
    snaps.map(async file => {
      let content = await readFile(join(cwd, file))
      results[file] = content.toString()
    })
  )

  snaps.forEach((file, idx) => {
    results[file]
      .split('exports[`')
      .filter(str => !str.startsWith('// '))
      .filter(str => !filter || str.includes(filter))
      .forEach(str => {
        if (str.trim().length === 0) return
        let [name, body] = str.replace(/"\s*`;\s*$/, '').split(/`] = `\s*"?/)
        let title = `${tests[idx]} ${name}`.replace(/ 1$/, '')
        print(gray(`${title}:`))
        print(body.replace(/\\\\"/g, '"').replace(/\\`/g, '`'))
      })
  })
}
