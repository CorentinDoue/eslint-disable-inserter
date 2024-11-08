import { NormalizedResult } from "./types"

export const formatDryRunMessage = ({
  filePath,
  messagesByLine,
}: NormalizedResult): string => {
  const rulesInfoPerFile = Object.values(messagesByLine).reduce<{
    numberOfLines: number
    numberOfRules: number
  }>(
    (acc, rules) => ({
      numberOfLines: acc.numberOfLines + 1,
      numberOfRules: rules.size,
    }),
    {
      numberOfLines: 0,
      numberOfRules: 0,
    },
  )
  return `Dry run for file ${filePath}: About to disable ${rulesInfoPerFile.numberOfRules} rules on ${rulesInfoPerFile.numberOfLines} lines`
}
