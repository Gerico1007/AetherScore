# AetherScore ↔ CLI Integration Workflow

**Purpose:** Document the end-to-end workflow for exporting capsules from AetherScore and processing them with CLI tools.

---

## Overview

AetherScore bridges browser-based composition with terminal-based processing pipelines. This document describes the complete workflow from creation to final output, enabling seamless integration with tools like `abc2midi`, `timidity`, `abcm2ps`, MuseScore, and custom automation scripts.

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  1. CREATE & EDIT (Browser - AetherScore)                   │
│     • Compose music using ABC notation                      │
│     • Edit metadata (tempo, key, time signature)            │
│     • Preview rendering and MIDI playback                   │
│     • localStorage auto-saves progress                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓ Export Capsule (ZIP)
┌─────────────────────────────────────────────────────────────┐
│  2. EXPORT (Web → File System)                              │
│     • Download capsule as .zip                              │
│     • Contains: .artifact.json, ABC sources, metadata       │
│     • Includes placeholder folders for rendus/             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓ Unzip & Process
┌─────────────────────────────────────────────────────────────┐
│  3. CLI PROCESSING (Terminal)                               │
│     • Parse .artifact.json for metadata                     │
│     • Convert ABC → MIDI (abc2midi)                         │
│     • Convert MIDI → WAV (timidity)                         │
│     • Generate PDF sheet music (abcm2ps)                    │
│     • Transform or analyze with custom scripts              │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓ Import / Use
┌─────────────────────────────────────────────────────────────┐
│  4. DOWNSTREAM TOOLS                                        │
│     • Import MIDI into MuseScore for editing                │
│     • Load WAV into DAW (GarageBand, Logic, Ableton)        │
│     • Publish PDF sheet music                               │
│     • Re-import JSON library backup into AetherScore        │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Guide

### Step 1: Create Capsule in AetherScore

1. Open AetherScore in your web browser
2. Click "Invoke Capsule" to create a new composition
3. Enter metadata:
   - **Title**: "My First Melody"
   - **Tempo**: 120 BPM
   - **Time Signature**: 4/4
   - **Key**: C major
4. Write ABC notation in the editor:
   ```abc
   X: 1
   T: My First Melody
   M: 4/4
   L: 1/8
   K: C
   |: CDEF | GABc | c2B2 | A4 :|
   ```
5. Preview the rendered score and play MIDI
6. Capsule is automatically saved to localStorage

---

### Step 2: Export Capsule

1. Navigate to the capsule page
2. Click the **"Download Capsule"** button
3. A ZIP file is downloaded: `My_First_Melody_capsule.zip`

**Exported Structure:**
```
my-first-melody/
├── .artifact.json              ← CLI interoperability manifest
├── parts/
│   └── part-main-v01.abc       ← ABC notation source
├── sources/
│   └── .capsule.json           ← Legacy metadata (deprecated)
├── rendus/
│   ├── midi/                   ← Placeholder for MIDI exports
│   ├── musicxml/               ← Placeholder for MusicXML
│   └── wav/                    ← Placeholder for audio
└── scripts/
    └── README.md
```

---

### Step 3: CLI Processing

#### Prerequisites

Install required CLI tools:

```bash
# macOS (via Homebrew)
brew install abcmidi timidity abcm2ps musescore

# Linux (Ubuntu/Debian)
sudo apt-get install abcmidi timidity abcm2ps musescore

# Verify installation
abc2midi --version
timidity --version
abcm2ps --version
```

#### Unzip the Capsule

```bash
# Extract the capsule
unzip My_First_Melody_capsule.zip -d ~/music-projects/

# Navigate to the capsule directory
cd ~/music-projects/my-first-melody/
```

#### Parse the Artifact Manifest

```bash
# View capsule metadata
cat .artifact.json | jq '.meta'

# Output:
# {
#   "titre": "My First Melody",
#   "tempo": 120,
#   "mesure": "4/4",
#   "tonalite": "C",
#   "ppq": 480,
#   "pickup": 0,
#   "version": "v01"
# }

# List all ABC source files
jq -r '.assets[] | select(.type == "abc") | .path' .artifact.json
# Output: parts/part-main-v01.abc
```

