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
      prependRuleIdsAtLines(source, {
        2: new Set(["a", "b"]),
        3: new Set(["c"]),
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
      prependRuleIdsAtLines(source, {
        2: new Set(["b"]),
        4: new Set(["c", "d"]),
      }),
    ).toBe(expected)
  })

  test('preserves indentation of the "insertee"', () => {
    const source = ["  1"].join("\n")
    const expected = ["  // eslint-disable-next-line a", "  1"].join("\n")

    expect(prependRuleIdsAtLines(source, { 1: new Set(["a"]) })).toBe(expected)
  })
})
