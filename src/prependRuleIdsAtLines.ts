import ts from "typescript"

export const parseDisabledLine = (
  line: string,
): { isDisabled: boolean; errors: string[]; comments: string } => {
  const reg = /\/\/ eslint-disable-next-line (.*)/
  const isLineEslintDisabled = reg.exec(line)
  if (!isLineEslintDisabled) {
    return { isDisabled: false, errors: [], comments: "" }
  }

  const [errors, comments] = isLineEslintDisabled[1].split("--")
  return {
    isDisabled: true,
    errors: errors.split(",").map((error) => error.trim()),
    comments: comments ? comments.trim() : "",
  }
}

const fixMeString = "FIXME"

export const containsFixMe = (line: string): boolean =>
  Boolean(line.includes(fixMeString))

export default function prependRuleIdsAtLines({
  source,
  insertions,
  fixMe,
}: {
  source: ts.SourceFile
  insertions: RuleIdsByLine
  fixMe: boolean
}) {
  let lines = source.text.split("\n")

  let offset = 0

  Object.entries(insertions).forEach(([lineNumber, ruleIds]) => {
    const adjustedLineNumber = (_offset: number): number =>
      +lineNumber + _offset - 1

    const indentation = lines[adjustedLineNumber(offset)].match(/^\s*/)![0]

    const {
      isDisabled,
      errors: alreadyDisabledErrors,
      comments,
    } = parseDisabledLine(lines[adjustedLineNumber(offset) - 1])
    if (isDisabled) {
      alreadyDisabledErrors.forEach((error) => ruleIds.add(error))
    }

    const fixMeComment = ` -- ${
      containsFixMe(comments)
        ? comments
        : [fixMeString, comments].filter(Boolean).join(" ")
    }`
    const originalComment = comments === "" ? "" : ` -- ${comments}`

    const ruleList = Array.from(ruleIds).join(", ")
    const ignoreString = `// eslint-disable-next-line ${ruleList}${
      fixMe ? fixMeComment : originalComment
    }`

    if (isDisabled) {
      lines.splice(
        adjustedLineNumber(offset) - 1,
        1,
        indentation + ignoreString,
      )
    } else {
      lines.splice(adjustedLineNumber(offset), 0, indentation + ignoreString)
      offset++
    }
  })

  return lines.join("\n")
}
