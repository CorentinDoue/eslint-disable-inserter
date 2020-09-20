import * as fs from "fs-extra"
import {
  buildEslintIgnoreInserter,
  executeEslintIgnoreInserterInExample,
  indexTsPath,
  installExampleDependencies,
  legacyJsPath,
  linkEslintIgnoreInserter,
  parseEslintIgnores,
} from "./lib"

describe("Integration test", () => {
  let originalIndexTsFile: Buffer
  let originalLegacyJsFile: Buffer
  let stdout: string | undefined
  let stderr: string | undefined
  let error: Error | undefined
  let processedIndexTsFile: string
  let processedLegacyJsFile: string
  beforeAll(async () => {
    originalIndexTsFile = await fs.readFile(indexTsPath)
    originalLegacyJsFile = await fs.readFile(legacyJsPath)

    await installExampleDependencies()
    await buildEslintIgnoreInserter()
    await linkEslintIgnoreInserter()
  })
  describe("classical usage", () => {
    beforeAll(async () => {
      ;({
        stdout,
        stderr,
        error,
      } = await executeEslintIgnoreInserterInExample())
      processedIndexTsFile = (await fs.readFile(indexTsPath)).toString()
      processedLegacyJsFile = (await fs.readFile(legacyJsPath)).toString()
    })
    afterAll(async () => {
      await fs.writeFile(indexTsPath, originalIndexTsFile)
      await fs.writeFile(legacyJsPath, originalLegacyJsFile)
    })
    it("triggers no error", async () => {
      expect(stderr).toEqual("")
      expect(error).not.toBeDefined()
    })
    it("adds eslint-ignore", async () => {
      const indexTsEslintIgnores = parseEslintIgnores(processedIndexTsFile)
      const legacyJsEslintIgnores = parseEslintIgnores(processedLegacyJsFile)
      expect(indexTsEslintIgnores.length).toEqual(3)
      expect(legacyJsEslintIgnores.length).toEqual(1)
    })
  })
  describe("dry-run usage", () => {
    beforeAll(async () => {
      ;({ stdout, stderr, error } = await executeEslintIgnoreInserterInExample(
        "--dry-run",
      ))
      processedIndexTsFile = (await fs.readFile(indexTsPath)).toString()
      processedLegacyJsFile = (await fs.readFile(legacyJsPath)).toString()
    })
    it("triggers no error", async () => {
      expect(stderr).toEqual("")
      expect(error).not.toBeDefined()
    })
    it("doesn't add eslint-ignore", async () => {
      const indexTsEslintIgnores = parseEslintIgnores(processedIndexTsFile)
      const legacyJsEslintIgnores = parseEslintIgnores(processedLegacyJsFile)
      expect(indexTsEslintIgnores.length).toEqual(0)
      expect(legacyJsEslintIgnores.length).toEqual(0)
    })
  })
})
