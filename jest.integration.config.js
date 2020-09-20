module.exports = {
  transform: {
    ".ts$": "ts-jest",
  },
  testMatch: ["**/__integration_tests__/**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["js", "json", "ts"],
  testTimeout: 20000,
}
