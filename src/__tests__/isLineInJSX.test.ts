import ts from "typescript"
import { isLineInJSX } from "../isLineInJSX"

const sourceCode = `
function App() {
  return (
    <div>
      {/* This is JSX */}
      <p>Hello, World!</p>
    </div>
  );
}
// This is a comment
`

const sourceFile = ts.createSourceFile(
  "sample.tsx",
  sourceCode,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
)
describe("isLineInJSX", () => {
  it.each`
    line | isJsx
    ${0} | ${false}
    ${1} | ${false}
    ${2} | ${true}
    ${3} | ${true}
    ${4} | ${true}
    ${5} | ${true}
    ${6} | ${true}
    ${7} | ${false}
    ${8} | ${false}
    ${9} | ${false}
  `(
    "returns $isJsx for line $line",
    ({ line, isJsx }: { line: number; isJsx: boolean }) => {
      expect(isLineInJSX(sourceFile, line)).toBe(isJsx)
    },
  )
})
