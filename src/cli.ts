#!/usr/bin/env node

import getStdin from "get-stdin"
import meow from "meow"
import chalk from "chalk"

import start from "./index"

const cli = meow(
  `
  Usage
    $ eslint --format json . | ${chalk.green(
      "eslint-ignore-inserter [options]",
    )}

  Options
    --dry-run, -d ${chalk.gray("Print files without changing them")}
`,
  {
    flags: {
      dryRun: {
        type: "boolean",
        alias: "d",
      },
    },
  },
)

getStdin().then(stdin => {
  if (!stdin) {
    cli.showHelp()
  }

  start(stdin, cli.flags as Options)
})
