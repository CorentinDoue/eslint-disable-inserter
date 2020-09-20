export default function (eslintOutput: ESLintResult[]): NormalizedResult[] {
  return eslintOutput.map((result) => ({
    filePath: result.filePath,
    messagesByLine: result.messages.reduce<RuleIdsByLine>(
      (accumulator, current) => {
        if (!accumulator[current.line]) {
          accumulator[current.line] = new Set<string>()
        }

        accumulator[current.line].add(current.ruleId)
        return accumulator
      },
      {},
    ),
  }))
}
