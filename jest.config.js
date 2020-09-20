module.exports = {
  roots: ["src"],
  transform: {
    ".ts$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  testURL: "http://localhost",
}
