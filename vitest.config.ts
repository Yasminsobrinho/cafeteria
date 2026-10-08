import angular from '@analogjs/vite-plugin-angular';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: './src',
  resolve: {
    mainFields: ['module'],
  },
  plugins: [angular()],
  optimizeDeps: {
    noDiscovery: true,
    entries: [],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    include: ['**/*.spec.ts'],
    exclude: ['../dist/**'],
  },
});
