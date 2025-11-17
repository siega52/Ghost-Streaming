import { build, defineConfig } from "vite";
export default defineConfig ({
    build: {
    rollupOptions: {
        input: {
            main: 'indext.html',
            content: 'src/content.js',
            background: 'src/background.js',
            popup: 'src/popup/popup.html'
        },
        output: {
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            assetFileNames: '[name].[ext]'
        }
    },
    outDir: 'dist'
    }
});