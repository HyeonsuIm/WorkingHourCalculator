import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        outDir: 'static/dist',
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'src/main.ts'),
            output: {
                entryFileNames: 'main.js',
            },
        },
    },
})
