import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 8192,
    rollupOptions: {
      output: {
        manualChunks: {
          chess: ['chess.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
