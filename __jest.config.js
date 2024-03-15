const base = {
    testEnvironment: 'node',
}

export default {
    modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],
    projects: [
        {
            displayName: 'unit',
            ...base,
            resetModules: true,
            testMatch: ['<rootDir>/services/**/*.test.js', '<rootDir>/controllers/**/*.test.js'],
        }
    ],
    transform: {},
    verbose: true,
}