export type ESLintResult = {
  filePath: string
  messages: ESLintMessage[]
}

export type NormalizedResult = {
  filePath: string
  messagesByLine: RuleIdsByLine
}

export type RuleIdsByLine = {
  [lineNumber: number]: Set<string>
}

export type ESLintMessage = {
  ruleId: string
  severity: 0 | 1 | 2
  line: number
}

export type Options = {
  dryRun: boolean
  fixMe: boolean
}
