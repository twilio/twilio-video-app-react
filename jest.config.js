module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  reporters: ['default', 'jest-junit'],
  moduleNameMapper: {
    '^@src(.*)$': '<rootDir>/src$1',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@hooks(.*)$': '<rootDir>/src/hooks$1',
    '^@state': '<rootDir>/src/state/index.tsx',
    '^@types': '<rootDir>/src/types.ts'
  },
};
