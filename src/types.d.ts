type FileWithErrors = {
  filePath: string,
  messages: ESLintMessage[]
}

type ESLintMessage = {
  ruleId: string,
  severity: 0 | 1 | 2,
  line: string
}

type RulesToIgnore = {
  [file: string]: {
    [line: number]: Set<string>
  }
}

type Options = {
  dryRun: boolean
}
