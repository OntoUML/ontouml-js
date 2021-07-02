module.exports = {
  cache: false,
  testEnvironment: 'node',
  setupFilesAfterEnv: ["./setup.ts"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    '^.+\\.(ts|tsx)?$': 'babel-jest'
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules",
    ".*\\.json"
  ],
  moduleNameMapper: {
    "^@test-models(.*)": "<rootDir>/__tests__/test_models$1",
    "^@constants(.*)": "<rootDir>/src/constants$1",
    "^@error(.*)": "<rootDir>/src/error$1",
    "^@libs(.*)": "<rootDir>/src/libs$1",
    "^@utils(.*)": "<rootDir>/src/utils$1",
    "^@resources(.*)": "<rootDir>/resources$1"
  },
  testRegex: '/__tests__/libs/.*\\.test\\.(ts|js)$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ]
};
