import * as ts from "typescript"

/** Get position at start of zero-indexed line number in the given source file. */
const getStartOfLinePos = (sourceFile: ts.SourceFile, line: number): number => {
  return ts.getPositionOfLineAndCharacter(sourceFile, line, 0)
}

export const isLineInJSX = (sourceFile: ts.SourceFile, line: number) => {
  const pos = getStartOfLinePos(sourceFile, line)
  const visitor = (node: ts.Node): boolean | undefined => {
    if (
      node.pos <= pos &&
      pos < node.end &&
      (ts.isJsxElement(node) || ts.isJsxFragment(node))
    ) {
      const isJsxTextChild = node.children.some(
        (child) => ts.isJsxText(child) && child.pos <= pos && pos < child.end,
      )
      const isClosingElement =
        !ts.isJsxFragment(node) && node.closingElement.pos === pos
      if (isJsxTextChild || isClosingElement) {
        return true
      }
    }

    return ts.forEachChild(node, visitor)
  }

  return !!ts.forEachChild(sourceFile, visitor)
}
