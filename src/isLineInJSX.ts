import * as ts from "typescript"

export const isLineInJSX = (node: ts.Node, line: number): boolean => {
  const { pos, end } = node
  const { line: startLine } = ts.getLineAndCharacterOfPosition(
    node.getSourceFile(),
    pos,
  )
  const { line: endLine } = ts.getLineAndCharacterOfPosition(
    node.getSourceFile(),
    end,
  )

  if (startLine <= line && endLine >= line) {
    if (ts.isJsxElement(node)) {
      return true
    }
  }

  return (
    ts.forEachChild(node, (childNode) => isLineInJSX(childNode, line)) ?? false
  )
}
