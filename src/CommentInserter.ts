import fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

export default class CommentInserter {
  dryRun: boolean

  constructor (options: { dryRun: boolean } = { dryRun: false }) {
    this.dryRun = options.dryRun
  }

  insertComments (rules: RulesToIgnore) {
    Object.entries(rules).forEach(([filePath, lines]) => {
      fs.readFile(filePath, (err, data) => {
        const fileLines = data.toString().split('\n')

        // Increment this as we insert lines
        let offset = 0

        Object.entries(lines).forEach(([lineString, rules]) => {
          const line = parseInt(lineString, 10)
          const adjustedLine = line - 1 + offset

          const indentation = fileLines[adjustedLine].match(/^\s*/)[0]
          fileLines.splice(adjustedLine, 0, this._formatRules(indentation, rules))
          offset++
        })

        if (this.dryRun) {
          const relativePath = path.relative(process.cwd(), filePath)
          console.log(
            "%s\n\n%s\n\n",
            chalk.underline.green(relativePath),
            fileLines.join('\n')
          )
        } else {
          fs.writeFile(filePath, fileLines.join('\n'), (err) => {
            if (err) {
              console.error(err)
            }
          })
        }
      })
    })
  }

  _formatRules (indentation: string, rules: Set<string>) {
    const ruleString = Array.from(rules).join(', ')

    return `${indentation}// eslint-disable-next-line ${ruleString}`
  }
}
