import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/suivicreche/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
      manifest: {
        name: 'SuiviCreche',
        short_name: 'SuiviCreche',
        description: 'Suivi des heures de crèche',
        start_url: '/suivicreche/',
        display: 'standalone',
        background_color: '#f5f5f5',
        theme_color: '#4a90d9',
        icons: [
          {
            src: 'icon-bebe.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
