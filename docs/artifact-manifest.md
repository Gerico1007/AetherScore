# AetherScore Artifact Manifest Documentation

**Version:** 1.0.0
**Schema:** `aetherscore-artifact-v1`
**Purpose:** Enable cross-tool interoperability between AetherScore (web) and downstream CLI processing tools.

---

## Overview

The **Artifact Manifest** (`.artifact.json`) is a standardized metadata file included in every AetherScore capsule export. It provides a structured, machine-readable description of the capsule's contents, enabling seamless integration with CLI tools, automation pipelines, and other creative workflows.

### Key Benefits

- **CLI Interoperability**: Downstream tools can parse the manifest to understand capsule structure without reverse-engineering
- **Format Agnostic**: Describes assets (ABC, MIDI, MusicXML, etc.) without coupling to specific file formats
- **Traceable Provenance**: Records origin, creator, and versioning information
- **Future-Proof**: Versioned schema allows backward compatibility as AetherScore evolves

---

## File Location

When you export a capsule from AetherScore, the artifact manifest is located at the root of the ZIP archive:

```
my-capsule/
├── .artifact.json          ← Artifact manifest (this file!)
├── parts/
│   └── notation-v01.abc
├── sources/
│   └── .capsule.json       ← Legacy metadata (deprecated)
├── rendus/
│   ├── midi/
│   ├── musicxml/
│   └── wav/
└── scripts/
    └── README.md
```

---

## Schema Structure

The artifact manifest follows the JSON schema defined in `/schemas/artifact.schema.json`.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `codecSchema` | string | Schema identifier: `"aetherscore-artifact-v1"` |
| `artifactType` | string | Either `"capsule"` (single composition) or `"library"` (full export) |
| `version` | string | Semantic version of the artifact format (e.g., `"1.0.0"`) |
| `meta` | object | Musical metadata (tempo, key, time signature, etc.) |
| `assets` | array | List of files/resources within the artifact |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `created` | string (ISO 8601) | Timestamp of artifact creation |
| `origin` | object | Information about the creating application/user |
| `dependencies` | array | External source materials referenced |

---

## Example: Capsule Artifact

```json
{
  "codecSchema": "aetherscore-artifact-v1",
  "artifactType": "capsule",
  "version": "1.0.0",
  "created": "2025-11-08T14:23:45.123Z",
  "meta": {
    "titre": "Zocharti Loch (Cosmic Echo)",
    "tempo": 100,
    "mesure": "4/4",
    "tonalite": "Dm",
    "ppq": 480,
    "pickup": 0,
    "version": "v01",
    "composer": "Traditional",
    "description": "A three-voice round with cosmic resonance"
  },
  "assets": [
    {
      "path": "parts/zocharti-loch-round-v01.abc",
      "type": "abc",
      "description": "ABC notation source: zocharti-loch-round-v01.abc"
    },
    {
      "path": "sources/.capsule.json",
      "type": "metadata",
      "description": "Legacy capsule metadata (deprecated, use .artifact.json)"
    }
  ],
  "origin": {
    "application": "AetherScore",
    "version": "v0.1.0",
    "platform": "web"
  },
  "dependencies": []
}
```

---

## Field Descriptions

### `meta` Object

Contains musical metadata about the composition:

- **`titre`** (string): Title of the composition
- **`tempo`** (number): Beats per minute (BPM), range: 1-500
- **`mesure`** (string): Time signature (e.g., `"4/4"`, `"3/4"`, `"6/8"`)
- **`tonalite`** (string): Key signature (e.g., `"C"`, `"Dm"`, `"F#"`)
- **`ppq`** (number): Pulses per quarter note (MIDI resolution), default: 480
- **`pickup`** (number): Pickup/anacrusis measure duration, default: 0
- **`version`** (string): Composition version identifier
- **`composer`** (string, optional): Composer or creator name
- **`description`** (string, optional): Additional context

###  `assets` Array

