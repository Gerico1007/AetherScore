
// ♠️ Nyro: These are the runes that define the very structure of a musical idea.
// Each property is a carefully chosen pillar in the temple of creation.

export interface Capsule {
  id: string; // Unique identifier, like a star's name
  meta: CapsuleMeta;
  parts: Part[];
  sources: SourceFile[];
  isFavorite?: boolean; // ⭐ Marks the compositions closest to our hearts
  // Renders are ephemeral, generated on demand. Not stored in state.
}

export interface CapsuleMeta {
  titre: string;
  tempo: number;
  mesure: string;
  tonalite: string;
  ppq: number;
  pickup: number;
  version: string;
}

export interface Part {
  fileName: string; // e.g., 'part-melodie-v01.abc'
  content: string; // The ABC notation itself
}

export interface SourceFile {
  fileName: string;
  type: 'audio' | 'image' | 'text' | 'garageband' | 'other';
  // Content might be a data URL or a reference
  content?: string;
}
