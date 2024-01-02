import ts from "typescript"
import { isLineInJSX } from "./isLineInJSX"

export const parseDisabledLine = (
  line: string,
): { isDisabled: boolean; errors: string[]; comments: string } => {
  const reg = /\/\/ eslint-disable-next-line (.*)/
  const regJsx = /\{\/\* eslint-disable-next-line (.*)\*\/}/
  const lineEslintDisabledRegexResult = reg.exec(line)
  const lineEslintDisabledInJsxRegexResult = regJsx.exec(line)
  if (!lineEslintDisabledRegexResult && !lineEslintDisabledInJsxRegexResult) {
    return { isDisabled: false, errors: [], comments: "" }
  }
  if (lineEslintDisabledRegexResult && lineEslintDisabledInJsxRegexResult) {
    throw new Error(
      `Line ${line} contains both a JSX and a non-JSX eslint-disable-next-line comment. This should never happen.`,
    )
  }
  const regexResult =
    lineEslintDisabledRegexResult ??
    (lineEslintDisabledInJsxRegexResult as RegExpExecArray) // one of them is not null

  const [errors, comments] = regexResult[1].split("--")
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

  const applyRulesToLine = ({
    lineNumber,
    ruleIds,
    skipOffset = false,
  }: {
    lineNumber: number
    ruleIds: Set<string>
    skipOffset?: boolean
  }): void => {
    if (ruleIds.size === 0) return

    const adjustedLineNumber = (_offset: number): number =>
      lineNumber + (skipOffset ? 0 : _offset) - 1

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

    const ignoreString = `eslint-disable-next-line ${ruleList}${
      fixMe ? fixMeComment : originalComment
    }`

    const commentIgnoreString = isLineInJSX(source, lineNumber - 1)
      ? `{/* ${ignoreString} */}`
      : `// ${ignoreString}`

    if (isDisabled) {
      lines.splice(
        adjustedLineNumber(offset) - 1,
        1,
        indentation + commentIgnoreString,
      )
    } else {
      lines.splice(
        adjustedLineNumber(offset),
        0,
        indentation + commentIgnoreString,
      )
      offset++
    }
  }

  Object.entries(insertions).forEach(([lineNumberString, ruleIds]) => {
    const lineNumber = Number(lineNumberString)
    let hasMaxLines = false
    if (ruleIds.has("max-lines")) {
      ruleIds.delete("max-lines")
      hasMaxLines = true
    }
    applyRulesToLine({ lineNumber, ruleIds })
    if (hasMaxLines) {
      applyRulesToLine({
        lineNumber: lineNumber - 1,
        ruleIds: new Set(["max-lines"]),
        skipOffset: true,
      })
    }
  })

  return lines.join("\n")
}
