# AetherScore Persistence Strategy

**Purpose:** Document localStorage usage, quota management, error handling, and best practices for data persistence in AetherScore.

---

## Overview

AetherScore uses browser **localStorage** to persist user data across sessions. This document explains how data is stored, how quota limits are managed, and how to troubleshoot storage issues.

---

## Storage Architecture

### Two-Tier Storage Model

AetherScore separates data into two distinct localStorage keys:

| Key | Purpose | Data Type | Persistence |
|-----|---------|-----------|-------------|
| `score-portal-project` | Long-term capsule data | Capsules (ABC notation, metadata) | Permanent (until manually deleted) |
| `score-portal-session` | Short-term UI state | Sort preferences, last edited capsule, scroll position | Session-persistent (survives page reloads) |

**Benefits:**
- **Separation of Concerns**: Project data and UI state don't interfere
- **Easier Debugging**: Storage issues can be isolated to project or session data
- **Selective Clearing**: Users can reset UI preferences without losing capsules

---

## localStorage Limits

### Browser Quota Limits

Each browser has different localStorage quota limits:

| Browser | Quota Limit | Notes |
|---------|-------------|-------|
| Chrome | ~10 MB | Per origin |
| Firefox | ~10 MB | Per origin |
| Safari | ~5 MB | Per origin, may prompt user |
| Edge | ~10 MB | Per origin |

**Important:**
- Quota is shared across **all localStorage keys** for a given origin
- UTF-16 encoding: each character = ~2 bytes
- Example: A 1000-capsule library ≈ 2-5 MB (depending on ABC complexity)

---

## Quota Management

### Automatic Error Handling

AetherScore wraps all localStorage operations with error handling (via `storageHelpers.ts`):

```typescript
import { safeLocalStorageSet, safeLocalStorageGet } from '../utils/storageHelpers';

// Safely set data with automatic error handling
const success = safeLocalStorageSet('my-key', 'my-value');

if (!success) {
  // User has been notified of quota issue
  // Fallback logic here
}
```

**What happens on quota exceeded:**
1. Error is caught (`QuotaExceededError`)
2. User sees alert with storage usage info
3. Recommendations provided (export backup, delete old capsules)
4. Operation fails gracefully (no data loss to existing capsules)

---

## Checking Storage Usage

### Via Browser DevTools

**Chrome/Edge:**
1. Open DevTools (F12)
2. Go to **Application** tab
3. Navigate to **Storage** → **Local Storage** → `http://localhost:5173` (or your domain)
4. View `score-portal-project` and `score-portal-session` keys
5. Right-click → **Clear** to manually delete

**Firefox:**
1. Open DevTools (F12)
2. Go to **Storage** tab
3. Expand **Local Storage**
4. View/edit/delete individual keys

### Via AetherScore Console

```javascript
// Get storage breakdown
import { getStorageBreakdown, getStorageQuota } from './utils/storageHelpers';

// See which keys are using the most space
const breakdown = getStorageBreakdown();
console.table(breakdown);

// Get accurate quota estimate
const quota = await getStorageQuota();
console.log(`Used: ${quota.used} / ${quota.total} (${quota.percentUsed.toFixed(1)}%)`);
```

---

## Data Migration & Versioning

### Current Schema Version: 1.0.0

AetherScore library exports include a `version` field for forward compatibility:

```json
{
  "version": "1.0.0",
  "exportDate": "2025-11-08T14:00:00Z",
  "capsules": [...]
}
```

**Future Migration Strategy:**
- Minor version bumps (1.0.0 → 1.1.0): Backward-compatible changes (new optional fields)
- Major version bumps (1.0.0 → 2.0.0): Breaking changes (require migration scripts)

**Handling Version Mismatches:**
```typescript
const validation = validateLibraryExport(importedData);

if (!validation.valid) {
  // Errors include version incompatibility warnings
  console.error(validation.errors);
}
```

---

## Backup & Restore

### Export Strategies

**1. Individual Capsule Export (ZIP)**
- Location: Capsule page → Download button
- Format: ZIP archive with `.artifact.json`, ABC sources, metadata
- Use case: Share specific composition, CLI processing

**2. Full Library Export (JSON)**
- Location: Dashboard → Export button
- Format: JSON file with all capsules + metadata
- Use case: Backup entire library, migrate browsers, version control

### Import Strategies

**Merge Import:**
- Adds imported capsules to existing library
- Renames duplicates (appends `-imported-{timestamp}`)
- Safe: Won't delete existing data

**Replace Import:**
- **⚠️ DESTRUCTIVE**: Deletes all current capsules
- Replaces library with imported data
- Use case: Fresh install, restore from backup

