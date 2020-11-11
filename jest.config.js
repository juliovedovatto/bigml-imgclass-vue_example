module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  modulePathIgnorePatterns: ['<rootDir>/src/.*/__mocks__', 'node_modules', '<rootDir>/.history', '<rootDir>/tmp'],
  verbose: true
}
