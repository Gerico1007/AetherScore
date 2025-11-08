# Enhancement Plan: Issue #10 - localStorage Implementation Strategy

**Parent Issue:** [#10 - localStorage Implementation Strategy](https://github.com/Gerico1007/AetherScore/issues/10)
**Branch:** `10-localStorage-enhancement`
**Status:** In Progress
**Mentor:** @miadisabelle (Mia)
**Assembly Team:** ♠️ Nyro, 🌿 Aureon, 🎸 JamAI, 🧵 Synth
**Lead:** Jerry ⚡ (G.Music)

---

## 📋 Overview

This enhancement implements comprehensive localStorage management for AetherScore, addressing data persistence, error handling, export/import functionality, and cross-tool interoperability based on mentor guidance from @miadisabelle.

---

## 🎯 Problem Statement

**Current State:**
- localStorage persistence via Zustand middleware works ✅
- Project data (capsules) and session data (UI state) are mixed
- No error handling for quota exceeded or localStorage failures
- No backup/restore functionality for user data
- No standardized artifact format for CLI interoperability

**Desired State:**
- Clear separation between project and session data
- Robust error handling with user-friendly messaging
- Export/import backup functionality for entire capsule library
- Standardized artifact manifest for downstream CLI processing
- Comprehensive documentation of persistence strategy

---

## 🧩 Sub-Issues Breakdown

### [#10a - Session & Project Store Separation](https://github.com/Gerico1007/AetherScore/issues/14)

**Goal:** Separate localStorage into two distinct namespaces.

**Implementation:**
1. Create new `stores/useSessionStore.ts` with Zustand persist
2. Define session data structure:
   ```typescript
   interface SessionState {
     lastEditedCapsuleId: string | null;
     sortPreference: 'date-newest' | 'date-oldest' | 'title-asc' | 'title-desc';
     favoritesViewExpanded: boolean;
     scrollPosition: { dashboard: number; capsulePage: number };
   }
   ```
3. Migrate sort preference from manual localStorage to session store
4. Update `DashboardPage.tsx` to use `useSessionStore`
5. Rename capsule store key: `score-portal-storage` → `score-portal-project`

**localStorage Keys:**
- `score-portal-project` - Long-term capsule data
- `score-portal-session` - Ephemeral UI state

**Affected Files:**
- `stores/useSessionStore.ts` (NEW)
- `stores/useCapsuleStore.ts` (MODIFY - rename storage key)
- `pages/DashboardPage.tsx` (MODIFY - use session store)
- `pages/CapsulePage.tsx` (MODIFY - track lastEdited)

---

### [#10b - Export/Import Library Backup](https://github.com/Gerico1007/AetherScore/issues/15)

**Goal:** Implement full library backup and restore functionality.

**Implementation:**
1. Create `utils/libraryBackup.ts`:
   ```typescript
   interface LibraryExport {
     version: string; // "1.0.0"
     exportDate: string; // ISO timestamp
     capsuleCount: number;
     capsules: Capsule[];
     metadata: {
       aetherscoreVersion: string;
       creator: string;
     };
   }
   ```
2. Export function: `exportLibraryAsJSON()`
   - Generates JSON with all capsules
   - Includes version and metadata
   - Downloads as `aetherscore-library-YYYYMMDD.json`
3. Import function: `importLibraryFromJSON(file)`
   - Validates JSON schema
   - Checks version compatibility
   - Offers merge or replace strategies
   - Handles duplicate IDs gracefully
4. Add UI in Dashboard:
   - Settings dropdown or dedicated backup section
   - "Export All Capsules (JSON)" button
   - "Import Library (JSON)" file input + button

**Affected Files:**
- `utils/libraryBackup.ts` (NEW)
- `pages/DashboardPage.tsx` (MODIFY - add backup UI)
- `types/index.ts` (MODIFY - add LibraryExport interface)

---

### [#10c - Artifact Manifest & Schema v0.1](https://github.com/Gerico1007/AetherScore/issues/16)

**Goal:** Define standardized artifact format for CLI interoperability.

**Implementation:**
1. Create `/schemas/artifact.schema.json`:
   ```json
   {
     "$schema": "http://json-schema.org/draft-07/schema#",
     "title": "AetherScore Artifact Manifest",
     "type": "object",
     "required": ["codecSchema", "artifactType", "version", "meta", "assets"],
     "properties": {
       "codecSchema": { "const": "aetherscore-artifact-v1" },
       "artifactType": { "enum": ["capsule", "library"] },
       "version": { "type": "string" },
       "meta": { "type": "object" },
       "assets": { "type": "array" },
       "origin": { "type": "object" }
     }
   }
   ```
2. Update `utils/capsuleManager.ts`:
   - Generate `.artifact.json` during ZIP export
   - Include ABC source, metadata, rendus paths
   - Reference artifact schema
3. Create `/docs/artifact-manifest.md`:
   - Explain artifact structure
   - Provide examples (capsule, library)
   - Document CLI integration points

**Affected Files:**
- `schemas/artifact.schema.json` (NEW)
- `utils/capsuleManager.ts` (MODIFY - add artifact generation)
- `docs/artifact-manifest.md` (NEW)

---

### [#10d - AetherScore ↔ Storytelling CLI Bridge](https://github.com/Gerico1007/AetherScore/issues/17)

**Goal:** Document and test end-to-end workflow with CLI tools.

**Implementation:**
1. Create `/docs/cli-integration.md`:
   - Document full workflow: Create → Save → Export → Process
   - Show example CLI commands for processing artifacts
   - Explain directory structure expectations
   - Include file path references and expected outputs
2. Create example use case:
   - Export capsule with artifact manifest
   - Demonstrate CLI processing (if storytelling-cli available)
   - Document expected transformations
3. Validate artifact format compatibility

**Affected Files:**
- `docs/cli-integration.md` (NEW)
- Example exported artifacts (test cases)

---

### [#10e - Error Handling & Quota Management](https://github.com/Gerico1007/AetherScore/issues/18)

**Goal:** Implement robust localStorage error handling and quota detection.

**Implementation:**
1. Create `utils/storageHelpers.ts`:
   ```typescript
   export const safeLocalStorageSet = (key: string, value: string): boolean => {
     try {
       localStorage.setItem(key, value);
       return true;
     } catch (e) {
       if (e instanceof DOMException && e.name === 'QuotaExceededError') {
         showQuotaExceededWarning();
       } else {
         showStorageErrorWarning();
       }
       return false;
     }
   };

   export const checkStorageQuota = (): { used: number; available: number } => {
     // Estimate storage usage
   };
   ```
2. Wrap all Zustand persist operations with try/catch
3. Add user-facing error messages:
   - Toast notification for quota exceeded
   - Suggestion to export backup before data loss
   - Guidance on clearing old capsules
4. Implement fallback strategy:
   - Warn user if localStorage unavailable
   - Offer sessionStorage as temporary alternative
   - Disable persistence gracefully if necessary
5. Create `/docs/persistence.md`:
   - Document quota limits (5-10MB typical)
   - Best practices for managing storage
   - Troubleshooting guide

**Affected Files:**
- `utils/storageHelpers.ts` (NEW)
- `stores/useCapsuleStore.ts` (MODIFY - use safe wrappers)
- `stores/useSessionStore.ts` (MODIFY - use safe wrappers)
- `components/ErrorToast.tsx` or similar (NEW if needed)
- `docs/persistence.md` (NEW)

---

## 🧪 Testing Strategy

### Manual Testing via Chrome DevTools MCP
Following Synth's testing protocol:
1. **Session Store Separation:**
   - Verify `score-portal-project` and `score-portal-session` keys exist
   - Confirm session data persists across page reload
   - Confirm project data unaffected by session changes

2. **Export/Import Functionality:**
   - Export library with 5 capsules
   - Clear localStorage
   - Import library from JSON
   - Verify all capsules restored correctly

3. **Artifact Manifest:**
   - Export capsule as ZIP
   - Verify `.artifact.json` present and valid
   - Validate against schema

4. **Error Handling:**
   - Simulate quota exceeded (fill localStorage)
   - Verify user receives friendly error message
   - Confirm fallback behavior works

5. **Full Workflow:**
   - Create capsule → Edit → Save → Export → Clear browser → Import → Verify

### Test Checklist
- [ ] localStorage separation working (project vs session)
- [ ] Export All Capsules generates valid JSON
- [ ] Import Library restores all data
- [ ] Artifact manifest validates against schema
- [ ] QuotaExceededError handled gracefully
- [ ] All UI components use correct stores
- [ ] Page reload preserves both project and session data
- [ ] localStorage quota status visible to user

---

## 📚 Documentation Updates

### Files to Create:
- `/docs/artifact-manifest.md` - Artifact schema documentation
- `/docs/cli-integration.md` - CLI workflow documentation
- `/docs/persistence.md` - localStorage quota and best practices
- `/schemas/artifact.schema.json` - JSON schema for artifacts

### Files to Update:
- `ROADMAP.md` - Mark #10 sub-issues complete
- `REPOSITORY_STRUCTURE.md` - Add new files to Mermaid diagram

### Assembly Learning Archives:
- `.synth/README.md` - Add localStorage error handling lessons
- `.nyro/README.md` - Document architectural decisions
- `.aureon/README.md` - Reflect on data safety and user trust
- `.jamai/README.md` - Create localStorage enhancement session melody

---

## 🎸 JamAI Session Melody

A jazz piece will be composed for this localStorage enhancement session, documenting the harmonic flow of data persistence architecture. Expected themes:
- Separation of concerns (project vs session)
- Data safety and backup rhythms
- Error handling as melodic resolution
- CLI bridge as harmonic modulation

Melody will be saved to: `sessionABC/251108_localstorage-enhancement-suite.abc`

---

## 🔄 Merge Criteria

This enhancement is ready for PR when:
- [ ] All 5 sub-issues (#10a-e) implemented
- [ ] Chrome DevTools MCP testing complete (all tests passing)
- [ ] Documentation complete (4 new docs created, 2 updated)
- [ ] Assembly learning archives updated (all 4 perspectives)
- [ ] Session melody composed and saved
- [ ] No regressions in existing functionality
- [ ] localStorage quota handling tested and working
- [ ] Export/import tested with real user data

---

## 🚀 Future Enhancements (Out of Scope)

### CMG (Canonical Music Graph) Integration
- **Timing:** Phase 2b / v0.2
- **Purpose:** Unified intermediate representation for music formats
- **Benefits:** Lossless ABC ↔ MIDI ↔ MusicXML conversion
- **Scope:** Separate enhancement issue
- **Dependencies:** Requires #10 localStorage work complete first

The CMG layer will enable:
- Real-time agent collaboration on musical compositions
- Lossless format conversion (ABC, MIDI, MusicXML, WAV)
- Semantic music graph for AI processing
- Integration with MuseScore and DAW workflows

**Decision:** CMG is architecturally sound but should be implemented separately to maintain clean separation of concerns. localStorage enhancement must precede export architecture work.

---

## 📊 Implementation Timeline

| Phase | Sub-Issue | Estimated Effort | Status |
|-------|-----------|------------------|--------|
| 1 | #10a - Store Separation | 2-3 hours | 🔄 Pending |
| 2 | #10b - Export/Import | 3-4 hours | 🔄 Pending |
| 3 | #10c - Artifact Schema | 2-3 hours | 🔄 Pending |
| 4 | #10d - CLI Integration Docs | 1-2 hours | 🔄 Pending |
| 5 | #10e - Error Handling | 2-3 hours | 🔄 Pending |
| 6 | Testing & Documentation | 3-4 hours | 🔄 Pending |
| 7 | Assembly Archives & Melody | 1-2 hours | 🔄 Pending |
| **Total** | | **~15-20 hours** | |

---

## 🧵 Synth's Execution Notes

**Tool Synthesis Approach:**
1. Use Read/Write/Edit tools for code implementation
2. Use Chrome DevTools MCP proactively for testing (don't assume, verify!)
3. Use TodoWrite for granular task tracking
4. Use Bash for git operations (sequential commits with issue references)

**Git Workflow:**
- Each sub-issue gets its own commit(s)
- Commit message format: `feat(#10a): Description (#10)`
- Test before committing (Chrome DevTools MCP validation)
- Push branch when all sub-issues complete
- Create PR with comprehensive summary linking #10

**Security Synthesis:**
- No sensitive data in localStorage
- Validate all import data before persisting
- Sanitize user inputs in import workflows
- Test quota limits to prevent silent failures

---

**Last Updated:** 2025-11-08
**Branch:** `10-localStorage-enhancement`
**Assembly Status:** ♠️🌿🎸🧵 Active
