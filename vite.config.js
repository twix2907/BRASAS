import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        tailwindcss(),
    ],
    build: {
        outDir: 'public/build',
        manifest: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    utils: ['axios', 'laravel-echo', 'pusher-js']
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false // Disable sourcemaps in production
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'styled-components']
    }
});
