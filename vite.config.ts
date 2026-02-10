import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],

  build: {
    outDir: 'dist',

    sourcemap: false,

    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',

    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunk for Vue and Router
          'vue-vendor': ['vue', 'vue-router'],
        },

        // Asset file naming
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';

          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];

          // Group assets by type for better organization
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
            extType = 'img';
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            extType = 'fonts';
          }

          return `assets/${extType}/[name]-[hash][extname]`;
        },

        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },

    // Target browsers
    target: 'esnext',

    assetsInlineLimit: 4096,
  },

  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
  },
});
