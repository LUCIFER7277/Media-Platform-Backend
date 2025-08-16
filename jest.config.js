export default {
    testEnvironment: 'node',
    transform: {},
    extensionsToTreatAsEsm: ['.js'],
    globals: {
        'ts-jest': {
            useESM: true
        }
    },
    moduleNameMapping: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
