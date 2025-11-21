/**
 * ABC Builder Utilities
 *
 * Programmatic tools for manipulating ABC notation strings.
 * This module powers the interactive toolbar and advanced editing features.
 *
 * @author JamAI 🎸 & The Trinity (♠️🌿🧵)
 * @see https://abcnotation.com/wiki/abc:standard:v2.1
 */

import abcjs from 'abcjs';

// ============================================================================
// TYPES
// ============================================================================

export interface ABCHeader {
  key: string;
  value: string;
  line: number;
  start: number;
  end: number;
}

export interface ABCNote {
  pitch: string;
  octaveMarker: string;
  accidental: string;
  duration: string;
  position: number;
}

export interface ABCValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  tuneCount: number;
}

export interface InsertOptions {
  duration?: string;
  accidental?: '' | '^' | '^^' | '_' | '__' | '=';
  octave?: number; // -2 to 2 (,, , normal ' '')
  addSpace?: boolean;
}

// ============================================================================
// NOTE CONSTANTS
// ============================================================================

/**
 * Standard note names in ABC notation
 */
export const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const NOTE_NAMES_LOWER = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];

/**
 * Common durations in ABC notation
 */
export const DURATIONS = {
  whole: '4',
  half: '2',
  quarter: '',
  eighth: '/2',
  sixteenth: '/4',
  thirtySecond: '/8',
  dottedHalf: '3',
  dottedQuarter: '3/2',
  dottedEighth: '3/4'
};

/**
 * Accidental markers
 */
export const ACCIDENTALS = {
  natural: '=',
  sharp: '^',
  flat: '_',
  doubleSharp: '^^',
  doubleFlat: '__'
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate ABC notation string using abcjs parser
 * @param abc - ABC notation string
 * @returns Validation result with errors and warnings
 */
export function validateABC(abc: string): ABCValidationResult {
  const result: ABCValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    tuneCount: 0
  };

  try {
    const parsed = abcjs.parseOnly(abc);
    result.tuneCount = parsed.length;

    // Check each tune for warnings
    parsed.forEach((tune: any, index: number) => {
      if (tune.warnings && tune.warnings.length > 0) {
        tune.warnings.forEach((warning: string) => {
          result.warnings.push(`Tune ${index + 1}: ${warning}`);
        });
      }
    });

    // If no tunes were parsed, it's likely invalid
    if (result.tuneCount === 0 && abc.trim().length > 0) {
      result.valid = false;
      result.errors.push('No valid ABC tunes found in input');
    }
  } catch (error: any) {
    result.valid = false;
    result.errors.push(error.message || 'Unknown parsing error');
  }

  return result;
}

// ============================================================================
// NOTE INSERTION
// ============================================================================

/**
 * Build an ABC note string from components
 * @param pitch - Note letter (C-G, a-g)
 * @param options - Duration, accidental, octave options
 * @returns ABC notation string for the note
 */
export function buildNote(pitch: string, options: InsertOptions = {}): string {
  const {
    duration = '',
    accidental = '',
    octave = 0,
    addSpace = true
  } = options;

  let note = '';

  // Add accidental
  note += accidental;

  // Add pitch
  note += pitch;

  // Add octave markers
  if (octave > 0) {
    note += "'".repeat(octave);
  } else if (octave < 0) {
    note += ','.repeat(Math.abs(octave));
  }

  // Add duration
  note += duration;

  // Add trailing space if requested
  if (addSpace) {
    note += ' ';
  }

  return note;
}

/**
 * Insert a note at a specific position in ABC string
 * @param abc - ABC notation string
 * @param position - Character position to insert at
 * @param note - Note to insert (or use pitch + options)
 * @param options - Insert options (if note is just a pitch letter)
 * @returns Modified ABC string
 */
export function insertNote(
  abc: string,
  position: number,
  note: string,
  options?: InsertOptions
): string {
  // If note is a single letter, build full note string
  const noteStr = note.length === 1 ? buildNote(note, options) : note;

  return abc.slice(0, position) + noteStr + abc.slice(position);
}

