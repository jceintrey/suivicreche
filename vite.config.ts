import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
      },
      manifest: {
        name: 'SuiviCreche',
        short_name: 'SuiviCreche',
        description: 'Suivi des heures de crèche',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#4a90d9',
        icons: [
          {
            src: '/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
