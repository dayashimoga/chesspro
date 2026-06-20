import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          'chess-content': [
            './src/content/puzzle-db.ts',
            './src/content/puzzle-expanded.ts',
            './src/content/puzzle-endgame.ts',
            './src/content/master-games-db.ts',
            './src/content/master-games-extended.ts',
            './src/content/master-games-grandmaster.ts',
            './src/content/openings-extended.ts',
          ],
          'chess-curriculum': [
            './src/content/00-foundations.ts',
            './src/content/01-tactics.ts',
            './src/content/02-calculation.ts',
            './src/content/03-endgames.ts',
            './src/content/04-strategy.ts',
            './src/content/05-openings.ts',
            './src/content/06-master-games.ts',
            './src/content/07-middlegame.ts',
            './src/content/08-advanced.ts',
          ],
          'chess-engine': [
            './src/core/chess-engine.ts',
            './src/core/stockfishService.ts',
            './src/core/adaptive-engine.ts',
            './src/core/gamification.ts',
            './src/core/spaced-repetition.ts',
          ],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-zustand': ['zustand'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3105,
    host: '0.0.0.0',
    strictPort: true,
  },
});
