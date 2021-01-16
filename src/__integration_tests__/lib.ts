import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import { getDisabledErrors, isFixMe } from "../prependRuleIdsAtLines"

const asyncExec = promisify(exec)

export const pathToExample = path.join("example")
const pathToExampleSrc = path.join(pathToExample, "src")
export const indexTsPath = path.join(pathToExampleSrc, "index.ts")
export const legacyJsPath = path.join(pathToExampleSrc, "legacy-file.js")

export const installExampleDependencies = async (): Promise<void> => {
  console.log("Install example dependencies...")
  await asyncExec("yarn install", {
    cwd: pathToExample,
  })
}

export const buildEslintDisableInserter = async (): Promise<void> => {
  console.log("Build eslint-ignore-inserter...")
  await asyncExec("yarn tsc")
}

export const linkEslintDisableInserter = async (): Promise<void> => {
  console.log("Link eslint-ignore-inserter to example...")
  await asyncExec("yarn link")
  await asyncExec("yarn link eslint-ignore-inserter", { cwd: pathToExample })
}

export const executeEslintDisableInserterInExample = async (
  options: string = "",
): Promise<{
  stdout?: string
  stderr?: string
  error?: Error
}> => {
  try {
    const { stdout, stderr } = await asyncExec(
      `yarn insert-ignore ${options}`,
      {
        cwd: pathToExample,
      },
    )
    return { stdout, stderr }
  } catch (error) {
    return error
  }
}

export const executeEslintInExample = async (): Promise<{
  stderr?: string
  error?: Error
}> => {
  try {
    const { stderr } = await asyncExec(`yarn lint`, {
      cwd: pathToExample,
    })
    return { stderr }
  } catch (error) {
    return error
  }
}

type EslintDisable = {
  line: number
  errors: string[]
}
export const parseEslintDisables = (file: string): EslintDisable[] => {
  const lines = file.split("\n")
  return lines.reduce((eslintDisables: EslintDisable[], line, index) => {
    const errors = getDisabledErrors(line)
    if (errors.length > 0) {
      eslintDisables.push({
        line: index + 1,
        errors,
      })
    }
    return eslintDisables
  }, [])
}

type FixMe = {
  line: number
}
export const parseFixMes = (file: string): FixMe[] => {
  const lines = file.split("\n")
  return lines.reduce<FixMe[]>((fixMes, line, index) => {
    if (isFixMe(line)) {
      fixMes.push({
        line: index + 1,
      })
    }
    return fixMes
  }, [])
}
