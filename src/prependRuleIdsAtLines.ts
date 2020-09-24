export const getDisabledErrors = (line: string): string[] => {
  const reg = /\/\/ eslint-disable-next-line (.*)/
  const isLineEslintDisabled = reg.exec(line)
  if (!isLineEslintDisabled) {
    return []
  }

  const errors = isLineEslintDisabled[1]
  return errors.split(",").map((error) => error.trim())
}

export default function prependRuleIdsAtLines(
  source: Buffer | string,
  insertions: RuleIdsByLine,
) {
  let lines = source.toString().split("\n")

  let offset = 0

  Object.entries(insertions).forEach(([lineNumber, ruleIds]) => {
    const adjustedLineNumber = +lineNumber + offset - 1

    const indentation = lines[adjustedLineNumber].match(/^\s*/)![0]

    const alreadyDisabledErrors = getDisabledErrors(
      lines[adjustedLineNumber - 1],
    )
    const isLineAlreadyDisabled = alreadyDisabledErrors.length > 0
    if (isLineAlreadyDisabled) {
      alreadyDisabledErrors.forEach((error) => ruleIds.add(error))
    }

    const ruleList = Array.from(ruleIds).join(", ")
    const ignoreString = `// eslint-disable-next-line ${ruleList}`

    if (isLineAlreadyDisabled) {
      lines.splice(adjustedLineNumber - 1, 1, indentation + ignoreString)
    } else {
      lines.splice(adjustedLineNumber, 0, indentation + ignoreString)
      offset++
    }
  })

  return lines.join("\n")
}
