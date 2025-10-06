import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Import environment detection for cross-platform routing
const envDetect = require('./env-detect.js');

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Use index.html for both dev and build (local version)
    const htmlPath = './index.html';

    // Platform-specific configuration
    const { platform, defaultPort, host, openBrowser, strictPort } = envDetect;

    console.log(`🌐 Detected platform: ${platform}`);
    console.log(`⚡ Starting dev server on port ${defaultPort}`);

    return {
      build: {
        rollupOptions: {
          input: htmlPath,
        },
      },
      server: {
        port: defaultPort,
        host: host,
        open: openBrowser ? htmlPath : false,
        strictPort: strictPort,
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