#### Convert ABC → MIDI

```bash
# Convert ABC notation to MIDI
abc2midi parts/part-main-v01.abc -o rendus/midi/my-first-melody.mid

# Verify MIDI file created
ls -lh rendus/midi/
```

#### Convert MIDI → WAV

```bash
# Convert MIDI to WAV audio
timidity rendus/midi/my-first-melody.mid -Ow -o rendus/wav/my-first-melody.wav

# Play the audio
afplay rendus/wav/my-first-melody.wav  # macOS
# OR
aplay rendus/wav/my-first-melody.wav   # Linux
```

#### Generate PDF Sheet Music

```bash
# Convert ABC to PDF
abcm2ps parts/part-main-v01.abc -O rendus/pdf/my-first-melody.ps
ps2pdf rendus/pdf/my-first-melody.ps rendus/pdf/my-first-melody.pdf

# Open PDF
open rendus/pdf/my-first-melody.pdf  # macOS
# OR
xdg-open rendus/pdf/my-first-melody.pdf  # Linux
```

---

### Step 4: Automated Processing Script

Create a reusable script to process any AetherScore capsule:

**`process-capsule.sh`:**

```bash
#!/bin/bash
# AetherScore Capsule Processing Script
# Usage: ./process-capsule.sh <capsule-directory>

set -e  # Exit on error

CAPSULE_DIR="${1:-.}"
ARTIFACT="$CAPSULE_DIR/.artifact.json"

# Validate artifact exists
if [ ! -f "$ARTIFACT" ]; then
  echo "Error: No .artifact.json found in $CAPSULE_DIR"
  exit 1
fi

# Validate schema
SCHEMA=$(jq -r '.codecSchema' "$ARTIFACT")
if [ "$SCHEMA" != "aetherscore-artifact-v1" ]; then
  echo "Error: Unsupported artifact schema: $SCHEMA"
  exit 1
fi

echo "Processing AetherScore capsule: $(jq -r '.meta.titre' "$ARTIFACT")"

# Create output directories
mkdir -p "$CAPSULE_DIR/rendus/midi"
mkdir -p "$CAPSULE_DIR/rendus/wav"
mkdir -p "$CAPSULE_DIR/rendus/pdf"

# Process each ABC source file
jq -r '.assets[] | select(.type == "abc") | .path' "$ARTIFACT" | while read ABC_FILE; do
  BASE_NAME=$(basename "$ABC_FILE" .abc)
  echo "Processing: $ABC_FILE"

  # ABC → MIDI
  if command -v abc2midi &> /dev/null; then
    abc2midi "$CAPSULE_DIR/$ABC_FILE" -o "$CAPSULE_DIR/rendus/midi/$BASE_NAME.mid"
    echo "  ✓ MIDI created: rendus/midi/$BASE_NAME.mid"
  else
    echo "  ⚠ abc2midi not installed, skipping MIDI generation"
  fi

  # MIDI → WAV
  if command -v timidity &> /dev/null && [ -f "$CAPSULE_DIR/rendus/midi/$BASE_NAME.mid" ]; then
    timidity "$CAPSULE_DIR/rendus/midi/$BASE_NAME.mid" -Ow -o "$CAPSULE_DIR/rendus/wav/$BASE_NAME.wav"
    echo "  ✓ WAV created: rendus/wav/$BASE_NAME.wav"
  else
    echo "  ⚠ timidity not installed, skipping WAV generation"
  fi

  # ABC → PDF
  if command -v abcm2ps &> /dev/null; then
    abcm2ps "$CAPSULE_DIR/$ABC_FILE" -O "$CAPSULE_DIR/rendus/pdf/$BASE_NAME.ps"
    if command -v ps2pdf &> /dev/null; then
      ps2pdf "$CAPSULE_DIR/rendus/pdf/$BASE_NAME.ps" "$CAPSULE_DIR/rendus/pdf/$BASE_NAME.pdf"
      rm "$CAPSULE_DIR/rendus/pdf/$BASE_NAME.ps"  # Remove intermediate PS file
      echo "  ✓ PDF created: rendus/pdf/$BASE_NAME.pdf"
    fi
  else
    echo "  ⚠ abcm2ps not installed, skipping PDF generation"
  fi
done

echo "✓ Capsule processing complete!"
echo "Output location: $CAPSULE_DIR/rendus/"
```

