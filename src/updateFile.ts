import * as fs from "fs-extra"
import prependRuleIdsAtLines from "./prependRuleIdsAtLines"

export default async function updateFile(result: NormalizedResult) {
  const { filePath, messagesByLine } = result

  const source = await fs.readFile(filePath)
  const newSource = prependRuleIdsAtLines(source, messagesByLine)

  await fs.writeFile(filePath, newSource)
}
