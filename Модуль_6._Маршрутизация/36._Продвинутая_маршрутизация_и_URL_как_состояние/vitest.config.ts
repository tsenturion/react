import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    css: true,
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
