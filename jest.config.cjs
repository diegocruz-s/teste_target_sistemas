/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  coverageProvider: "v8",

  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/infra/repositories/",
    "/src/infra/factories/"
  ],
};