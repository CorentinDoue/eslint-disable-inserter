type ESLintResult = {
  filePath: string
  messages: ESLintMessage[]
}

type NormalizedResult = {
  filePath: string
  messagesByLine: RuleIdsByLine
}

type RuleIdsByLine = {
  [lineNumber: number]: Set<string>
}

type ESLintMessage = {
  ruleId: string
  severity: 0 | 1 | 2
  line: number
}

type Options = {
  dryRun: boolean
  addFixMe: boolean
}
