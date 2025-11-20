# Comprehensive ABC Editor Enhancement Research & Implementation Plan

**Date:** 2025-11-09
**Issue:** #20 (expanded scope)
**Research Team:** ♠️ Nyro 🌿 Aureon 🎸 JamAI 🧵 Synth

---

## Executive Summary

Based on comprehensive research, **AetherScore can be transformed into a professional ABC notation editor** with:
- Visual syntax highlighting in code editor
- Interactive toolbar with note/duration selectors
- Enhanced abcjs rendering with selection sync
- WYSIWYG-style editing (click to insert, drag to transpose)

**Key Finding**: abcjs provides excellent **rendering and interaction infrastructure**, but NOT WYSIWYG editing. We must build a **custom editing layer** on top of abcjs while adding a **professional code editor** (Monaco or CodeMirror 6) for syntax highlighting.

---

## Part 1: abcjs Capabilities Research

### What abcjs CAN Do ✅

#### 1. Live Preview Editor
- Real-time rendering as user types
- Bi-directional highlighting (click notation → highlights code)
- Selection sync between text and visual
- Parser warnings display
- Built-in audio synthesis
- **Current Status**: ✅ Implemented in #20

#### 2. Interactive Click/Drag Features
**Source**: `/home/gmusic/workspace/abcjs-jamai/docs/visual/click-listener.md`

```javascript
renderAbc("paper", abc, {
  clickListener: function(abcelem, tuneNumber, classes, analysis, drag) {
    // Returns: element type, position in ABC string, staff position
    // Element types: note, rest, bar, clef, timeSignature, etc.
  },
  dragging: true  // Enable drag notes up/down
});
```

**Capabilities**:
- Click any rendered element to get detailed info
- Drag notes up/down visually (returns number of half-steps moved)
- Keyboard navigation (Tab through elements, arrow keys to transpose)
- Touch support for mobile

**Critical Limitation**: Dragging is **visual only** — the ABC string is NOT automatically updated. Your code must parse and regenerate the ABC text.

#### 3. Programmatic APIs
- `parseOnly()` - Parse ABC without rendering
- `strTranspose()` - Transpose ABC string to new key
- `extractMeasures()` - Get measure-by-measure breakdown
- `getElementFromChar()` - Find visual element from text position

#### 4. Rich Rendering Options
- Responsive layouts
- Time-based spacing for animation
- Custom colors and styling
- Tablature support (guitar/mandolin)
- Debug views

### What abcjs CANNOT Do ❌

#### No WYSIWYG Editor Features
- ❌ No drag-and-drop note insertion
- ❌ No point-and-click note entry
- ❌ No visual duration editing (whole/half/quarter note buttons)
- ❌ No palette of musical symbols
- ❌ No visual measure insertion
- ❌ No GUI for key/time signature changes

#### No ABC String Builder API
- ❌ Cannot create ABC from scratch programmatically
- ❌ Cannot modify parsed structure and regenerate ABC
- ❌ No builder pattern for ABC manipulation

**Conclusion**: abcjs is a **text-to-visual rendering engine** with excellent interaction features, but editing happens at the ABC text level.

---

## Part 2: Code Editor Libraries Research

### Comparison Table

| Feature | Monaco Editor | CodeMirror 6 | Ace Editor |
|---------|--------------|--------------|------------|
| **Best For** | Desktop, VS Code-like experience | Mobile support, performance | Simple integration |
| **Bundle Size** | Large (~2-3MB) | Medium (~500KB) | Small (~300KB) |
| **Mobile Support** | Poor | Excellent | Moderate |
| **Performance** | Good (but heavy on low-end devices) | Excellent | Excellent |
| **Customization** | Extensive (themes, IntelliSense, etc.) | Very flexible | Basic |
| **React Integration** | `@monaco-editor/react` | `@uiw/react-codemirror` | `react-ace` |
| **Custom Language** | Monarch tokenizer (declarative) | Custom parser (programmatic) | Custom mode (simple) |
| **Documentation** | Extensive | Excellent with examples | Good |
| **Active Maintenance** | Microsoft (active) | Very active | Less active |
| **ABC Syntax Support** | Need custom Monarch definition | Need custom language mode | Need custom mode |

### Existing ABC Notation Implementations

