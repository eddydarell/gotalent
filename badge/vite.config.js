import { defineConfig } from 'vite'

export default defineConfig({
  // Base URL for assets
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Force file hashing for cache busting
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Force unique filenames with timestamps for cache busting
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
    // Disable caching in development
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  },
  
  // Preview server configuration (for production build)
  preview: {
    port: 4173,
    open: true,
    host: true,
    // Disable caching in preview mode as well
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    }
  },
  
  // Public directory
  publicDir: 'public',
  
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.svg', '**/*.ico', '**/*.json'],
  
  // Additional cache busting configurations
  define: {
    // Add build timestamp to force cache invalidation
    __BUILD_TIME__: JSON.stringify(Date.now())
  },
  
  // CSS configuration for cache busting
  css: {
    devSourcemap: true
  }
})
