module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