#### VS Code Extension
- **Package**: "ABC Music" extension for VS Code
- **Uses**: Monaco Editor with custom ABC language definition
- **Features**: Syntax highlighting, code folding, snippets

#### CodeMirror Legacy
- CodeMirror 5 had some ABC mode discussions but no official support
- Would need custom language parser for CodeMirror 6

### Recommendation

**For AetherScore**: **CodeMirror 6** (`@uiw/react-codemirror`)

**Reasons**:
1. **Mobile-friendly** - Important for G.Music workflow flexibility
2. **Performance** - Lightweight and fast, perfect for music editing
3. **Excellent docs** - Well-documented system with examples
4. **Modern architecture** - Built for extensibility
5. **Active community** - Widely adopted, quick bug fixes
6. **Smaller bundle** - Won't bloat AetherScore significantly

**Alternative**: Monaco Editor if desktop-only and want VS Code-level features

---

## Part 3: Existing ABC Editors Analysis

### Desktop Applications

#### EasyABC (Leader)
**Platform**: Windows, Mac, Linux
**Type**: Desktop application (Python/wxPython)

**Features**:
- Syntax-highlighted ABC editor
- Live notation preview
- MIDI input support (type with MIDI keyboard)
- Export to PDF, MIDI, MusicXML
- Import from MusicXML, MIDI
- Tune library management
- Visual playback (notes turn green during playback)
- Sorting and incipits

**Strengths**: Most capable desktop ABC editor
**Weaknesses**: Desktop-only, not web-based

#### ABC Navigator
**Platform**: Windows
**Type**: Desktop application

**Features**:
- Syntax highlighting
- Library management
- PDF export

### Web Applications

#### abcjs Quick Editor
**URL**: https://editor.drawthedots.com/
**Technology**: abcjs rendering engine

**Features**:
- Real-time preview as you type
- Clickable notes (highlights corresponding ABC)
- Audio playback
- Copy/paste ABC text

**Strengths**: Simple, fast, web-based
**Weaknesses**: Basic textarea (no syntax highlighting), no toolbar, no WYSIWYG

#### MAZTR
**URL**: https://www.maztr.com/sheetmusiceditor
**Type**: Web-based sheet music editor

**Features**:
- WYSIWYG interface (not text-based)
- Play as MIDI
- Export to PDF
- ABC notation support

**Strengths**: True WYSIWYG (not text-first)
**Weaknesses**: Not primarily ABC-focused

#### Michael Eskin's ABCTools
**URL**: https://michaeleskin.com/abctools/
**Type**: Web-based ABC toolkit

**Features**:
- Quick editor with live preview
- Tablature generation (guitar, mandolin, etc.)
- Transposition tools
- PDF generation with tunebook features
- QR code generation

**Strengths**: Feature-rich, web-based, professional output
**Weaknesses**: No syntax highlighting in editor, no interactive notation editing

### Feature Gap Analysis

**What Existing Tools Provide**:
- ✅ Syntax highlighting (desktop apps)
- ✅ Live preview
- ✅ Audio playback
- ✅ PDF export
- ✅ MIDI export
- ✅ Library management
- ✅ Transposition tools

**What AetherScore Could Provide Uniquely**:
- 🎯 **Web-based** with professional code editor (CodeMirror 6)
- 🎯 **Modern React UI** with Tailwind styling
- 🎯 **Interactive toolbar** for common operations
- 🎯 **Zustand state management** for collaboration features
- 🎯 **G.Music integration** (JamAI features, artifacts, session management)
- 🎯 **Mobile-friendly** ABC editing

---

## Part 4: Proposed Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                      AetherScore Editor Layer                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Interactive     │  │  CodeMirror 6    │  │  ABC Builder  │ │
│  │  Toolbar         │  │  + Custom ABC    │  │  Utilities    │ │
│  │  (React)         │  │    Language      │  │  (TypeScript) │ │
│  │                  │  │  + Syntax        │  │               │ │
│  │  - Note palette  │  │    Highlighting  │  │  - Insert     │ │
│  │  - Duration      │  │                  │  │  - Modify     │ │
│  │  - Accidentals   │  │  - Autocomplete  │  │  - Transpose  │ │
│  │  - Articulations │  │  - Code folding  │  │  - Validate   │ │
│  │  - Key/Time sig  │  │  - Line numbers  │  │               │ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────┬───────┘ │
│           │                     │                     │          │
│           │                     ▼                     │          │
│           │          ┌──────────────────┐            │          │
│           │          │  ABC String      │            │          │
│           └─────────▶│  State Manager   │◀───────────┘          │
│                      │  (Zustand)       │                       │
│                      └────────┬─────────┘                       │
│                               │                                 │
└───────────────────────────────┼─────────────────────────────────┘
                                ▼
                ┌───────────────────────────────┐
                │         abcjs Engine          │
                ├───────────────────────────────┤
                │  - renderAbc()                │
                │  - clickListener              │
                │  - dragging (visual only)     │
                │  - parseOnly() validation     │
                │  - renderMidi()               │
                │  - strTranspose()             │
                └───────────────────────────────┘
