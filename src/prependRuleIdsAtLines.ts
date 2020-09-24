export const getDisabledErrors = (line: string): string[] => {
  const reg = /\/\/ eslint-disable-next-line (.*)/
  const isLineEslintDisabled = reg.exec(line)
  if (!isLineEslintDisabled) {
    return []
  }

  const errors = isLineEslintDisabled[1]
  return errors.split(",").map((error) => error.trim())
}

const fixMeString = "// FIXME"

export const isFixMe = (line: string): boolean => {
  const reg = /\/\/ FIXME/
  return Boolean(reg.exec(line))
}

export default function prependRuleIdsAtLines({
  source,
  insertions,
  addFixMe,
}: {
  source: string
  insertions: RuleIdsByLine
  addFixMe: boolean
}) {
  let lines = source.split("\n")

  let offset = 0

  Object.entries(insertions).forEach(([lineNumber, ruleIds]) => {
    const adjustedLineNumber = (_offset: number): number =>
      +lineNumber + _offset - 1
    //
    // if (addFixMe) {
    //   if ()
    // }

    const indentation = lines[adjustedLineNumber(offset)].match(/^\s*/)![0]

    const alreadyDisabledErrors = getDisabledErrors(
      lines[adjustedLineNumber(offset) - 1],
    )
    const isLineAlreadyDisabled = alreadyDisabledErrors.length > 0
    if (isLineAlreadyDisabled) {
      alreadyDisabledErrors.forEach((error) => ruleIds.add(error))
    }

    const ruleList = Array.from(ruleIds).join(", ")
    const ignoreString = `// eslint-disable-next-line ${ruleList}`

    if (isLineAlreadyDisabled) {
      if (addFixMe && !isFixMe(lines[adjustedLineNumber(offset) - 2])) {
        lines.splice(
          adjustedLineNumber(offset) - 1,
          0,
          indentation + fixMeString,
        )
        offset++
      }
      lines.splice(
        adjustedLineNumber(offset) - 1,
        1,
        indentation + ignoreString,
      )
    } else {
      if (addFixMe && !isFixMe(lines[adjustedLineNumber(offset) - 1])) {
        lines.splice(adjustedLineNumber(offset), 0, indentation + fixMeString)
        offset++
      }
      lines.splice(adjustedLineNumber(offset), 0, indentation + ignoreString)
      offset++
    }
  })

  return lines.join("\n")
}