---

## Troubleshooting

### Issue: "Quota Exceeded" Error

**Symptoms:**
- Alert: "Your browser's localStorage is full!"
- New capsules won't save
- Edits to existing capsules fail to persist

**Solutions:**
1. **Export backup** (Dashboard → Export button)
2. **Delete old capsules** you no longer need
3. **Clear browser data** for AetherScore origin only:
   - Chrome: Settings → Privacy → Clear browsing data → Advanced → Cookies and site data
   - Select time range and check "Cookies and other site data"
4. **Increase quota** (not recommended, browser-dependent):
   - Some browsers (Safari) may prompt to increase quota

---

### Issue: localStorage Disabled or Unavailable

**Symptoms:**
- Alert: "Failed to save data to localStorage"
- Data doesn't persist across page reloads
- Changes lost on browser close

**Causes:**
- Private/Incognito browsing mode
- Browser security settings block storage
- Browser extension interference

**Solutions:**
1. **Use regular browsing window** (not incognito)
2. **Check browser settings**:
   - Chrome: Settings → Privacy → Site settings → Cookies → Allow all cookies
   - Firefox: Preferences → Privacy → History → Use custom settings → Accept cookies
3. **Disable interfering extensions** (privacy/security extensions may block localStorage)
4. **Use export/import** as manual "save file" workflow

---

### Issue: Data Corruption

**Symptoms:**
- Capsules display incorrectly
- Missing metadata fields
- App crashes on load

**Solutions:**
1. **Clear localStorage** and re-import from backup:
   ```javascript
   localStorage.removeItem('score-portal-project');
   localStorage.removeItem('score-portal-session');
   location.reload();
   ```
2. **Manually inspect/edit localStorage**:
   - Open DevTools → Application → Local Storage
   - View `score-portal-project` value (JSON)
   - Fix malformed JSON if possible
3. **Report bug** with steps to reproduce

---

## Best Practices

### For Users

✅ **DO:**
- Export library backup regularly (weekly recommended)
- Delete old/test capsules you don't need
- Use descriptive capsule titles for easier management
- Monitor storage usage if you have 50+ capsules

❌ **DON'T:**
- Rely solely on localStorage (export backups!)
- Fill localStorage to 100% (leave headroom for new edits)
- Edit localStorage JSON directly (use import/export features)

### For Developers

✅ **DO:**
- Use `safeLocalStorageSet/Get/Remove` wrappers (never raw `localStorage` API)
- Test quota exceeded scenarios
- Provide clear error messages to users
- Log storage operations for debugging

❌ **DON'T:**
- Store large binary data in localStorage (use IndexedDB or Blob URLs)
- Assume localStorage is always available
- Skip validation on imported data
- Store sensitive data unencrypted

---

## Performance Considerations

### localStorage is Synchronous

**Implications:**
- Blocking operation (freezes UI during write)
- Large writes (>1MB) may cause lag
- Zustand persist middleware auto-debounces writes

**Optimization:**
- Zustand persist middleware batches state updates
- Only modified capsules trigger re-serialization
- Session store (UI state) is smaller, writes are fast

### Alternatives to localStorage (Future)

For v0.2.0+, consider:
- **IndexedDB**: Asynchronous, larger quota (~50MB+), better for large libraries
- **File System Access API**: Direct file read/write (Chrome 86+)
- **Cloud sync**: Optional backend persistence (requires user account)

---

## Debugging Commands

### Check Storage Status

```javascript
// In browser console
import { getStorageQuota, formatBytes } from './utils/storageHelpers';

const quota = await getStorageQuota();
console.log(`Storage used: ${formatBytes(quota.used)} / ${formatBytes(quota.total)}`);
console.log(`Percentage: ${quota.percentUsed.toFixed(2)}%`);
```

### Inspect Capsule Data

```javascript
// View project storage
const projectData = JSON.parse(localStorage.getItem('score-portal-project'));
console.log('Capsules:', projectData.state.capsules.length);
console.table(projectData.state.capsules.map(c => ({
  id: c.id,
  title: c.meta.titre,
  parts: c.parts.length
})));
```

### Force Clear Storage

```javascript
// ⚠️ WARNING: This deletes ALL capsules!
localStorage.clear();
location.reload();
```

---

## See Also

- [Artifact Manifest Documentation](./artifact-manifest.md)
- [CLI Integration Guide](./cli-integration.md)
- [Library Backup Utilities](../utils/libraryBackup.ts)
- [Storage Helpers](../utils/storageHelpers.ts)

---

**Maintained by:** ♠️🌿🎸🧵 G.Music Assembly
**Last Updated:** 2025-11-08
