import * as fs from "fs-extra"
import {
  buildEslintDisableInserter,
  executeEslintDisableInserterInExample,
  executeEslintInExample,
  indexTsPath,
  installExampleDependencies,
  legacyJsPath,
  componentTsxPath,
  linkEslintDisableInserter,
  parseEslintDisables,
  parseFixMes,
} from "./lib"

describe("Integration test", () => {
  let originalIndexTsFile: Buffer
  let originalLegacyJsFile: Buffer
  let originalComponentTsxFile: Buffer
  let stdout: string | undefined
  let stderr: string | undefined
  let error: unknown | undefined
  let processedIndexTsFile: string
  let processedLegacyJsFile: string
  let processedComponentTsxFile: string
  beforeAll(async () => {
    originalIndexTsFile = await fs.readFile(indexTsPath)
    originalLegacyJsFile = await fs.readFile(legacyJsPath)
    originalComponentTsxFile = await fs.readFile(componentTsxPath)

    await installExampleDependencies()
    await buildEslintDisableInserter()
    await linkEslintDisableInserter()
  })
  describe("classical usage", () => {
    beforeAll(async () => {
      ;({
        stdout,
        stderr,
        error,
      } = await executeEslintDisableInserterInExample())
      processedIndexTsFile = (await fs.readFile(indexTsPath)).toString()
      processedLegacyJsFile = (await fs.readFile(legacyJsPath)).toString()
      processedComponentTsxFile = (
        await fs.readFile(componentTsxPath)
      ).toString()
    })
    afterAll(async () => {
      await fs.writeFile(indexTsPath, originalIndexTsFile)
      await fs.writeFile(legacyJsPath, originalLegacyJsFile)
      await fs.writeFile(componentTsxPath, originalComponentTsxFile)
    })
    it("triggers no error", async () => {
      expect(stderr).toEqual("")
      expect(error).not.toBeDefined()
    })
    it("adds eslint-ignore", async () => {
      const indexTsEslintDisables = parseEslintDisables(processedIndexTsFile)
      const legacyJsEslintDisables = parseEslintDisables(processedLegacyJsFile)
      const componentTsxEslintDisables = parseEslintDisables(
        processedComponentTsxFile,
      )
      expect(indexTsEslintDisables.length).toEqual(3)
      expect(legacyJsEslintDisables.length).toEqual(1)
      expect(componentTsxEslintDisables.length).toEqual(3)
    })
    it("adds FIXME", async () => {
      const indexTsFixMes = parseFixMes(processedIndexTsFile)
      const legacyJsFixMes = parseFixMes(processedLegacyJsFile)
      const componentTsxFixMes = parseFixMes(processedComponentTsxFile)
      expect(indexTsFixMes.length).toEqual(3)
      expect(legacyJsFixMes.length).toEqual(1)
      expect(componentTsxFixMes.length).toEqual(3)
    })
    it("fix eslint issues", async () => {
      const {
        stderr: eslintStderr,
        error: eslintError,
      } = await executeEslintInExample()
      expect(eslintStderr).toEqual("")
      expect(eslintError).not.toBeDefined()
    })
  })
  describe("usage with noFixMe", () => {
    beforeAll(async () => {
      ;({ stdout, stderr, error } = await executeEslintDisableInserterInExample(
        "--no-fix-me",
      ))
      processedIndexTsFile = (await fs.readFile(indexTsPath)).toString()
      processedLegacyJsFile = (await fs.readFile(legacyJsPath)).toString()
      processedComponentTsxFile = (
        await fs.readFile(componentTsxPath)
      ).toString()
    })
    afterAll(async () => {
      await fs.writeFile(indexTsPath, originalIndexTsFile)
      await fs.writeFile(legacyJsPath, originalLegacyJsFile)
      await fs.writeFile(componentTsxPath, originalComponentTsxFile)
    })
    it("triggers no error", async () => {
      expect(stderr).toEqual("")
      expect(error).not.toBeDefined()
    })
    it("adds eslint-ignore", async () => {
      const indexTsEslintDisables = parseEslintDisables(processedIndexTsFile)
      const legacyJsEslintDisables = parseEslintDisables(processedLegacyJsFile)
      const componentTsxEslintDisables = parseEslintDisables(
        processedComponentTsxFile,
      )
      expect(indexTsEslintDisables.length).toEqual(3)
      expect(legacyJsEslintDisables.length).toEqual(1)
      expect(componentTsxEslintDisables.length).toEqual(3)
    })
    it("does not add FIXME", async () => {
      const indexTsFixMes = parseFixMes(processedIndexTsFile)
      const legacyJsFixMes = parseFixMes(processedLegacyJsFile)
      const componentTsxFixMes = parseFixMes(processedComponentTsxFile)
      expect(indexTsFixMes.length).toEqual(1) // The example has already a FIXME
      expect(legacyJsFixMes.length).toEqual(0)
      expect(componentTsxFixMes.length).toEqual(1) // The example has already a FIXME
    })
    it("fix eslint issues", async () => {
      const {
        stderr: eslintStderr,
        error: eslintError,
      } = await executeEslintInExample()
      expect(eslintStderr).toEqual("")
      expect(eslintError).not.toBeDefined()
    })
  })
  describe("dry-run usage", () => {
    beforeAll(async () => {
      ;({ stdout, stderr, error } = await executeEslintDisableInserterInExample(
        "--dry-run",
      ))
      processedIndexTsFile = (await fs.readFile(indexTsPath)).toString()
      processedLegacyJsFile = (await fs.readFile(legacyJsPath)).toString()
      processedComponentTsxFile = (
        await fs.readFile(componentTsxPath)
      ).toString()
    })
    it("triggers no error", async () => {
      expect(stderr).toEqual("")
      expect(error).not.toBeDefined()
    })
    it("doesn't add eslint-disable", async () => {
      const indexTsEslintDisables = parseEslintDisables(processedIndexTsFile)
      const legacyJsEslintDisables = parseEslintDisables(processedLegacyJsFile)
      const componentTsxEslintDisables = parseEslintDisables(
        processedComponentTsxFile,
      )
      expect(indexTsEslintDisables.length).toEqual(1) // The example has already a line disabled
      expect(legacyJsEslintDisables.length).toEqual(0)
      expect(componentTsxEslintDisables.length).toEqual(1) // The example has already a line disabled
    })
    it("doesn't add FIXME", async () => {
      const indexTsFixMes = parseFixMes(processedIndexTsFile)
      const legacyJsFixMes = parseFixMes(processedLegacyJsFile)
      const componentTsxFixMes = parseFixMes(processedComponentTsxFile)
      expect(indexTsFixMes.length).toEqual(1) // The example has already a FIXME
      expect(legacyJsFixMes.length).toEqual(0)
      expect(componentTsxFixMes.length).toEqual(1) // The example has already a FIXME
    })
  })
})
