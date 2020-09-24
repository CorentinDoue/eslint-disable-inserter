import prependRuleIdsAtLines from "../prependRuleIdsAtLines"

describe("prependRuleIdsAtLines", () => {
  test("prepends lines", () => {
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
        source,
        insertions: {
          2: new Set(["a", "b"]),
          3: new Set(["c"]),
        },
        addFixMe: false,
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
      "// eslint-disable-next-line b, a",
      "2",
      "// eslint-disable-next-line c, d",
      "4",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source,
        insertions: {
          2: new Set(["b"]),
          4: new Set(["c", "d"]),
        },
        addFixMe: false,
      }),
    ).toBe(expected)
  })

  test('preserves indentation of the "insertee"', () => {
    const source = ["  1"].join("\n")
    const expected = ["  // eslint-disable-next-line a", "  1"].join("\n")

    expect(
      prependRuleIdsAtLines({
        source,
        insertions: { 1: new Set(["a"]) },
        addFixMe: false,
      }),
    ).toBe(expected)
  })

  test("adds FIXME with eslint disables", () => {
    const source = ["1", "2", "3"].join("\n")
    const expected = [
      "1",
      "// FIXME",
      "// eslint-disable-next-line a, b",
      "2",
      "// FIXME",
      "// eslint-disable-next-line c",
      "3",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source,
        insertions: {
          2: new Set(["a", "b"]),
          3: new Set(["c"]),
        },
        addFixMe: true,
      }),
    ).toBe(expected)
  })

  test("adds FIXME if there are eslint disables but no FIXME", () => {
    const source = [
      "// eslint-disable-next-line a",
      "2",
      "// eslint-disable-next-line c",
      "4",
    ].join("\n")
    const expected = [
      "// FIXME",
      "// eslint-disable-next-line b, a",
      "2",
      "// FIXME",
      "// eslint-disable-next-line c, d",
      "4",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source,
        insertions: {
          2: new Set(["b"]),
          4: new Set(["c", "d"]),
        },
        addFixMe: true,
      }),
    ).toBe(expected)
  })
  test("doesn't double FIXME", () => {
    const source = [
      "// FIXME something",
      "2",
      "// FIXME",
      "// eslint-disable-next-line b",
      "5",
    ].join("\n")
    const expected = [
      "// FIXME something",
      "// eslint-disable-next-line a",
      "2",
      "// FIXME",
      "// eslint-disable-next-line c, b",
      "5",
    ].join("\n")

    expect(
      prependRuleIdsAtLines({
        source,
        insertions: {
          2: new Set(["a"]),
          5: new Set(["c"]),
        },
        addFixMe: true,
      }),
    ).toBe(expected)
  })
})