**Make executable and run:**

```bash
chmod +x process-capsule.sh
./process-capsule.sh ~/music-projects/my-first-melody/
```

---

## Integration with Storytelling CLI (Future)

Based on @miadisabelle's guidance, AetherScore artifacts are designed to integrate with broader creative workflows:

### Planned Workflow

```
1. Create musical capsule in AetherScore
2. Export with .artifact.json manifest
3. Process with Storytelling CLI:
   - storytelling-cli process --input my-capsule/.artifact.json
   - Automated ABC → MIDI → Scrivener document pipeline
   - Generate narrative context from musical structure
4. Import processed artifacts into iOS Scrivener
5. Final compilation to Word/PDF/Markdown for audience
```

**Status:** Storytelling CLI integration is **planned for v0.2.0** (not yet implemented).

---

## Roundtrip: CLI → AetherScore

You can also import capsules back into AetherScore:

### Method 1: Library JSON Import

1. Export full library from AetherScore Dashboard (Export button)
2. Edit the JSON file locally (add/remove capsules, modify metadata)
3. Import via Dashboard (Import → Merge or Replace)

### Method 2: Manual Library Reconstruction

If you've processed capsules via CLI and want to re-import:

```bash
# Create library export JSON manually
jq -n \
  --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --argjson capsules "$(cat my-capsules/*.json | jq -s '.')" \
  '{
    version: "1.0.0",
    exportDate: $date,
    capsuleCount: ($capsules | length),
    capsules: $capsules,
    metadata: {
      aetherscoreVersion: "v0.1.0",
      creator: "CLI Pipeline"
    }
  }' > library-export.json

# Import into AetherScore via Dashboard UI
```

---

## Example Use Cases

### Use Case 1: GarageBand Integration

```bash
# Export from AetherScore
# → Download capsule ZIP

# Process ABC → MIDI
abc2midi parts/notation.abc -o track.mid

# Import MIDI into GarageBand
open -a GarageBand track.mid

# Edit, add instrumentation, export final audio
```

### Use Case 2: MuseScore Editing

```bash
# Export from AetherScore
# → Download capsule ZIP

# Convert ABC → MusicXML (requires abc2xml or similar)
abc2xml parts/notation.abc > score.musicxml

# Open in MuseScore
musescore score.musicxml

# Edit notation, export to PDF/MIDI/WAV
```

### Use Case 3: Batch Processing Multiple Capsules

```bash
#!/bin/bash
# Process all capsules in a directory

for CAPSULE_DIR in ~/music-projects/*/; do
  if [ -f "$CAPSULE_DIR/.artifact.json" ]; then
    echo "Processing: $(basename "$CAPSULE_DIR")"
    ./process-capsule.sh "$CAPSULE_DIR"
  fi
done

echo "All capsules processed!"
```

---

## Troubleshooting

### Issue: "abc2midi: command not found"

**Solution:** Install ABC MIDI tools:

```bash
brew install abcmidi  # macOS
sudo apt-get install abcmidi  # Linux
```

### Issue: Invalid .artifact.json schema

**Solution:** Validate against schema:

```bash
npm install -g ajv-cli
ajv validate -s schemas/artifact.schema.json -d my-capsule/.artifact.json
```

### Issue: MIDI playback is silent

**Solution:** Check MIDI file creation and timidity configuration:

```bash
# Verify MIDI file size (should not be 0 bytes)
ls -lh rendus/midi/*.mid

# Test timidity with verbose output
timidity -idvvv rendus/midi/my-melody.mid
```

---

## See Also

- [Artifact Manifest Documentation](./artifact-manifest.md)
- [Persistence Strategy](./persistence.md)
- [ABC Notation Reference](http://abcnotation.com/)
- [abc2midi Documentation](https://abc.sourceforge.net/abcMIDI/)

---

**Maintained by:** ♠️🌿🎸🧵 G.Music Assembly
**Last Updated:** 2025-11-08
