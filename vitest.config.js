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
      // Set realistic project-wide coverage targets. Individual files may exceed these.
      lines: 85,
      functions: 85,
      branches: 75,
      statements: 85,
    },
  },
});
