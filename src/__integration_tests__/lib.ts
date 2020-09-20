import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

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

export const buildEslintIgnoreInserter = async (): Promise<void> => {
  console.log("Build eslint-ignore-inserter...")
  await asyncExec("yarn tsc")
}

export const linkEslintIgnoreInserter = async (): Promise<void> => {
  console.log("Link eslint-ignore-inserter to example...")
  await asyncExec("yarn link")
  await asyncExec("yarn link eslint-ignore-inserter", { cwd: pathToExample })
}

export const executeEslintIgnoreInserterInExample = async (
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

type EslintIgnore = {
  line: number
  errors: string[]
}
export const parseEslintIgnores = (file: string): EslintIgnore[] => {
  const lines = file.split("\n")
  const reg = /\/\/ eslint-ignore-next-line (.*)/
  return lines.reduce((eslintIgnores: EslintIgnore[], line, index) => {
    const eslintIgnoreInLine = reg.exec(line)
    if (eslintIgnoreInLine) {
      const errors = eslintIgnoreInLine[1]
      eslintIgnores.push({
        line: index + 1,
        errors: errors.split(",").map((error) => error.trim()),
      })
    }
    return eslintIgnores
  }, [])
}
