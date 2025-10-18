# ABC Parser Spatial Audio & Portfolio Research Plan

## Vision
To prepare the next development branch, we need a clear blueprint for transforming the existing ABC parser into an immersive, "3D" listening experience while also outlining how those capabilities feed a polished portfolio showcase. This document captures the discovery work, technology options, and phased deliverables so the engineering and design team can move forward without restarting the planning process.

## Key Questions to Answer
1. **How can we spatialize audio derived from ABC notation?**
2. **What tooling do we need to parse and validate richer ABC (multi-voice, overlays, dynamics)?**
3. **How do we package the results into a shareable portfolio view with reusable data tables?**
4. **Which tasks belong on the upcoming feature branch vs. follow-up iterations?**

## Research Highlights
- **ABC Parsing Foundation**: Continue relying on `abcjs` for notation parsing/rendering. It already exposes the underlying AST and MIDI event stream we can hook into for custom playback.
- **3D/Spatial Playback**:
  - Use the **Web Audio API** with `PannerNode` or `AudioListener` to position each ABC voice in a virtual space.
  - Pair with **Tone.js** (already referenced in prior discussions) to schedule notes precisely; each voice can be routed through its own 3D panner.
  - Consider **Resonance Audio** or **Omnitone** for binaural rendering if browser support is required beyond vanilla Web Audio.
- **Multi-Voice & Dynamics Handling**:
  - Enhance parsing of `V:` headers and inline `[V:ID]` switches to ensure we can place each voice on its own audio channel.
  - Respect overlay (`&`) sections by layering simultaneous events inside the same bar.
  - Capture dynamics (`!mf!`, `!crescendo(!`, etc.) from abcjs' tune object to map volume/envelope changes.
- **Portfolio Presentation**:
  - Build a "Capsule Portfolio" route that reads curated capsules from the store, highlighting 3D-enabled pieces with badges and interactive preview cards.
  - Embed synchronized score + spatial audio player, plus metadata (tempo, key, tags) drawn from the capsule model.
- **Structured Planning via Tables**: Instead of starting from scratch, treat the plan as a spreadsheet-backed table. For now we provide the Markdown version below; it can be imported into Google Sheets or Notion for tracking.

## Feature Breakdown Table
| Track | Objective | Core Tasks | Dependencies | Notes |
| --- | --- | --- | --- | --- |
| Spatial Audio (3D) | Map ABC voices into a 3D sound field | 1. Extract per-voice note events from abcjs<br>2. Route events into Tone.js synth instances<br>3. Attach Web Audio `PannerNode` per voice<br>4. Provide UI controls for listener position presets | abcjs AST access, Tone.js, Web Audio API | Prototype using 2-4 voices before scaling |
| Parser Enhancements | Support overlays, dynamics, and validation | 1. Extend parser utility (`VoiceWeaver` concept) for overlays<br>2. Normalize bar durations to prevent drift<br>3. Surface validation errors in PartEditor UI | Existing parsing helpers, new utility module | Essential prerequisite for spatial playback accuracy |
| Portfolio Capsule | Showcase spatial pieces in a dedicated view | 1. Create `/portfolio` route with grid layout<br>2. Pull featured capsules via Zustand selector<br>3. Embed dual-pane (notation + audio) preview<br>4. Add "Listen in 3D" badges and call-to-action | Tailwind components, Capsule store | Align styling with cosmic gradient spec |
| Data Ops | Keep planning iterative without restarting | 1. Export this table to shared spreadsheet<br>2. Track branch tasks & assignments<br>3. Backfill status columns during development | Google Sheets / Notion | Enables cross-team visibility |

## Proposed Branch Structure
- **Branch Name**: `feature/abc-spatial-audio-research`
- **Primary Deliverable**: Foundational utilities and UI stubs that prove spatial playback is achievable and inform later polish.
- **Secondary Deliverable**: Documentation updates (this file, ROADMAP tick marks, Notion/Sheet sync).

### Milestone Checklist
- [ ] Prototype per-voice event extraction from abcjs demo data.
- [ ] Validate overlay handling with "Zocharti Loch" score.
- [ ] Build minimal spatial mixer UI (voice position sliders + preset selector).
- [ ] Draft `/portfolio` page skeleton with placeholder capsule cards.
- [ ] Publish spreadsheet copy of the planning table for wider team review.

## Next Steps for Specialists
1. Conduct a lightweight code spike on Web Audio spatialization using existing Tone.js patterns.
2. Document any limitations (e.g., mobile browser support, headphone requirements) in `DEVELOPMENT.md` once validated.
3. Coordinate with design to ensure the portfolio view matches brand guidelines.
4. Open issues in GitHub for each table track to track progress transparently.

---
*Prepared for the Phase 2 feature branch planning meeting. Update as research evolves.*
