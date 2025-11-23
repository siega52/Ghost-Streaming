import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        test: 'test-video.html'
      }
    }
  },
  server: {
    port: 5173,
    open: '/'
  }
});