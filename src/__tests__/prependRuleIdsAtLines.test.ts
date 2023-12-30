import ts from "typescript"
import prependRuleIdsAtLines from "../prependRuleIdsAtLines"

const createSourceFile = (source: string) =>
  ts.createSourceFile(
    "sample.ts",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

describe("prependRuleIdsAtLines", () => {
  test("prepends lines", () => {
    const source = ["1", "2", "3"].join("\n")
    const expected = [
      "1",
      "// eslint-disable-next-line a, b -- FIXME",
      "2",
      "// eslint-disable-next-line c -- FIXME",
      "3",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source: createSourceFile(source),
        insertions: {
          2: new Set(["a", "b"]),
          3: new Set(["c"]),
        },
        fixMe: true,
      }),
    ).toBe(expected)
  })

  test("doesn't add double disable", () => {
    const source = [
      "// eslint-disable-next-line a",
      "2",
      "// eslint-disable-next-line c",
      "4",
    ].join("\n")
    const expected = [
      "// eslint-disable-next-line b, a -- FIXME",
      "2",
      "// eslint-disable-next-line c, d -- FIXME",
      "4",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source: createSourceFile(source),
        insertions: {
          2: new Set(["b"]),
          4: new Set(["c", "d"]),
        },
        fixMe: true,
      }),
    ).toBe(expected)
  })

  test('preserves indentation of the "insertee"', () => {
    const source = ["  1"].join("\n")
    const expected = ["  // eslint-disable-next-line a -- FIXME", "  1"].join(
      "\n",
    )

    expect(
      prependRuleIdsAtLines({
        source: createSourceFile(source),
        insertions: { 1: new Set(["a"]) },
        fixMe: true,
      }),
    ).toBe(expected)
  })

  test("does not add FIXME with eslint disables", () => {
    const source = ["1", "2", "3"].join("\n")
    const expected = [
      "1",
      "// eslint-disable-next-line a, b",
      "2",
      "// eslint-disable-next-line c",
      "3",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source: createSourceFile(source),
        insertions: {
          2: new Set(["a", "b"]),
          3: new Set(["c"]),
        },
        fixMe: false,
      }),
    ).toBe(expected)
  })

  test("keeps FIXME if fixMe is false", () => {
    const source = [
      "// eslint-disable-next-line a",
      "2",
      "// eslint-disable-next-line c -- FIXME my comment",
      "4",
    ].join("\n")
    const expected = [
      "// eslint-disable-next-line b, a",
      "2",
      "// eslint-disable-next-line c, d -- FIXME my comment",
      "4",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source: createSourceFile(source),
        insertions: {
          2: new Set(["b"]),
          4: new Set(["c", "d"]),
        },
        fixMe: false,
      }),
    ).toBe(expected)
  })
  test("doesn't double FIXME", () => {
    const source = [
      "2",
      "// eslint-disable-next-line b -- FIXME something",
      "5",
    ].join("\n")
    const expected = [
      "// eslint-disable-next-line a -- FIXME",
      "2",
      "// eslint-disable-next-line c, b -- FIXME something",
      "5",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source: createSourceFile(source),
        insertions: {
          1: new Set(["a"]),
          3: new Set(["c"]),
        },
        fixMe: true,
      }),
    ).toBe(expected)
  })
  test("handles comments", () => {
    const source = [
      "2",
      "// eslint-disable-next-line b -- my comment",
      "5",
    ].join("\n")
    const expected = [
      "// eslint-disable-next-line a -- FIXME",
      "2",
      "// eslint-disable-next-line c, b -- FIXME my comment",
      "5",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source: createSourceFile(source),
        insertions: {
          1: new Set(["a"]),
          3: new Set(["c"]),
        },
        fixMe: true,
      }),
    ).toBe(expected)
  })
  describe("jsx", () => {
    test("adds jsx comment in jsx files", () => {
      const source = `function App() {
  return (
    <div>
      <p>Hello, World!</p>
    </div>
  );
}`
      const expected = `// eslint-disable-next-line a -- FIXME
function App() {
  // eslint-disable-next-line b -- FIXME
  return (
    {/* eslint-disable-next-line c -- FIXME */}
    <div>
      {/* eslint-disable-next-line d -- FIXME */}
      <p>Hello, World!</p>
    {/* eslint-disable-next-line e -- FIXME */}
    </div>
  {/* eslint-disable-next-line f -- FIXME */}
  );
// eslint-disable-next-line g -- FIXME
}`

      expect(
        prependRuleIdsAtLines({
          source: createSourceFile(source),
          insertions: {
            1: new Set(["a"]),
            2: new Set(["b"]),
            3: new Set(["c"]),
            4: new Set(["d"]),
            5: new Set(["e"]),
            6: new Set(["f"]),
            7: new Set(["g"]),
          },
          fixMe: true,
        }),
      ).toBe(expected)
    })
    test("adds jsx comment in jsx files with existing comments", () => {
      const source = `function App() {
  return (
    <div>
      {/* eslint-disable-next-line b -- my comment */}
      <p>Hello, World!</p>
    </div>
  );
}`
      const expected = `function App() {
  return (
    <div>
      {/* eslint-disable-next-line c, b -- FIXME my comment */}
      <p>Hello, World!</p>
    </div>
  );
}`

      expect(
        prependRuleIdsAtLines({
          source: createSourceFile(source),
          insertions: {
            5: new Set(["c"]),
          },
          fixMe: true,
        }),
      ).toBe(expected)
    })
  })
  describe("max-lines rule", () => {
    test("adds the comment at the right place", () => {
      const source = ["1", "2", "3"].join("\n")
      const expected = [
        "1",
        "// eslint-disable-next-line max-lines -- FIXME",
        "2",
        "3",
      ].join("\n")

      expect(
        prependRuleIdsAtLines({
          source: createSourceFile(source),
          insertions: {
            3: new Set(["max-lines"]),
          },
          fixMe: true,
        }),
      ).toBe(expected)
    })
    test("adds the comment at the right place with other comments inserted before", () => {
      const source = ["1", "2", "3", "4"].join("\n")
      const expected = [
        "1",
        "// eslint-disable-next-line max-lines -- FIXME",
        "// eslint-disable-next-line a -- FIXME",
        "2",
        "// eslint-disable-next-line b -- FIXME",
        "3",
        "// eslint-disable-next-line c -- FIXME",
        "4",
      ].join("\n")

      expect(
        prependRuleIdsAtLines({
          source: createSourceFile(source),
          insertions: {
            2: new Set(["a"]),
            3: new Set(["max-lines", "b"]),
            4: new Set(["c"]),
          },
          fixMe: true,
        }),
      ).toBe(expected)
    })
  })
})