Lists all files/resources within the artifact:

```json
{
  "path": "parts/notation-v01.abc",
  "type": "abc",
  "description": "ABC notation source file"
}
```

**Asset Types:**
- `abc`: ABC notation source files
- `midi`: MIDI audio files
- `musicxml`: MusicXML score files
- `pdf`: PDF sheet music
- `wav`: Audio waveform files
- `metadata`: Metadata/configuration files

### `origin` Object

Tracks artifact provenance:

- **`application`**: Creating application (e.g., `"AetherScore"`)
- **`version`**: Application version (e.g., `"v0.1.0"`)
- **`platform`**: Platform/environment (`"web"`, `"cli"`, `"mobile"`)
- **`user`** (optional): User or creator identifier
- **`sessionId`** (optional): Session ID for traceability

### `dependencies` Array

External source materials referenced by the capsule:

```json
{
  "name": "backing-track.wav",
  "type": "audio",
  "uri": "sources/backing-track.wav"
}
```

---

## Usage in CLI Workflows

### Parsing the Manifest

```bash
# Extract artifact metadata
jq '.meta.titre' my-capsule/.artifact.json
# Output: "Zocharti Loch (Cosmic Echo)"

# List all ABC sources
jq -r '.assets[] | select(.type == "abc") | .path' my-capsule/.artifact.json
# Output: parts/zocharti-loch-round-v01.abc
```

### Validation Against Schema

```bash
# Validate artifact manifest
jsonschema -i my-capsule/.artifact.json schemas/artifact.schema.json
```

### Automated Processing Example

```bash
#!/bin/bash
# Process AetherScore capsule artifact

ARTIFACT=".artifact.json"
CAPSULE_DIR=$1

# Validate artifact
if ! jq -e '.codecSchema == "aetherscore-artifact-v1"' "$CAPSULE_DIR/$ARTIFACT" > /dev/null; then
  echo "Error: Invalid artifact schema"
  exit 1
fi

# Extract ABC sources and convert to MIDI
jq -r '.assets[] | select(.type == "abc") | .path' "$CAPSULE_DIR/$ARTIFACT" | while read abc_file; do
  abc2midi "$CAPSULE_DIR/$abc_file" -o "$CAPSULE_DIR/rendus/midi/$(basename "$abc_file" .abc).mid"
done

echo "Processing complete!"
```

---

## Integration with Storytelling CLI

The artifact manifest enables AetherScore to integrate with the broader creative toolchain:

```
AetherScore (Web)
   ↓ Export Capsule
.artifact.json + ABC sources
   ↓ CLI Processing
Storytelling CLI / Custom Scripts
   ↓ Transform
MIDI / MusicXML / Audio
   ↓ Import
MuseScore / DAW / Publishing
```

See [cli-integration.md](./cli-integration.md) for detailed workflow examples.

---

## Version History

### v1.0.0 (2025-11-08)
- Initial artifact manifest schema
- Support for capsule and library artifact types
- ABC, MIDI, MusicXML, PDF, WAV asset types
- Origin tracking and dependency management

---

## Schema Validation

The JSON schema is located at: `/schemas/artifact.schema.json`

**Schema Identifier:** `aetherscore-artifact-v1`

All exported artifacts must validate against this schema to ensure CLI compatibility.

---

## Future Enhancements

### Planned for v2.0.0:
- **CMG Integration**: Canonical Music Graph representation for lossless conversion
- **Spatial Audio Metadata**: 3D positioning and binaural rendering hints
- **Performance Instructions**: Articulation, dynamics, phrasing annotations
- **Collaboration Metadata**: Multi-user editing history and attribution

---

## See Also

- [CLI Integration Guide](./cli-integration.md)
- [Persistence Strategy](./persistence.md)
- [Artifact Schema (JSON)](../schemas/artifact.schema.json)

---

**Maintained by:** ♠️🌿🎸🧵 G.Music Assembly
**Last Updated:** 2025-11-08
