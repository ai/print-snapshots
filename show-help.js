import { yellow as y, bold as b } from 'nanocolors'

export function showHelp(print) {
  print(
    b('Usage: ') + 'npx print-shapshots [FILTER]',
    'Show Jest snapshots of current project',
    '',
    b('Arguments:'),
    `  ${y('--version')},     Show version`,
    `  ${y('--help')},   ${y('-h')}   Show this message`,
    `  ${y('--update')}, ${y('-u')}   Update snapshots and show them`,
    `  ${y('--watch')},  ${y('-w')}   Run update on changes in *.js files`
  )
}