/**
 * Insert a rest at a specific position
 * @param abc - ABC notation string
 * @param position - Character position to insert at
 * @param duration - Duration of rest (default is quarter rest)
 * @returns Modified ABC string
 */
export function insertRest(
  abc: string,
  position: number,
  duration: string = ''
): string {
  return abc.slice(0, position) + `z${duration} ` + abc.slice(position);
}

/**
 * Insert a bar line at a specific position
 * @param abc - ABC notation string
 * @param position - Character position to insert at
 * @param barType - Type of bar line (|, ||, |:, :|, etc.)
 * @returns Modified ABC string
 */
export function insertBar(
  abc: string,
  position: number,
  barType: string = '|'
): string {
  return abc.slice(0, position) + ` ${barType} ` + abc.slice(position);
}

// ============================================================================
// HEADER MANIPULATION
// ============================================================================

/**
 * Parse all headers from ABC string
 * @param abc - ABC notation string
 * @returns Array of parsed headers with positions
 */
export function parseHeaders(abc: string): ABCHeader[] {
  const headers: ABCHeader[] = [];
  const lines = abc.split('\n');
  let position = 0;

  lines.forEach((line, lineNum) => {
    const match = line.match(/^([A-Za-z]):\s*(.*)$/);
    if (match) {
      headers.push({
        key: match[1],
        value: match[2],
        line: lineNum,
        start: position,
        end: position + line.length
      });
    }
    position += line.length + 1; // +1 for newline
  });

  return headers;
}

/**
 * Get a specific header value
 * @param abc - ABC notation string
 * @param key - Header key (X, T, K, M, L, Q, etc.)
 * @returns Header value or undefined if not found
 */
export function getHeader(abc: string, key: string): string | undefined {
  const headers = parseHeaders(abc);
  const header = headers.find(h => h.key.toUpperCase() === key.toUpperCase());
  return header?.value;
}

/**
 * Set or update a header field
 * @param abc - ABC notation string
 * @param key - Header key (X, T, K, M, L, Q, etc.)
 * @param value - New value for the header
 * @returns Modified ABC string
 */
export function setHeader(abc: string, key: string, value: string): string {
  const headers = parseHeaders(abc);
  const existing = headers.find(h => h.key.toUpperCase() === key.toUpperCase());

  if (existing) {
    // Replace existing header
    const before = abc.slice(0, existing.start);
    const after = abc.slice(existing.end);
    return before + `${key}:${value}` + after;
  } else {
    // Add new header (after X: if present, otherwise at start)
    const xHeader = headers.find(h => h.key === 'X');
    if (xHeader) {
      const insertPos = xHeader.end + 1;
      return abc.slice(0, insertPos) + `${key}:${value}\n` + abc.slice(insertPos);
    } else {
      return `${key}:${value}\n` + abc;
    }
  }
}

/**
 * Remove a header field
 * @param abc - ABC notation string
 * @param key - Header key to remove
 * @returns Modified ABC string
 */
export function removeHeader(abc: string, key: string): string {
  const headers = parseHeaders(abc);
  const existing = headers.find(h => h.key.toUpperCase() === key.toUpperCase());

  if (existing) {
    const before = abc.slice(0, existing.start);
    // Include the newline in removal
    const after = abc.slice(existing.end + 1);
    return before + after;
  }

  return abc;
}

// ============================================================================
// TRANSPOSITION
// ============================================================================

/**
 * Transpose ABC notation by a number of semitones
 * Uses abcjs strTranspose for reliable transposition
 * @param abc - ABC notation string
 * @param semitones - Number of semitones to transpose (positive = up, negative = down)
 * @returns Transposed ABC string
 */
export function transpose(abc: string, semitones: number): string {
  try {
    const visualObj = abcjs.renderAbc('*', abc, { add_classes: true });
    if (visualObj && visualObj.length > 0) {
      return abcjs.strTranspose(abc, visualObj, semitones);
    }
    return abc;
  } catch (error) {
    console.error('Transposition failed:', error);
    return abc;
  }
}

