#!/usr/bin/env node

import getStdin from "get-stdin"
import meow from "meow"
import chalk from "chalk"

import start from "."

const cli = meow(
  `
  Usage
    $ eslint --format json . | ${chalk.green(
      "eslint-ignore-inserter [options]",
    )}

  Options
    --dry-run,    -d ${chalk.gray("Print files without changing them")}
    --add-fix-me, -f ${chalk.gray(
      `Add a ${chalk.yellow("// FIXME")} comment along with the eslint ignores`,
    )}
`,
  {
    flags: {
      dryRun: {
        type: "boolean",
        alias: "d",
      },
      addFixMe: {
        type: "boolean",
        alias: "f",
      },
    },
  },
)

getStdin().then((stdin) => {
  if (!stdin) {
    cli.showHelp()
  }

  start(stdin, cli.flags as Options)
})
