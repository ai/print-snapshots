let chalk = require('chalk')

let y = chalk.yellow
let b = chalk.bold

module.exports = function showHelp (print) {
  print(
    b('Usage: ') + 'npx print-shapshots [FILTER]',
    'Show Jest snapshots of current project',
    '',
    b('Arguments:'),
    '  ' + y('--version') + '   Show version',
    '  ' + y('--help') + '   Show this message'
  )
}
