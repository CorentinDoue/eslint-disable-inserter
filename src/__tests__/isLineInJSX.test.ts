import ts from "typescript"
import { isLineInJSX } from "../isLineInJSX"

const sourceCode = `
function App() { // 1
  return ( // 2
    <div> {/* 3 */}
      {/* This is JSX 4 */}
      <p>Hello, World!</p> {/* 5 */}
      <button // 6
        name={name} // 7
        onClick={() => { // 8
          console.log("clicked") // 9
          return ( // 10
            <h1> {/* 11 */}
              Clicked {/* 12 */}
            </h1> {/* 13 */}
          ) // 14
        }} // 15
      />  {/* 16 */}
    </div> {/* 17 */}
  ); //  18
} // 19
// This is a comment 20
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
    line  | isJsx
    ${0}  | ${false}
    ${1}  | ${false}
    ${2}  | ${false}
    ${3}  | ${false}
    ${4}  | ${true}
    ${5}  | ${true}
    ${6}  | ${true}
    ${7}  | ${false}
    ${8}  | ${false}
    ${9}  | ${false}
    ${10} | ${false}
    ${11} | ${false}
    ${12} | ${true}
    ${13} | ${true}
    ${14} | ${true}
    ${15} | ${true}
    ${16} | ${true}
    ${17} | ${true}
    ${18} | ${false}
    ${19} | ${false}
    ${20} | ${false}
  `(
    "returns $isJsx for line $line",
    ({ line, isJsx }: { line: number; isJsx: boolean }) => {
      expect(isLineInJSX(sourceFile, line)).toBe(isJsx)
    },
  )
})
