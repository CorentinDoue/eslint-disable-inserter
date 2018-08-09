import prependRuleIdsAtLines from "../prependRuleIdsAtLines"

test("prepends lines", () => {
  const source = ["1", "2", "3"].join("\n")
  const expected = [
    "1",
    "// eslint-ignore-next-line a, b",
    "2",
    "// eslint-ignore-next-line c",
    "3",
  ].join("\n")

  expect(
    prependRuleIdsAtLines(source, {
      2: new Set(["a", "b"]),
      3: new Set(["c"]),
    }),
  ).toBe(expected)
})

test('preserves indentation of the "insertee"', () => {
  const source = ["  1"].join("\n")
  const expected = ["  // eslint-ignore-next-line a", "  1"].join("\n")

  expect(prependRuleIdsAtLines(source, { 1: new Set(["a"]) })).toBe(expected)
})
