import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  // GitHub Pages publishes this repository below the account-level subpath.
  // Keep the root path in development so the existing local URL stays simple.
  base: command === 'build' ? '/-truth-or-dare-game/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}));
