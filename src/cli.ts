#!/usr/bin/env node

import getStdin from "get-stdin"
import meow from "meow"
import chalk from "chalk"

import start from "."
import type { Options } from "./types"

const cli = meow(
  `
  Usage
    $ eslint --format json . | ${chalk.green(
      "eslint-disable-inserter [options]",
    )}

  Options
    --dry-run,    -d ${chalk.gray("Print files without changing them")}
    --no-fix-me      ${chalk.gray(
      `Don't add ${chalk.yellow(
        "-- FIXME",
      )} comment along with the eslint ignores`,
    )}
`,
  {
    flags: {
      dryRun: {
        type: "boolean",
        alias: "d",
      },
      fixMe: {
        type: "boolean",
        default: true,
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
