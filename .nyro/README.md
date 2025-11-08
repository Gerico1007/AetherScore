# ♠️ Nyro's Structural Archive
*The Ritual Scribe - Memory Keeper & Pattern Recognition*

## Purpose
This folder contains Nyro's learnings about:
- Architectural patterns and structural insights
- Recursive frameworks and lattice designs
- Git workflow patterns and branching strategies
- Code organization and system design principles
- Technical decision-making frameworks

## Learning Methodology
Nyro documents through:
- Pattern matrices and decision trees
- Structural diagrams and architectural maps
- Recursive analysis of repeating problems
- Framework documentation and lattice blueprints

## Current Focus
- Git branching strategies and merge conflict patterns
- Feature integration across parallel development branches
- Structural integrity maintenance during rapid iteration
- localStorage implementation and data management architecture

## Mentorship & Guidance Network
**♠️ Nyro's Structural Mentor:**
- **Name**: Mia
- **Contact**: mia@jgwill.com
- **GitHub**: @miadisabelle
- **Role**: Technical mentor for localStorage, data management, and architectural guidance
- **Availability**: Can ask for advice anytime

The lattice grows stronger with experienced guidance.

---

## Session: 2025-11-08 - localStorage Enhancement Architecture (#10)

### Architectural Decisions

**1. Two-Tier Storage Separation (#10a)**

*Decision:* Split localStorage into two distinct namespaces
- `score-portal-project`: Long-term capsule data
- `score-portal-session`: Ephemeral UI state

*Rationale:*
- Separation of concerns (data vs UI state)
- Enables selective clearing (reset preferences without losing work)
- Clearer debugging (isolate issues to project or session layer)
- Future-proof (can migrate to IndexedDB for project, keep localStorage for session)

*Implementation Pattern:*
```typescript
// Project Store (Heavy, permanent)
export const useCapsuleStore = create<CapsuleState>()(
  persist(set, get) => ({...}), {
    name: 'score-portal-project',
    storage: createJSONStorage(() => safeStorage)
  }
)

// Session Store (Light, ephemeral)
export const useSessionStore = create<SessionState>()(
  persist(..., {
    name: 'score-portal-session',
    storage: createJSONStorage(() => safeStorage)
  }
)
```

**2. Safe Storage Wrapper Layer (#10e)**

*Decision:* Never use raw `localStorage` API, always use safe wrappers

*Pattern:*
```typescript
const safeStorage: StateStorage = {
  getItem: (name) => safeLocalStorageGet(name),
  setItem: (name, value) => safeLocalStorageSet(name, value),
  removeItem: (name) => safeLocalStorageRemove(name)
};
```

*Benefits:*
- Centralized error handling (QuotaExceededError)
- Consistent user messaging
- Graceful degradation
- No silent failures

**3. Artifact Manifest as Bridge (#10c)**

*Decision:* Use `.artifact.json` as canonical manifest for CLI interoperability

*Schema Design:*
```
codecSchema: version identifier
artifactType: capsule | library
version: semantic versioning
meta: musical metadata
assets: file references
origin: provenance tracking
```

*Architectural Impact:*
- Web app and CLI speak same language
- Future CMG integration point
- Enables automation pipelines
- Schema versioning prevents breaking changes

**4. Import Strategy Pattern (#10b)**

*Decision:* Offer merge AND replace strategies (not just one)

*Conflict Resolution:*
```typescript
// Merge: Rename conflicts with timestamp
{
  id: `${original.id}-imported-${Date.now()}`,
  meta: { titre: `${original.titre} (Imported)` }
}

// Replace: Complete wipe and restore
set({ capsules: importedCapsules })
```

*Rationale:*
- Merge = safer (no data loss)
- Replace = clean slate (backup restoration)
- User choice = better UX

**5. Documentation-First Approach (#10d)**

*Decision:* Write comprehensive docs BEFORE declaring feature complete

*Structure:*
```
docs/
├── artifact-manifest.md   (Schema reference)
├── cli-integration.md     (Workflow guide)
└── persistence.md         (Best practices)
```

*Impact:*
- Mia's guidance emphasized CLI bridge
- Documentation AS code (not afterthought)
- Enables future contributors
- CLI integration blueprint

### Structural Patterns Learned

**Pattern: Zustand Middleware Wrapping**
```typescript
// Don't pass localStorage directly
storage: createJSONStorage(() => localStorage) // ❌

// Wrap with safety layer
storage: createJSONStorage(() => safeStorage) // ✅
```

**Pattern: Error Handling at Boundaries**
```typescript
try {
  localStorage.setItem(key, value);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    showQuotaExceededWarning();
    return false; // Fail gracefully
  }
}
```

**Pattern: Schema Versioning for Future Migration**
```json
{
  "version": "1.0.0",
  "exportDate": "2025-11-08T...",
  "capsules": [...]
}
```

### Risks Identified (Pending Testing)

⚠️ **Risk 1:** localStorage key rename breaks existing users
- Old: `score-portal-storage`
- New: `score-portal-project`
- **Mitigation needed:** Migration script or user warning

⚠️ **Risk 2:** TypeScript errors from import changes
- Multiple new imports across files
- Potential type mismatches

⚠️ **Risk 3:** UI rendering issues
- New Export/Import buttons with dropdown
- File input ref handling

### Mentor Wisdom Applied

**From @miadisabelle:**
1. Session vs Project separation → Implemented ✅
2. Export/import backup → Implemented ✅
3. Artifact manifest for CLI → Implemented ✅
4. Error handling → Implemented ✅
5. "Think about downstream CLI workflow" → Documented ✅

### Next: Testing Will Validate Architecture

The lattice is designed. Now we verify it holds.

---
*"The lattice remembers what the moment forgets."* - Nyro
