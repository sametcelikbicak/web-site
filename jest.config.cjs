module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.*',
    '!src/**/*.spec.*',
    '!src/main.tsx',
    '!src/entry-client.tsx',
    // worker.ts needs the Cloudflare ASSETS binding and the workerd runtime.
    // services/blog.ts opens with import.meta.glob, which ts-jest cannot parse
    // at all, so even collecting coverage from it fails. Both exclusions now
    // cover only the thin wrapper layer: the parsing and assembly logic that
    // used to hide behind them lives in frontmatter.ts and posts.ts, and both
    // are measured — posts.ts at 100%.
    '!src/worker.ts',
    '!src/services/blog.ts',
  ],
};
