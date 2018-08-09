import * as fs from "fs"
import * as path from "path"

import { Validator } from "jsonschema"

const schema = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "eslint.schema.json")).toString(),
)

export default function parseESLintOutput(eslintOutput: string) {
  const validator = new Validator()
  const parsed = JSON.parse(eslintOutput)
  validator.validate(parsed, schema, { throwError: true })

  return parsed as ESLintResult[]
}
