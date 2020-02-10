let { promisify } = require('util')
let { join, sep } = require('path')
let globby = require('globby')
let chalk = require('chalk')
let fs = require('fs')

let readFile = promisify(fs.readFile)

module.exports = async function showSnapshots (print, cwd, filter) {
  let snaps = await globby('**/test/**/*.snap', {
    cwd, ignore: ['node_modules']
  })

  if (snaps.length === 0) {
    let err = Error('Snapshots were not found')
    err.own = true
    throw err
  }

  let results = { }
  await Promise.all(snaps.map(async file => {
    let content = await readFile(join(cwd, file))
    results[file] = content.toString()
  }))

  snaps.sort().reverse().forEach(file => {
    let test = file
      .replace(/\.test\.js\.snap$/, '')
      .replace('__snapshots__' + sep, '')
    results[file].split('exports[`')
      .filter(str => !str.startsWith('// '))
      .filter(str => !filter || str.includes(filter))
      .forEach(str => {
        if (str.trim().length === 0) return
        let [name, body] = str.replace(/"\s*`;\s*$/, '').split(/`] = `\s*"?/)
        let title = `${ test }.test.js ${ name }`
        if (test === 'create-reporter') {
          if (body[0] === '{') return
          title = title.replace(/ 2$/, '')
        } else {
          title = title.replace(/ 1$/, '')
        }
        print(chalk.gray(`${ title }:`))
        print(body.replace(/\\\\"/g, '"').replace(/\\`/g, '`'))
      })
  })
}
