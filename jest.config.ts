import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    '/test/',
    '/dist/',
    '.eslintrc.js',
    'webpack.config.js',
    'jest.config.ts',
    '/src/main.(ts|js)',
    '/src/app.*.(ts|js)',
    '.*\\.module.ts',
    'base.entity.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    // '^image![a-zA-Z0-9$_-]+$': 'GlobalImageStub',
    // '^[./a-zA-Z0-9$_-]+\\.png$': '<rootDir>/RelativeImageStub.js',
    // 'module_name_(.*)': '<rootDir>/substituted_module_$1.js',
    // 'assets/(.*)': [
    //   '<rootDir>/images/$1',
    //   '<rootDir>/photos/$1',
    //   '<rootDir>/recipes/$1',
    // ],
    '@/(.*)': '<rootDir>/src/$1',
  },
};

export default config;
