import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'logo.webp', 'theme-init.js'],
        manifest: {
          name: 'KurdishName',
          short_name: 'KurdishName',
          description: 'Dünyanın en kapsamlı Kürtçe isim arşivi ve platformu.',
          start_url: '/en',
          display: 'standalone',
          background_color: '#0F172A',
          theme_color: '#0F172A',
          theme_color_use_meta: true,
          icons: [
            {
              src: '/favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png'
            },
            {
              src: '/favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png'
            },
            {
              src: '/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), display-capture=()',
      },
    },
    preview: {
      headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), display-capture=()',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' https://*.cloudflare.com https://*.cloudflareinsights.com https://*.google.com https://*.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https://*.googlesyndication.com https://*.googleadservices.com https://*.doubleclick.net https://*.yandex.ru https://*.yandex.com https://*.yandex.net https://*.bing.com https://*.clarity.ms; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.google.com https://*.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://*.gstatic.com; img-src 'self' data: https://kurdishname.com https://*.google.com https://*.gstatic.com https://*.google-analytics.com https://*.googlesyndication.com https://*.doubleclick.net https://*.cloudflare.com https://*.yandex.ru https://*.yandex.com https://*.yandex.net https://*.bing.com; frame-src 'self' https://*.google.com https://*.doubleclick.net https://*.cloudflare.com https://challenges.cloudflare.com https://*.yandex.ru https://*.yandex.com https://*.bing.com; connect-src 'self' https://*.cloudflare.com https://*.cloudflareinsights.com https://*.google.com https://*.google-analytics.com https://*.googlesyndication.com https://*.doubleclick.net https://*.yandex.ru https://*.yandex.com https://*.yandex.net https://*.bing.com https://*.clarity.ms; worker-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 600,
      modulePreload: {
        polyfill: true,
        resolveDependencies(filename, deps) {
          // Devasa isim chunk'larını (names-*) önceden yüklemeyi (prefetch/preload) engelle, sadece kritik dosyaları önceliklendir
          if (filename.includes('names-') || deps.some(dep => dep.includes('names-'))) {
            return [];
          }
          return deps;
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Her harf dosyası ayrı bir chunk olsun
            const match = id.match(/names_alphabetical[/\\]([^/\\]+)\.ts/);
            if (match) {
              return `names-${match[1].toLowerCase()}`;
            }

            // Vendor libraries splitting for better performance
            if (id.includes('node_modules')) {
              if (id.includes('motion') || id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'vendor-i18n';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('react-router-dom') || id.includes('@remix-run') || id.includes('react-router')) {
                return 'vendor-router';
              }
              if (id.includes('react-helmet-async')) {
                return 'vendor-helmet';
              }
              if (id.includes('react-virtuoso') || id.includes('react-markdown') || id.includes('fuse.js')) {
                return 'vendor-ui';
              }
              // Standard vendor for core React and others
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
