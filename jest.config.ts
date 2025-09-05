import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/tests/setup-env.ts'],
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts'
    ],
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            useESM: true,
            tsconfig: {
                allowImportingTsExtensions: false
            }
        }
    },
    testTimeout: 30000,
    maxWorkers: 1
};

export default config;
