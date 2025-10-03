# AetherScore Development Guide

This project supports **dual development environments**: Google AI Studio and local Vite development.

## 🎯 Two Development Modes

### 1. **AI Studio Development** (Browser-based prototyping)
- **Entry Point**: `index.html`
- **Dependencies**: CDN imports via importmaps (aistudiocdn.com)
- **Tailwind**: CDN version with inline config
- **Use Case**: Quick prototyping, visual testing, AI-assisted development

**Access**: https://aistudio.google.com/app/apps/drive/1ZZeC1H4nicRMndebwuQBv3Pl183xKxmx

### 2. **Local Vite Development** (Production-ready builds)
- **Entry Point**: `index.local.html`
- **Dependencies**: npm packages (see package.json)
- **Tailwind**: PostCSS plugin with tailwind.config.js
- **Use Case**: Production builds, git workflow, deployment

**Run**: `npm run dev` (serves at http://localhost:3000)

---

## 🔄 Workflow: AI Studio → Local

### When working in AI Studio:
1. Edit code directly in the browser
2. Test with live preview
3. Dependencies load from CDN automatically

### To sync to local environment:
1. Copy updated files from AI Studio
2. Commit to git repository
3. Run `npm install` if package.json changed
4. Test locally with `npm run dev`

---

## 🔄 Workflow: Local → AI Studio

### When working locally:
1. Edit code with your favorite editor
2. Run `npm run dev` for hot reload
3. Commit changes to git

### To sync to AI Studio:
1. Push changes to GitHub
2. Pull/sync in AI Studio
3. Refresh AI Studio preview

---

## 📁 File Structure

### Dual Config Files:
```
index.html          → AI Studio entry (importmaps + CDN)
index.local.html    → Vite entry (clean HTML)
```

### Shared Source Code:
```
index.tsx           → React entry point (imports CSS for local only)
App.tsx             → Main app component
components/         → React components
pages/              → Page components
stores/             → Zustand state management
utils/              → Helper functions
types/              → TypeScript types
```

### Local-Only Config:
```
vite.config.ts      → Vite configuration
tailwind.config.js  → Tailwind customization
postcss.config.js   → PostCSS pipeline
src/index.css       → Tailwind directives
```

---

## 🎨 Tailwind Configuration

Both environments use the **same custom colors**:

```css
nyro-blue:      #2E3A87
aureon-green:   #00FFC2
jam-red:        #F54E4E
cosmic-bg:      #030712
portal-border:  #1f2937
```

**AI Studio**: Tailwind config in `<script>` tag in index.html
**Local**: Tailwind config in `tailwind.config.js`

---

## 🚀 NPM Scripts

```bash
npm run dev      # Start Vite dev server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🔧 Environment Variables

Create `.env.local` in root directory:
```
GEMINI_API_KEY=your_api_key_here
```

Accessed in code as `process.env.GEMINI_API_KEY`

---

## 📦 Dependencies

### Runtime Dependencies:
- **React 18.3** - UI framework
- **React Router 6** - Routing
- **Zustand 4.5** - State management
- **abcjs 6.2** - ABC music notation rendering
- **Framer Motion 11** - Animations
- **Lucide React** - Icons
- **JSZip** - Archive creation
- **File Saver** - File downloads

### Dev Dependencies:
- **Vite 7.1** - Build tool
- **Tailwind CSS 4.1** - Styling
- **TypeScript 5.4** - Type safety

---

## 🐛 Troubleshooting

### Port 3000 already in use?
Vite will auto-select port 3001. Check console output for actual port.

### Tailwind classes not working locally?
1. Verify `src/index.css` is imported in `index.tsx`
2. Run `npm run dev` to rebuild
3. Check `tailwind.config.js` content paths

### AI Studio preview broken?
1. Ensure `index.html` (not index.local.html) is being used
2. Check browser console for importmap errors
3. Verify CDN is accessible

### Import errors in local dev?
1. Run `npm install` to ensure packages installed
2. Check `package.json` for missing dependencies
3. Restart dev server

---

## 🎯 Best Practices

1. **Prototype in AI Studio** for quick experiments
2. **Develop locally** for production features
3. **Commit frequently** to keep environments in sync
4. **Test in both** environments before major releases
5. **Don't edit config files** in AI Studio (they'll be overwritten)

---

## 📝 Notes

- `index.html` is for AI Studio (has importmaps)
- `index.local.html` is for Vite (clean)
- Both use the same React source code
- CSS import in `index.tsx` only affects local builds
- AI Studio uses CDN Tailwind, local uses PostCSS
