import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Italo Facturación',
        short_name: 'Facturación',
        theme_color: '#0b1220',
        background_color: '#0b1220',
        display: 'standalone',
        icons: [],
      },
    }),
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:4200',
    },
  },
});
