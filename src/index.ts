import chalk from "chalk"

import { ValidationError } from "jsonschema"

import parseESLintOutput from "./parseESLintOutput"
import normalizeESLintOutput from "./normalizeESlintOutput"
import updateFile from "./updateFile"

export default function (rawEslintOutput: string, options: Options) {
  try {
    const output = parseESLintOutput(rawEslintOutput)

    const normalizedResults = normalizeESLintOutput(output)

    normalizedResults.forEach((result) => {
      if (options.dryRun) {
        console.log("dry run for file")
      } else {
        updateFile(result, options.addFixMe)
      }
    })
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error(
        chalk.red(
          "eslint-ignore-inserter: Failed to parse ESLint output as JSON.",
        ),
        chalk.red("\n\n×"),
        e.toString(),
      )
    } else if (e instanceof ValidationError) {
      console.error(
        chalk.red(
          "eslint-ignore-inserter: ESLint output does not match expected schema.",
        ),
        chalk.red("\n\n×"),
        e.toString(),
      )
    }

    console.error(chalk.underline.gray("\nOriginal error:\n"))
    throw e
  }
}
