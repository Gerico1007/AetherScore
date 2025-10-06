/**
 * Environment Detection Module
 * Detects Termux vs Linux environments for cross-platform routing
 *
 * @module env-detect
 */

/**
 * Detect if running in Termux environment
 * Checks multiple Termux-specific environment variables
 */
const isTermux = !!(
  process.env.PREFIX?.includes('com.termux') ||
  process.env.TERMUX_VERSION ||
  process.env.ANDROID_ROOT ||
  process.env.TERMUX_APP_PID
);

/**
 * Detect platform type
 * Can be overridden by FORCE_TERMUX or FORCE_LINUX environment variables
 */
const getPlatform = () => {
  if (process.env.FORCE_TERMUX === '1') return 'termux';
  if (process.env.FORCE_LINUX === '1') return 'linux';
  return isTermux ? 'termux' : 'linux';
};

const platform = getPlatform();

/**
 * Platform-specific configuration presets
 */
const config = {
  termux: {
    defaultPort: 8080,
    host: '0.0.0.0',
    openBrowser: false,
    strictPort: false,
    useLightningCSS: false // Pure JavaScript CSS processing
  },
  linux: {
    defaultPort: 3000,
    host: '0.0.0.0',
    openBrowser: true,
    strictPort: false,
    useLightningCSS: true // Native LightningCSS for performance
  }
};

module.exports = {
  isTermux,
  platform,
  config: config[platform],

  // Expose individual config values for convenience
  get defaultPort() { return config[platform].defaultPort; },
  get host() { return config[platform].host; },
  get openBrowser() { return config[platform].openBrowser; },
  get strictPort() { return config[platform].strictPort; },
  get useLightningCSS() { return config[platform].useLightningCSS; }
};
