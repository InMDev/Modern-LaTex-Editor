import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      all: true,
      include: ['src/**/*.js', 'src/**/*.jsx'],
      exclude: ['src/App.jsx', 'src/main.jsx'],
      thresholds: {
        lines: 70,
        functions: 65,
        branches: 75,
        statements: 70,
      },
    },
  },
});
