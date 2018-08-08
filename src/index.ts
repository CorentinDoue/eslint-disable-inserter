import ESLintOutput from "./ESLintOutput"
import CommentInserter from "./CommentInserter"

export default function(rawEslintOutput: string, options: Options) {
  try {
    const parsedOutput = JSON.parse(rawEslintOutput) as FileWithErrors[]

    const output = new ESLintOutput(parsedOutput)

    const rules = output.process()

    new CommentInserter({ dryRun: options.dryRun }).insertComments(rules)
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(
        "Failed to parse ESLint output. Are you sure you set `--format json`?",
      )
    }

    throw e
  }
}