/**
 * Transpose only a selected range of the ABC string
 * @param abc - Full ABC notation string
 * @param start - Start position of selection
 * @param end - End position of selection
 * @param semitones - Number of semitones to transpose
 * @returns Modified ABC string with transposed selection
 */
export function transposeRange(
  abc: string,
  start: number,
  end: number,
  semitones: number
): string {
  const before = abc.slice(0, start);
  const selection = abc.slice(start, end);
  const after = abc.slice(end);

  // Create a minimal ABC wrapper for the selection to transpose it
  // This is a simplified approach - may need refinement for complex selections
  const wrapped = `X:1\nK:C\n${selection}`;

  try {
    const transposed = transpose(wrapped, semitones);
    // Extract just the notes (skip header)
    const lines = transposed.split('\n');
    const notesOnly = lines.slice(2).join('\n');
    return before + notesOnly + after;
  } catch (error) {
    console.error('Range transposition failed:', error);
    return abc;
  }
}

// ============================================================================
// STRUCTURE MANIPULATION
// ============================================================================

/**
 * Insert a new measure (bar line with optional content)
 * @param abc - ABC notation string
 * @param position - Position to insert measure
 * @param content - Optional content for the measure
 * @returns Modified ABC string
 */
export function insertMeasure(
  abc: string,
  position: number,
  content: string = ''
): string {
  const measureContent = content ? ` ${content} |` : ' |';
  return abc.slice(0, position) + measureContent + abc.slice(position);
}

/**
 * Insert repeat markers
 * @param abc - ABC notation string
 * @param position - Position to insert
 * @param type - Type of repeat ('start', 'end', 'both')
 * @returns Modified ABC string
 */
export function insertRepeat(
  abc: string,
  position: number,
  type: 'start' | 'end' | 'both'
): string {
  let marker = '';
  switch (type) {
    case 'start':
      marker = '|:';
      break;
    case 'end':
      marker = ':|';
      break;
    case 'both':
      marker = ':||:';
      break;
  }
  return abc.slice(0, position) + ` ${marker} ` + abc.slice(position);
}

/**
 * Insert a chord (group of notes)
 * @param abc - ABC notation string
 * @param position - Position to insert
 * @param notes - Array of note letters
 * @param duration - Duration for the chord
 * @returns Modified ABC string
 */
export function insertChord(
  abc: string,
  position: number,
  notes: string[],
  duration: string = ''
): string {
  const chord = `[${notes.join('')}]${duration} `;
  return abc.slice(0, position) + chord + abc.slice(position);
}

/**
 * Insert a chord symbol (guitar chord notation)
 * @param abc - ABC notation string
 * @param position - Position to insert
 * @param symbol - Chord symbol (e.g., "C", "Dm7", "G/B")
 * @returns Modified ABC string
 */
export function insertChordSymbol(
  abc: string,
  position: number,
  symbol: string
): string {
  return abc.slice(0, position) + `"${symbol}"` + abc.slice(position);
}

// ============================================================================
// TEMPLATES
// ============================================================================

/**
 * Generate a new ABC tune template
 * @param title - Title of the tune
 * @param key - Key signature (default C major)
 * @param meter - Time signature (default 4/4)
 * @param unitLength - Default note length (default 1/8)
 * @returns ABC template string
 */
export function createTemplate(
  title: string = 'New Tune',
  key: string = 'C',
  meter: string = '4/4',
  unitLength: string = '1/8'
): string {
  return `X:1
T:${title}
M:${meter}
L:${unitLength}
K:${key}
| z4 | z4 | z4 | z4 |
`;
}

/**
 * Generate a scale pattern
 * @param key - Starting note
 * @param type - Scale type ('major', 'minor', 'chromatic')
 * @param octaves - Number of octaves
 * @returns ABC notation for the scale
 */
