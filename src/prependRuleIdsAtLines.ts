export default function prependRuleIdsAtLines(
  source: Buffer | string,
  insertions: RuleIdsByLine,
) {
  let lines = source.toString().split("\n")

  let offset = 0

  Object.entries(insertions).forEach(([lineNumber, ruleIds]) => {
    const adjustedLineNumber = +lineNumber + offset - 1

    const indentation = lines[adjustedLineNumber].match(/^\s*/)![0]

    const ruleList = Array.from(ruleIds).join(", ")
    const ignoreString = `// eslint-disable-next-line ${ruleList}`
    lines.splice(adjustedLineNumber, 0, indentation + ignoreString)

    offset++
  })

  return lines.join("\n")
}
