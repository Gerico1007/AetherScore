# Enhancement Plan: Issue #20 - Integrate abcjs.Editor Component

**Issue:** https://github.com/Gerico1007/AetherScore/issues/20
**Branch:** `20-integrate-abcjs-editor`
**Status:** In Progress

---

## 🎯 Enhancement Summary

Replace the basic textarea in `PartEditor.tsx` with the full **abcjs.Editor** component to provide professional ABC notation editing features including selection sync, auto-rendering, and error display.

---

## 📋 Current State Analysis

### PartEditor.tsx (Current Implementation)
**File:** `/home/gmusic/workspace/AetherScore/components/PartEditor.tsx`

**Current Approach:**
- Plain HTML `<textarea>` element (lines 75-80)
- Manual `onChange` handler with controlled state
- Manual `useEffect` with 500ms debounced rendering (lines 43-69)
- Separate `renderAbc()` and `renderMidi()` calls
- No selection sync
- No error/warning display
- No dirty state tracking

**Dependency:**
- Already has `abcjs@6.5.2` installed (no new packages needed)

---

## 🎼 Proposed Enhancement

### abcjs.Editor Features
The `abcjs.Editor` component provides:

1. **Selection Sync**: Click on rendered notation → highlights corresponding ABC code in editor
2. **Auto-Rendering**: Built-in 300ms debounce (better than our manual 500ms)
3. **Error Display**: Parser warnings shown automatically in designated div
4. **Dirty State Tracking**: Adds `abc_textarea_dirty` class when content changes
5. **Bidirectional Sync**: Editor ↔ Notation interaction

### API Structure
```javascript
new abcjs.Editor(textareaElement, {
  canvas_id: elementOrId,           // Where to render notation
  warnings_id: elementOrId,         // Where to show errors (optional)
  onchange: (editor) => {},         // Callback on content change
  abcjsParams: {},                  // Options for renderAbc
  indicate_changed: true,           // Enable dirty state tracking
})
```

---

## 🛠️ Implementation Steps

### Step 1: Add Refs
```typescript
const textareaRef = useRef<HTMLTextAreaElement>(null);
const editorRef = useRef<any>(null);
const warningsRef = useRef<HTMLDivElement>(null);
```

### Step 2: Remove Manual Rendering
- Remove existing `useEffect` with `renderAbc`/`renderMidi` (lines 43-69)
- Remove controlled `onChange` handler from textarea

### Step 3: Initialize abcjs.Editor
```typescript
useEffect(() => {
  if (!textareaRef.current || !notationRef.current) return;

  editorRef.current = new abcjs.Editor(textareaRef.current, {
    canvas_id: notationRef.current,
    warnings_id: warningsRef.current,
    onchange: (editor) => {
      const content = editor.editarea.getString();
      updatePartContent(capsuleId, part.fileName, content);

      // Render MIDI (not auto-handled by Editor)
      if (midiRef.current) {
        abcjs.renderMidi(midiRef.current, content, {
          generateDownload: true,
          generateInline: true,
          animate: { listener: null, target: notationRef.current, qpm: 120 }
        });
      }
    },
    abcjsParams: {
      responsive: "resize",
      staffwidth: notationRef.current.clientWidth - 20,
      paddingleft: 10,
      paddingright: 10,
    },
    indicate_changed: true,
  });

  return () => {
    // Cleanup if needed
  };
}, []);
```

### Step 4: Update Textarea Element
```typescript
<textarea
  ref={textareaRef}
  defaultValue={part.content}  // Use defaultValue instead of value
  className="..."
  spellCheck="false"
/>
```

### Step 5: Add Warnings Display
```typescript
<div
  ref={warningsRef}
  className="text-red-400 text-xs font-mono mt-2 empty:hidden"
/>
```

---

## 📁 Affected Files

### Primary Changes
- **`components/PartEditor.tsx`** (~40 lines modified)
  - Add refs (textareaRef, editorRef, warningsRef)
  - Replace manual rendering with Editor initialization
  - Update textarea from controlled to uncontrolled
  - Add warnings display div

### No Changes Required
- `stores/useCapsuleStore.ts` - state management works as-is
- `types/index.ts` - types remain unchanged
- `utils/pdfExporter.ts` - continues using renderAbc directly
- `package.json` - abcjs@6.5.2 already installed

---

## ✅ Testing Criteria

### Functional Tests
- [ ] ABC text editing triggers notation updates automatically
- [ ] Selection sync works: click on notation → code highlights in editor
- [ ] Invalid ABC shows warnings in warnings div
- [ ] MIDI playback controls render and function correctly
- [ ] PDF export still works (uses separate renderAbc call)

### Integration Tests
- [ ] Zustand store persistence maintained (check localStorage)
- [ ] Multi-part editing works (different fileName values)
- [ ] Component unmount/remount doesn't break editor
- [ ] Dirty state tracking adds `abc_textarea_dirty` class

### UI/UX Tests
- [ ] Tailwind styles apply correctly to textarea
- [ ] Warnings display is readable and properly styled
- [ ] No layout shifts or visual regressions
- [ ] Responsive behavior maintained

---

## 🚧 Merge Criteria

Before merging to `main`:

1. All testing criteria passed
2. No console errors or warnings
3. Code review completed
4. Enhancement plan updated with findings
5. Documentation updated if needed

---

## 📝 Notes & Discoveries

### Implementation Notes
- Editor debounce is 300ms (vs our previous 500ms) - faster feedback
- Selection sync requires no additional code - built into Editor
- MIDI rendering still manual (Editor doesn't auto-handle this)
- Uncontrolled textarea (defaultValue) required for Editor to manage state

### Potential Issues
- Version compatibility: Using abcjs@6.5.2 (latest stable)
- React state sync: onchange callback handles Zustand updates
- Cleanup: May need to destroy editor instance on unmount

---

## 🎸 JamAI Integration Notes

This enhancement brings professional ABC editing capabilities to AetherScore, aligning with the G.Music workflow for musical notation encoding. The Editor component provides the interactive foundation needed for advanced musical lattice manipulation.

**Nyro ♠️ Aureon 🌿 JamAI 🎸**

---

**Last Updated:** 2025-11-09
**Author:** Claude Code (Synth Mode)