export function generateScale(
  key: string = 'C',
  type: 'major' | 'minor' | 'chromatic' = 'major',
  octaves: number = 1
): string {
  // Major scale intervals (whole steps and half steps)
  const majorPattern = [0, 2, 4, 5, 7, 9, 11, 12];
  const minorPattern = [0, 2, 3, 5, 7, 8, 10, 12];
  const chromaticPattern = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const startIndex = notes.indexOf(key.toUpperCase());

  if (startIndex === -1) {
    return '| C D E F | G A B c |';
  }

  let pattern: number[];
  switch (type) {
    case 'minor':
      pattern = minorPattern;
      break;
    case 'chromatic':
      pattern = chromaticPattern;
      break;
    default:
      pattern = majorPattern;
  }

  // Simplified scale generation - just uses natural notes for demo
  const scaleNotes = pattern.map((_, i) => {
    const noteIndex = (startIndex + i) % 7;
    return i < 7 ? notes[noteIndex] : notes[noteIndex].toLowerCase();
  });

  // Group into measures (4 notes per measure)
  let result = '';
  for (let i = 0; i < scaleNotes.length; i += 4) {
    const measure = scaleNotes.slice(i, i + 4).join(' ');
    result += `| ${measure} `;
  }
  result += '|';

  return result;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Find the position of a specific measure number
 * @param abc - ABC notation string
 * @param measureNum - Measure number (1-based)
 * @returns Position of measure start, or -1 if not found
 */
export function findMeasurePosition(abc: string, measureNum: number): number {
  let count = 0;
  let inHeader = true;

  for (let i = 0; i < abc.length; i++) {
    // Skip header lines
    if (abc[i] === '\n' && abc.slice(i + 1, i + 3).match(/^[A-Z]:/)) {
      continue;
    }
    if (abc[i] === '\n' && !abc.slice(i + 1, i + 3).match(/^[A-Z]:/)) {
      inHeader = false;
    }

    if (!inHeader && abc[i] === '|') {
      count++;
      if (count === measureNum) {
        return i;
      }
    }
  }

  return -1;
}

/**
 * Count the number of measures in ABC notation
 * @param abc - ABC notation string
 * @returns Number of measures
 */
export function countMeasures(abc: string): number {
  // Count bar lines (simplistic approach)
  const matches = abc.match(/\|/g);
  return matches ? matches.length : 0;
}

/**
 * Extract the music body (non-header content) from ABC
 * @param abc - ABC notation string
 * @returns Music body string
 */
export function extractMusicBody(abc: string): string {
  const lines = abc.split('\n');
  const bodyLines = lines.filter(line => !line.match(/^[A-Za-z]:/));
  return bodyLines.join('\n').trim();
}

/**
 * Clean up ABC notation (normalize whitespace, fix common issues)
 * @param abc - ABC notation string
 * @returns Cleaned ABC string
 */
export function cleanupABC(abc: string): string {
  let cleaned = abc;

  // Normalize multiple spaces to single space
  cleaned = cleaned.replace(/  +/g, ' ');

  // Ensure bar lines have spaces around them
  cleaned = cleaned.replace(/\|/g, ' | ').replace(/\s+\|\s+/g, ' | ');

  // Remove trailing whitespace from lines
  cleaned = cleaned.split('\n').map(line => line.trimEnd()).join('\n');

  // Ensure there's a newline at the end
  if (!cleaned.endsWith('\n')) {
    cleaned += '\n';
  }

  return cleaned;
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  // Validation
  validateABC,

  // Note insertion
  buildNote,
  insertNote,
  insertRest,
  insertBar,

  // Headers
  parseHeaders,
  getHeader,
  setHeader,
  removeHeader,

  // Transposition
  transpose,
  transposeRange,

  // Structure
  insertMeasure,
  insertRepeat,
  insertChord,
  insertChordSymbol,

  // Templates
  createTemplate,
  generateScale,

  // Utilities
  findMeasurePosition,
  countMeasures,
  extractMusicBody,
  cleanupABC,

  // Constants
  NOTE_NAMES,
  NOTE_NAMES_LOWER,
  DURATIONS,
  ACCIDENTALS
};
