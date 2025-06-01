import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      // Using 'istanbul' since c8 is deprecated
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      },
    },
  },
  resolve: {
    alias: {
      '@equorn/core': resolve(__dirname, './packages/core/src'),
      '@equorn/cli': resolve(__dirname, './packages/cli/src'),
    },
  },
});