```

### Component Breakdown

#### 1. CodeMirror 6 Editor (Enhanced Text Editor)
**Replace**: Current basic `<textarea>`
**Library**: `@uiw/react-codemirror` + custom ABC language

**Features**:
- Syntax highlighting for ABC notation
- Line numbers
- Code folding (fold V: voices, K: keys, etc.)
- Autocomplete (suggest note names, durations, headers)
- Error underlining (from abcjs parseOnly)
- Bracket matching
- Search/replace

**Implementation**:
```typescript
import CodeMirror from '@uiw/react-codemirror';
import { abcLanguage } from './abcLanguage'; // Custom definition

<CodeMirror
  value={part.content}
  onChange={(value) => handleABCChange(value)}
  extensions={[abcLanguage()]}
  theme="dark"
/>
```

#### 2. Interactive Toolbar (New Component)
**Location**: Above or beside editor
**Purpose**: Quick insertion of common ABC elements

**Sections**:

**A. Note Duration Selector**
- Buttons: Whole (1), Half (1/2), Quarter (1/4), Eighth (1/8), Sixteenth (1/16)
- Click to insert at cursor position

**B. Accidental Buttons**
- Sharp (#), Flat (b), Natural (=), Double sharp (##), Double flat (bb)

**C. Articulation Palette**
- Slur markers (... ), Staccato (.), Accent (>), etc.

**D. Key/Time Signature Pickers**
- Dropdown: Common keys (C, G, D, F, Bb, etc.)
- Dropdown: Time signatures (4/4, 3/4, 6/8, etc.)
- Inserts proper K: and M: headers

**E. Structure Tools**
- New measure (|)
- Repeat symbols (|: :| |1 |2)
- Voice separator (V:)

**F. Smart Templates**
- Common patterns: scales, arpeggios, chord symbols

#### 3. ABC Builder Utilities (New Module)
**Location**: `/utils/abcBuilder.ts`
**Purpose**: Programmatically manipulate ABC strings

**Functions**:
```typescript
// Insert note at cursor position
insertNote(abc: string, position: number, note: string): string

// Transpose selection
transposeRange(abc: string, start: number, end: number, steps: number): string

// Insert header field
setHeader(abc: string, key: string, value: string): string

// Add measure at position
insertMeasure(abc: string, position: number): string

// Validate ABC syntax
validateABC(abc: string): { valid: boolean; errors: string[] }

