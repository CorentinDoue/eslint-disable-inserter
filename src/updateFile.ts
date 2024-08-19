import * as fs from "fs-extra"
import prependRuleIdsAtLines from "./prependRuleIdsAtLines"
import ts from "typescript"
import type { NormalizedResult } from "./types"

export default async function updateFile(
  result: NormalizedResult,
  fixMe: boolean,
) {
  const { filePath, messagesByLine } = result

  // Read the TypeScript file content
  const sourceCode = fs.readFileSync(filePath, "utf-8")

  // Parse the file content
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const newSource = prependRuleIdsAtLines({
    source: sourceFile,
    insertions: messagesByLine,
    fixMe,
  })

  await fs.writeFile(filePath, newSource)
}
