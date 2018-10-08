module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json'
    }
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts$': './node_modules/ts-jest/preprocessor.js'
  },
  testMatch: [
    '**/*.test.ts',
    '**/*.test.js'
  ],
  testEnvironment: 'node'
}
