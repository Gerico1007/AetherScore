const { useLightningCSS } = require('./env-detect.js');

/**
 * PostCSS Configuration with Cross-Platform Support
 *
 * - Linux: Uses @tailwindcss/postcss with LightningCSS (native performance)
 * - Termux: Uses tailwindcss (pure JavaScript, no native binaries)
 *
 * Auto-detects environment via env-detect.js module
 */
export default useLightningCSS
  ? {
      // Linux: LightningCSS-powered Tailwind (faster, requires native binaries)
      plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
      },
    }
  : {
      // Termux: Pure JavaScript Tailwind (compatible with ARM64 Android)
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
