export default class ESLintOutput {
  files: FileWithErrors[]
  rulesToIgnore: RulesToIgnore

  constructor(files: FileWithErrors[]) {
    this.files = files
    this.rulesToIgnore = {}
  }

  process() {
    this._findRulesToIgnore()

    return this.rulesToIgnore
  }

  _findRulesToIgnore() {
    this.files.forEach(file => {
      this._sortedMessages(file.messages).forEach(message => {
        this._addRuleToFileAtLine(
          file.filePath,
          parseInt(message.line),
          message.ruleId,
        )
      })
    })
  }

  _addRuleToFileAtLine(file: string, line: number, ruleId: string) {
    if (!this.rulesToIgnore[file]) {
      this.rulesToIgnore[file] = {}
    }

    if (!this.rulesToIgnore[file][line]) {
      this.rulesToIgnore[file][line] = new Set()
    }

    this.rulesToIgnore[file][line].add(ruleId)
  }

  _sortedMessages(messages: ESLintMessage[]): ESLintMessage[] {
    return messages.sort((a, b) => parseInt(a.line, 10) - parseInt(b.line, 10))
  }
}
