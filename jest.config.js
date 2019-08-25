module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  setupFiles: ['core-js/stable', 'regenerator-runtime/runtime', 'jest-localstorage-mock'],
  testMatch: ['<rootDir>/src/**/*(*.)@(test).[tj]s?(x)'],
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
  modulePathIgnorePatterns: ['\\.git'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};
