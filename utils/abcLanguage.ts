/**
 * ABC Notation Language Definition for CodeMirror 6
 *
 * Provides syntax highlighting for ABC music notation format
 * Based on ABC notation standard 2.1
 *
 * @author JamAI 🎸 & The Trinity (♠️🌿🧵)
 * @see https://abcnotation.com/wiki/abc:standard:v2.1
 */

import { StreamLanguage } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

interface ABCState {
  inHeader: boolean;
  inChord: boolean;
  inLyrics: boolean;
  inComment: boolean;
}

const abcLanguage = StreamLanguage.define<ABCState>({
  name: 'abc',

  startState: (): ABCState => ({
    inHeader: true,
    inChord: false,
    inLyrics: false,
    inComment: false
  }),

  token(stream, state) {
    // Comments (% at start of line or after whitespace)
    if (stream.match(/^%.*$/)) {
      return t.lineComment.name;
    }

    // Information fields (headers): X:, T:, K:, M:, L:, Q:, C:, etc.
    if (stream.match(/^[A-Za-z]:\s*/)) {
      state.inHeader = true;
      return t.keyword.name;
    }

    // Header values (after field identifier)
    if (state.inHeader && !stream.match(/^\s*$/)) {
      if (stream.match(/^[^\n]+/)) {
        state.inHeader = false;
        return t.string.name;
      }
    }

    // Bar lines: |, ||, |:, :|, [|, |], |1, |2, etc.
    if (stream.match(/\|:|\:\||\|\||[\|\[\]]/)) {
      return t.operator.name;
    }

    // Repeat markers and endings
    if (stream.match(/\|[12]/)) {
      return t.operator.name;
    }

    // Chord symbols in quotes: "C" "Dm7" "G/B"
    if (stream.match(/"[^"]*"/)) {
      return t.meta.name;
    }

    // Annotations and decorations: !trill! !fermata! etc.
    if (stream.match(/![^!]+!/)) {
      return t.annotation.name;
    }

    // Chords (groups of notes): [CEG] [A2c2e2]
    if (stream.match(/\[/)) {
      state.inChord = true;
      return t.bracket.name;
    }
    if (state.inChord && stream.match(/\]/)) {
      state.inChord = false;
      return t.bracket.name;
    }

    // Grace notes: {A} {ABC}
    if (stream.match(/\{[^}]*\}/)) {
      return t.special(t.name).name;
    }

    // Slur/tie markers: ( ) -
    if (stream.match(/[\(\)\-]/)) {
      return t.punctuation.name;
    }

    // Accidentals: ^, ^^, _, __, =
    if (stream.match(/[\^\_=]{1,2}/)) {
      return t.modifier.name;
    }

    // Notes: A-G, a-g with optional octave markers ', ,
    // Includes duration: A2, B/2, C3/2, etc.
    if (stream.match(/[A-Ga-gz][',]*/)) {
      // Check for duration after note
      stream.match(/\d*\/?\d*/);
      return t.variableName.name;
    }

    // Rests: z, x (with optional durations)
    if (stream.match(/[zx]\d*\/?\d*/)) {
      return t.atom.name;
    }

    // Measure rest: Z (full measure)
    if (stream.match(/Z\d*/)) {
      return t.atom.name;
    }

    // Duration/length modifiers (standalone numbers)
    if (stream.match(/\d+\/?\d*/)) {
      return t.number.name;
    }

    // Lyrics alignment markers: w:, W:
    if (stream.match(/^[wW]:/)) {
      state.inLyrics = true;
      return t.keyword.name;
    }

    // Tuplets: (3, (3:2:3, etc.
    if (stream.match(/\(\d+:\d*:\d*/)) {
      return t.number.name;
    }

    // Whitespace
    if (stream.match(/\s+/)) {
      return null;
    }

    // Voice overlay markers: &
    if (stream.match(/&/)) {
      return t.operator.name;
    }

    // Broken rhythm markers: < > << >>
    if (stream.match(/[<>]+/)) {
      return t.operator.name;
    }

    // Catch-all: advance one character
    stream.next();
    return null;
  },

  languageData: {
    commentTokens: { line: '%' }
  }
});

/**
 * Theme definition for ABC notation (dark theme compatible with AetherScore)
 */
export const abcTheme = {
  '&': {
    color: '#e0e0e0',
    backgroundColor: 'transparent'
  },
  '.cm-keyword': {
    color: '#89ddff', // Cyan for headers (X:, T:, K:, etc.)
    fontWeight: 'bold'
  },
  '.cm-string': {
    color: '#c3e88d' // Green for header values
  },
  '.cm-lineComment': {
    color: '#546e7a', // Gray for comments
    fontStyle: 'italic'
  },
  '.cm-variableName': {
    color: '#82aaff' // Blue for notes
  },
  '.cm-atom': {
    color: '#f07178' // Red for rests
  },
  '.cm-number': {
    color: '#ffcb6b' // Yellow for durations
  },
  '.cm-operator': {
    color: '#89ddff' // Cyan for bar lines
  },
  '.cm-bracket': {
    color: '#c792ea' // Purple for chords
  },
  '.cm-meta': {
    color: '#ffcb6b', // Yellow for chord symbols
    fontWeight: 'bold'
  },
  '.cm-annotation': {
    color: '#f78c6c', // Orange for decorations
    fontStyle: 'italic'
  },
  '.cm-modifier': {
    color: '#c792ea' // Purple for accidentals
  },
  '.cm-punctuation': {
    color: '#89ddff' // Cyan for slurs/ties
  }
};

export { abcLanguage };
