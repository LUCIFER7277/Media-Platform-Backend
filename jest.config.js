export default {
    testEnvironment: 'node',
    testTimeout: 30000,
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    transform: {},
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
