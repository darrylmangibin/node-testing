/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testMatch: ["**.test.ts"],
  moduleNameMapper: {
    "@/resources/(.*)": "<rootDir>/src/resources/$1",
    "@/middleware/(.*)": "<rootDir>/src/middleware/$1",
    "@/utils/(.*)": "<rootDir>/src/utils/$1",
    "@/src/(.*)": "<rootDir>/src/$1"
  },
  setupFilesAfterEnv: ["./src/test/setup.ts"],
  detectOpenHandles: true,
  forceExit: true
};