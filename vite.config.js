import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: false,
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 5173
  },
  test: {
    environment: 'jsdom',
    globals: true,
    root: '.'
  }
});