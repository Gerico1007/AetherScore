<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AetherScore - Score Portal

A modern music notation application built with React, TypeScript, and ABC notation for creating and managing musical compositions.

View your app in AI Studio: https://ai.studio/apps/drive/1ZZeC1H4nicRMndebwuQBv3Pl183xKxmx

## 📚 Project Documentation

**IMPORTANT**: Keep the following documentation files updated:

- **[REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md)** - Mermaid diagram of the codebase structure
  - **Update when**: Adding/removing/moving files or directories
  - **Why**: Helps all participants understand the project architecture

- **[ROADMAP.md](ROADMAP.md)** - Development roadmap and maintenance tasks
  - **Update when**: Completing features, planning new work, or after major changes
  - **Why**: Keeps everyone aligned on project goals and progress

- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guidelines and technical details

## 🚀 Run Locally

**Prerequisites:**  Node.js (v18 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

See [REPOSITORY_STRUCTURE.md](REPOSITORY_STRUCTURE.md) for a visual Mermaid diagram of the codebase.

Key directories:
- `components/` - React components (Header, PartEditor, CreateCapsuleModal)
- `pages/` - Page components (Dashboard, Capsule)
- `stores/` - Zustand state management
- `utils/` - Utility functions (capsuleManager)
- `types/` - TypeScript type definitions

## 🎯 Features

- 🎵 ABC notation editing with real-time preview
- 📦 Musical capsule management system
- 🎨 Modern UI with Tailwind CSS v4
- 🔄 State management with Zustand
- 📱 Responsive design with Framer Motion animations

## 📋 Development Workflow

1. **Before making structural changes**: Review `REPOSITORY_STRUCTURE.md`
2. **After adding/moving files**: Update the Mermaid diagram in `REPOSITORY_STRUCTURE.md`
3. **After completing features**: Update `ROADMAP.md` with progress
4. **When changing setup**: Update this `README.md`

## 🤝 Contributing

All contributors should maintain documentation as part of their workflow:
- Update Mermaid diagrams when restructuring code
- Mark completed items in the roadmap
- Document new features and setup changes

---

**Maintained by**: Jerry ⚡ and the G.Music Assembly (♠️🌿🎸🧵)