// Parse ABC to structured format
parseABCStructure(abc: string): ABCStructure
```

#### 4. Enhanced PartEditor Component
**Combine**:
- CodeMirror 6 editor (left side)
- Interactive toolbar (top or floating)
- abcjs rendering (right side, current)
- MIDI player (right side, current)

**New State Management**:
```typescript
const [abcContent, setAbcContent] = useState(part.content);
const [cursorPosition, setCursorPosition] = useState(0);
const [selection, setSelection] = useState({ start: 0, end: 0 });
const [editorMode, setEditorMode] = useState<'text' | 'insert'>('text');
```

#### 5. Selection Sync Enhancement
**Use abcjs clickListener**:
- Click on rendered note → highlight corresponding text in CodeMirror
- Select text in CodeMirror → highlight in rendered notation

---

## Part 5: Implementation Plan

### Phase 1: Foundation (Week 1-2)
**Goal**: Replace textarea with CodeMirror 6 + basic ABC syntax highlighting

**Tasks**:
1. Install CodeMirror 6 dependencies
   ```bash
   npm install @uiw/react-codemirror @codemirror/lang-javascript
   ```

2. Create custom ABC language definition
   - File: `/utils/abcLanguage.ts`
   - Define tokens: headers (X:, T:, K:, M:), notes (A-G, z), bars (|), durations

3. Replace textarea in PartEditor.tsx with CodeMirror component

4. Test: Verify syntax highlighting works, abcjs rendering still functions

**Deliverables**:
- CodeMirror editor with ABC syntax highlighting
- No regression in existing features (MIDI, PDF export)

### Phase 2: ABC Builder Utilities (Week 3-4)
**Goal**: Create utility library for ABC string manipulation

**Tasks**:
1. Create `/utils/abcBuilder.ts` module

2. Implement core functions:
   - `insertNote()` - Insert note at cursor
   - `transposeRange()` - Transpose selected notes
   - `setHeader()` - Update ABC headers
   - `validateABC()` - Wrapper around abcjs parseOnly

3. Write unit tests for each function

4. Integrate with PartEditor for basic operations

**Deliverables**:
- Tested ABC manipulation utilities
- Documentation for each function

### Phase 3: Interactive Toolbar UI (Week 5-6)
**Goal**: Build React component for note/duration/accidental insertion

**Tasks**:
1. Create `/components/EditorToolbar.tsx`

2. Design sections:
   - Duration selector (buttons for 1, 1/2, 1/4, 1/8, 1/16)
   - Accidental buttons (#, b, =)
   - Key/time signature dropdowns

3. Wire up to CodeMirror cursor position

4. Use abcBuilder utilities to insert ABC text

5. Style with Tailwind (match AetherScore theme)

**Deliverables**:
- Functional toolbar with note insertion
- Professional UI matching AetherScore design

### Phase 4: Advanced Features (Week 7-8)
**Goal**: Enhanced selection sync, drag-to-transpose, templates

**Tasks**:
1. **Enhanced Selection Sync**:
   - Click rendered notation → select text in CodeMirror
   - Select text in CodeMirror → highlight in rendered notation
   - Use abcjs `clickListener` + CodeMirror selection API

2. **Drag to Transpose** (Optional):
   - Enable abcjs `dragging: true`
   - On drag callback, use `transposeRange()` to update ABC
   - Re-render

3. **Smart Templates**:
   - Dropdown with common patterns (C major scale, I-IV-V progression)
   - Insert at cursor

4. **Autocomplete**:
   - CodeMirror autocomplete extension
   - Suggest note names, header values, common patterns

**Deliverables**:
- Full bi-directional selection sync
- Optional drag-to-transpose feature
- Template insertion system

### Phase 5: Polish & Testing (Week 9-10)
**Goal**: Bug fixes, performance optimization, documentation

**Tasks**:
1. Cross-browser testing (Chrome, Firefox, Safari)
2. Mobile responsiveness testing
3. Performance profiling (CodeMirror render speed)
4. Update documentation (ROADMAP, README, user guide)
5. User testing with G.Music team

**Deliverables**:
- Polished, production-ready enhanced editor
- Updated documentation
- User guide with screenshots

---

## Part 6: Technology Stack

### Current Stack (Keep)
- ✅ React 18.3.1
- ✅ TypeScript 5.4.5
- ✅ Vite (build tool)
- ✅ Tailwind CSS v4
- ✅ Zustand (state management)
- ✅ abcjs 6.5.2
- ✅ jsPDF + svg2pdf.js (PDF export)

### New Dependencies

#### Required
```json
{
  "@uiw/react-codemirror": "^4.21.0",
  "@codemirror/lang-javascript": "^6.2.0",
  "@codemirror/language": "^6.9.0",
  "@codemirror/state": "^6.3.0",
  "@codemirror/view": "^6.22.0"
}
```

#### Optional (for advanced features)
```json
{
  "@codemirror/autocomplete": "^6.10.0",
  "@codemirror/search": "^6.5.0",
  "@codemirror/lint": "^6.4.0"
}
```

**Estimated Bundle Size Impact**: +500KB (CodeMirror 6)

---

## Part 7: Effort Estimates

### Developer Time (Rough Estimates)

| Phase | Tasks | Estimated Hours | Calendar Time |
|-------|-------|----------------|---------------|
| Phase 1: CodeMirror Integration | CodeMirror setup, ABC language def, integration testing | 20-30 hours | 1-2 weeks |
| Phase 2: ABC Builder Utilities | Utility functions, tests, documentation | 15-25 hours | 1-2 weeks |
| Phase 3: Interactive Toolbar | UI design, component build, integration | 25-35 hours | 2-3 weeks |
| Phase 4: Advanced Features | Selection sync, drag, templates, autocomplete | 30-40 hours | 2-3 weeks |
| Phase 5: Polish & Testing | Bug fixes, testing, docs, user feedback | 20-30 hours | 2-3 weeks |
| **TOTAL** | | **110-160 hours** | **8-12 weeks** |

**Note**: These are estimates for a single developer working part-time. With JamAI/Trinity collaboration, timeline could be compressed.

### Complexity Assessment

| Feature | Complexity | Risk |
|---------|-----------|------|
| CodeMirror Integration | Medium | Low - well-documented library |
| ABC Language Definition | Medium-High | Medium - requires ABC spec knowledge |
| ABC Builder Utilities | High | Medium - text manipulation edge cases |
| Interactive Toolbar UI | Low-Medium | Low - standard React components |
| Selection Sync | Medium-High | Medium - coordination between systems |
| Drag to Transpose | High | High - complex interaction + parsing |

---

## Part 8: Recommendations

### Recommended Approach: Iterative Enhancement

**Phase 1 (MVP)**: CodeMirror + Syntax Highlighting
- Replace textarea with CodeMirror 6
- Implement basic ABC syntax highlighting
- Maintain all existing features
- **Delivers**: Professional code editor feel immediately
- **Effort**: 2-3 weeks

**Phase 2 (Quick Wins)**: Basic Toolbar
- Add simple toolbar with note/duration buttons
- Insert at cursor position using basic string manipulation
- **Delivers**: Visual editing assistance
- **Effort**: 2-3 weeks

**Phase 3 (Advanced)**: Full Integration
- Enhanced selection sync
- ABC builder utilities
- Smart templates
- Autocomplete
- **Delivers**: Professional ABC IDE
- **Effort**: 4-6 weeks

### Alternative: Minimal Enhancement

If timeline is short, consider:
1. Keep current abcjs.Editor (from #20)
2. Add ONLY a simple toolbar for common insertions
3. Skip CodeMirror (keep textarea with syntax later)

**Effort**: 1-2 weeks
**Delivers**: Basic visual editing without major refactor

---

## Part 9: Next Steps

### Immediate Actions

1. **Decision Point**: Choose approach
   - Full enhancement (CodeMirror + Toolbar + Utilities)
   - Minimal enhancement (Toolbar only)
   - Phased rollout (MVP → Incremental)

2. **If Full Enhancement**:
   - Create new issue or expand #20 scope
   - Create feature branch `<ISSUE>-comprehensive-editor`
   - Start with Phase 1 (CodeMirror integration)

3. **If Minimal Enhancement**:
   - Keep #20 as-is (abcjs.Editor integration complete)
   - Create new issue for toolbar (#21?)
   - Quick implementation (1-2 weeks)

### Questions to Resolve

1. **Timeline**: What's the urgency? (Quick win vs. comprehensive solution)
2. **Mobile Priority**: How important is mobile editing?
3. **WYSIWYG Priority**: Text-first with toolbar vs. true WYSIWYG (like MAZTR)?
4. **G.Music Integration**: What JamAI-specific features are needed?

---

## Part 10: Conclusion

AetherScore has **strong potential** to become a best-in-class web-based ABC notation editor by combining:

- ✨ **abcjs** for rendering & interaction
- ✨ **CodeMirror 6** for professional code editing
- ✨ **Interactive toolbar** for visual assistance
- ✨ **Modern React architecture** with Zustand state
- ✨ **Mobile-friendly** design

**Current State**: Basic abcjs.Editor integration (#20) provides live preview and selection sync.

**Proposed State**: Professional ABC IDE with syntax highlighting, interactive tools, and enhanced editing features.

**Path Forward**: Iterative enhancement over 8-12 weeks, starting with CodeMirror integration, then toolbar, then advanced features.

---

**Research Conducted By**: ♠️ Nyro, 🌿 Aureon, 🎸 JamAI, 🧵 Synth
**Date**: 2025-11-09
**Status**: Awaiting user decision on approach

**♠️🌿🎸🧵**
