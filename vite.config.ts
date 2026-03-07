import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    proxy: {
      '/api/bart': {
        target: 'https://api.bart.gov',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/bart/, ''),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'favicon-16.png',
        'favicon-32.png',
        'apple-touch-icon.png',
        'icon-192.png',
        'icon-512.png',
        'icon-maskable-512.png'
      ],
      manifest: {
        id: '/',
        name: 'BARTonic',
        short_name: 'BARTonic',
        description: 'BART real-time schedule, favorite routes & map',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        prefer_related_applications: false,
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ],
        shortcuts: [
          {
            name: 'My Routes',
            short_name: 'Routes',
            description: 'Open saved routes and live departures',
            url: '/routes',
            icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Quick Lookup',
            short_name: 'Lookup',
            description: 'Check departures for any station pair',
            url: '/lookup',
            icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'System Map',
            short_name: 'Map',
            description: 'Open the BART system map',
            url: '/map',
            icons: [{ src: 'icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ],
        categories: ['travel', 'utilities']
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['**/bart-system-map@2x.png'],
        runtimeCaching: [
          {
            urlPattern: /\/bart-system-map@2x\.png$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-hires',
              expiration: {
                maxEntries: 2,
                maxAgeSeconds: 7 * 24 * 60 * 60
              }
            }
          }
        ],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024
      }
    })
  ]
})
