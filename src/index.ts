import chalk from "chalk"

import { ValidationError } from "jsonschema"

import parseESLintOutput from "./parseESLintOutput"
import normalizeESLintOutput from "./normalizeESlintOutput"
import updateFile from "./updateFile"
import type { Options } from "./types"
import { formatDryRunMessage } from "./dryRunMessage"

export default function (rawEslintOutput: string, options: Options) {
  try {
    const output = parseESLintOutput(rawEslintOutput)

    const normalizedResults = normalizeESLintOutput(output)

    normalizedResults.forEach((result) => {
      if (options.dryRun) {
        console.log(formatDryRunMessage(result))
      } else {
        updateFile(result, options.fixMe)
      }
    })
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error(
        chalk.red(
          "eslint-disable-inserter: Failed to parse ESLint output as JSON.",
        ),
        chalk.red("\n\n×"),
        e.toString(),
      )
    } else if (e instanceof ValidationError) {
      console.error(
        chalk.red(
          "eslint-disable-inserter: ESLint output does not match expected schema.",
        ),
        chalk.red("\n\n×"),
        e.toString(),
      )
    }

    console.error(chalk.underline.gray("\nOriginal error:\n"))
    throw e
  }
}
