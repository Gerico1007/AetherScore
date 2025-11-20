# Enhancement Plan: Issue #20 - Professional ABC Editor (Comprehensive)

**Issue:** https://github.com/Gerico1007/AetherScore/issues/20
**Branch:** `20-integrate-abcjs-editor`
**Status:** Phase 1 Complete ✅ | Phase 2 In Progress

---

## 🎯 Enhancement Summary (EXPANDED SCOPE)

Transform AetherScore into a **professional web-based ABC notation IDE** with:
- **CodeMirror 6** editor with ABC syntax highlighting
- **Interactive toolbar** for visual editing assistance
- **ABC Builder utilities** for programmatic manipulation
- **Enhanced selection sync** between code and rendered notation
- **Advanced features**: templates, autocomplete, drag-to-transpose

**Timeline**: 8-12 weeks (5 phases)
**Research**: See `COMPREHENSIVE_EDITOR_RESEARCH.md` for full analysis

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

## 🚀 COMPREHENSIVE IMPLEMENTATION PHASES

### Phase 1: abcjs.Editor Foundation ✅ COMPLETE
**Timeline**: Week 1-2 (Completed 2025-11-09)
**Status**: ✅ Merged to branch

**Completed Tasks**:
- ✅ Added refs for textarea, editor instance, warnings
- ✅ Initialized abcjs.Editor with auto-rendering
- ✅ Enabled selection sync (click notation → highlights code)
- ✅ Added parser warnings display
- ✅ Maintained MIDI playback and PDF export
- ✅ Preserved Zustand store persistence

**Deliverables**:
- Enhanced PartEditor.tsx with abcjs.Editor
- Selection sync functional
- Error warnings display
- Build verified (no TypeScript errors)

---

### Phase 2: CodeMirror 6 Integration 🔄 IN PROGRESS
**Timeline**: Week 3-4
**Status**: 🔄 Starting now

**Tasks**:
1. ✅ Install CodeMirror 6 dependencies
   ```bash
   npm install @uiw/react-codemirror @codemirror/language @codemirror/state @codemirror/view
   ```

2. ⏳ Create custom ABC language definition
   - File: `/utils/abcLanguage.ts`
   - Define tokens: headers (X:, T:, K:, M:), notes, bars, durations
   - Syntax highlighting rules

3. ⏳ Replace textarea with CodeMirror component
   - Update PartEditor.tsx
   - Maintain abcjs rendering integration
   - Preserve MIDI and PDF export

4. ⏳ Test syntax highlighting and rendering
   - Verify highlighting works
   - Ensure abcjs rendering still functions
   - Check MIDI playback
   - Test PDF export

**Deliverables**:
- CodeMirror 6 editor with ABC syntax highlighting
- No regression in existing features
- Professional code editor appearance

---

### Phase 3: ABC Builder Utilities
**Timeline**: Week 5-6
**Status**: 📋 Planned

**Tasks**:
1. Create `/utils/abcBuilder.ts` module

2. Implement core functions:
   - `insertNote()` - Insert note at cursor position
   - `transposeRange()` - Transpose selected notes
   - `setHeader()` - Update ABC headers
   - `validateABC()` - Wrapper around abcjs parseOnly
   - `insertMeasure()` - Add measure at position

3. Write unit tests for each function

4. Integrate with PartEditor for basic operations

**Deliverables**:
- Tested ABC manipulation utilities
- Documentation for each function
- Integration examples

---

### Phase 4: Interactive Toolbar
**Timeline**: Week 7-8
**Status**: 📋 Planned

**Tasks**:
1. Create `/components/EditorToolbar.tsx`

2. Design and implement sections:
   - **Duration Selector**: Buttons for whole, half, quarter, eighth, sixteenth notes
   - **Accidental Buttons**: Sharp, flat, natural, double sharp, double flat
   - **Key/Time Signature Pickers**: Dropdowns for common keys and time signatures
   - **Structure Tools**: New measure, repeat symbols, voice separators
   - **Smart Templates**: Common patterns (scales, arpeggios, progressions)

3. Wire up to CodeMirror cursor position

4. Use abcBuilder utilities to insert ABC text

5. Style with Tailwind (match AetherScore theme)

**Deliverables**:
- Functional toolbar with note insertion
- Professional UI matching AetherScore design
- Visual editing assistance for common operations

---

### Phase 5: Advanced Features
**Timeline**: Week 9-10
**Status**: 📋 Planned

**Tasks**:
1. **Enhanced Selection Sync**:
   - Click rendered notation → select text in CodeMirror
   - Select text in CodeMirror → highlight in rendered notation
   - Use abcjs `clickListener` + CodeMirror selection API

2. **Drag to Transpose** (Optional):
   - Enable abcjs `dragging: true`
   - On drag callback, use `transposeRange()` to update ABC
   - Re-render notation

3. **Smart Templates**:
   - Dropdown with common patterns
   - Insert at cursor position

4. **Autocomplete**:
   - CodeMirror autocomplete extension
   - Suggest note names, header values, common patterns

5. **Additional Polish**:
   - Keyboard shortcuts
   - Copy/paste enhancements
   - Multi-cursor support

**Deliverables**:
- Full bi-directional selection sync
- Optional drag-to-transpose feature
- Template insertion system
- Autocomplete functionality

---

### Phase 6: Polish & Testing
**Timeline**: Week 11-12
**Status**: 📋 Planned

**Tasks**:
1. Cross-browser testing (Chrome, Firefox, Safari, mobile)
2. Mobile responsiveness testing
3. Performance profiling (CodeMirror render speed, large ABC files)
4. Bug fixes and edge case handling
5. Update documentation (ROADMAP, README, user guide)
6. User testing with G.Music team
7. Create user guide with screenshots

**Deliverables**:
- Polished, production-ready enhanced editor
- Updated documentation
- User guide with examples
- Performance benchmarks

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
