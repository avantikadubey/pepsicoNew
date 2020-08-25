module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/index.js',
    '!src/**/*.stories.jsx',
    '!**/node_modules/**',
    '!build/**'
  ],
  coverageReporters: ['lcov', 'text'],
  reporters: ['default'],
  transform: {
    '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`
  },
  moduleNameMapper: {
    '.+\\.(css|styl|less|sass|scss)$': `identity-obj-proxy`,
    '.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `<rootDir>/__mocks__/file-mock.js`
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`, `public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``
  },
  testURL: `http://localhost`,
  setupFiles: [`<rootDir>/loadershim.js`],
  testResultsProcessor: 'jest-sonar-reporter',
  verbose: true
};
