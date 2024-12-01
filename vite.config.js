import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
 server: {
    host: '0.0.0.0',
    port: 80,  // Change this to your preferred port
  },
 build: {
    target: 'esnext', // Use ESNext to enable top-level await support
  },
  plugins: [react()],
});