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
  moduleNameMapper: {
    "^@test-models(.*)": "<rootDir>/test_models$1",
    "^@constants(.*)": "<rootDir>/src/constants$1",
    "^@error(.*)": "<rootDir>/src/error$1",
    "^@libs(.*)": "<rootDir>/src/libs$1",
    "^@rules(.*)": "<rootDir>/src/rules$1",
    "^@schemas(.*)": "<rootDir>/src/schemas$1",
    "^@utils(.*)": "<rootDir>/src/utils$1"
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
  ]
};
