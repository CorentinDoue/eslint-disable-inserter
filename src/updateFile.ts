import * as fs from "fs-extra"
import prependRuleIdsAtLines from "./prependRuleIdsAtLines"

export default async function updateFile(
  result: NormalizedResult,
  addFixMe: boolean,
) {
  const { filePath, messagesByLine } = result

  const sourceFile = await fs.readFile(filePath)
  const newSource = prependRuleIdsAtLines({
    source: sourceFile.toString(),
    insertions: messagesByLine,
    addFixMe,
  })

  await fs.writeFile(filePath, newSource)
}
