// 🧵 Synth: localStorage safety utilities
// Provides robust error handling and quota management for browser storage

export interface StorageQuotaInfo {
  used: number;
  available: number;
  total: number;
  percentUsed: number;
}

/**
 * Safely set an item in localStorage with error handling
 * @param key - localStorage key
 * @param value - Value to store (will be stringified if object)
 * @returns Success boolean
 */
export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    if (e instanceof DOMException) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.error('[Storage] Quota exceeded:', e);
        showQuotaExceededWarning(key);
      } else {
        console.error('[Storage] localStorage error:', e);
        showStorageErrorWarning(e.message);
      }
    } else {
      console.error('[Storage] Unexpected error:', e);
      showStorageErrorWarning('Unknown storage error');
    }
    return false;
  }
};

/**
 * Safely get an item from localStorage with error handling
 * @param key - localStorage key
 * @returns Value or null if not found/error
 */
export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error('[Storage] Error reading from localStorage:', e);
    return null;
  }
};

/**
 * Safely remove an item from localStorage
 * @param key - localStorage key
 * @returns Success boolean
 */
export const safeLocalStorageRemove = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('[Storage] Error removing from localStorage:', e);
    return false;
  }
};

/**
 * Estimate localStorage quota usage
 * Note: This is an approximation. navigator.storage.estimate() provides accurate data
 * but is async and not always available.
 * @returns Quota information
 */
export const estimateStorageQuota = (): StorageQuotaInfo => {
  let used = 0;

  try {
    // Calculate size of all localStorage data
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          // Each character is ~2 bytes (UTF-16)
          used += (key.length + value.length) * 2;
        }
      }
    }
  } catch (e) {
    console.error('[Storage] Error estimating quota:', e);
  }

  // Most browsers allow 5-10MB for localStorage
  // Chrome: ~10MB, Firefox: ~10MB, Safari: ~5MB
  const estimatedTotal = 10 * 1024 * 1024; // 10MB default estimate
  const available = Math.max(0, estimatedTotal - used);
  const percentUsed = (used / estimatedTotal) * 100;

  return {
    used,
    available,
    total: estimatedTotal,
    percentUsed: Math.min(100, percentUsed),
  };
};

/**
 * Get accurate storage quota using StorageManager API (async)
 * Falls back to estimate if API not available
 * @returns Promise with quota information
 */
export const getStorageQuota = async (): Promise<StorageQuotaInfo> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const total = estimate.quota || 10 * 1024 * 1024;
      const available = Math.max(0, total - used);
      const percentUsed = (used / total) * 100;

      return {
        used,
        available,
        total,
        percentUsed: Math.min(100, percentUsed),
      };
    } catch (e) {
      console.warn('[Storage] StorageManager API failed, using estimate:', e);
    }
  }

  return estimateStorageQuota();
};

/**
 * Format bytes to human-readable string
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Check if localStorage is available and working
 * @returns True if localStorage is functional
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Show quota exceeded warning to user
 * @param key - The key that failed to store
 */
const showQuotaExceededWarning = (key: string): void => {
  const quota = estimateStorageQuota();
  const message = `
🚨 Storage Quota Exceeded

Your browser's localStorage is full!

Current usage: ${formatBytes(quota.used)} / ${formatBytes(quota.total)} (${quota.percentUsed.toFixed(1)}%)

Recommendations:
1. Export your capsule library as a backup (Dashboard → Export button)
2. Delete old capsules you no longer need
3. Clear browser cache/data for this site

Failed to save: ${key}
  `.trim();

  console.error(message);
  alert(message); // TODO: Replace with toast notification component
};

/**
 * Show general storage error warning to user
 * @param errorMessage - Error message to display
 */
const showStorageErrorWarning = (errorMessage: string): void => {
  const message = `
⚠️ Storage Error

Failed to save data to localStorage.

Error: ${errorMessage}

This may happen if:
- localStorage is disabled in your browser
- You're in private/incognito mode
- Browser security settings block storage

Try:
1. Check browser settings and enable localStorage
2. Use a regular (non-private) browsing window
3. Export your work frequently as backup
  `.trim();

  console.error(message);
  alert(message); // TODO: Replace with toast notification component
};

/**
 * Get a summary of localStorage usage by key
 * Useful for debugging storage issues
 * @returns Array of {key, size} objects sorted by size
 */
export const getStorageBreakdown = (): Array<{ key: string; size: number; sizeFormatted: string }> => {
  const breakdown: Array<{ key: string; size: number; sizeFormatted: string }> = [];

  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          const size = (key.length + value.length) * 2; // UTF-16 encoding
          breakdown.push({
            key,
            size,
            sizeFormatted: formatBytes(size),
          });
        }
      }
    }
  } catch (e) {
    console.error('[Storage] Error getting storage breakdown:', e);
  }

  return breakdown.sort((a, b) => b.size - a.size);
};
