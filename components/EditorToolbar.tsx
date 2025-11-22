/**
 * Editor Toolbar Component
 *
 * Interactive toolbar for ABC notation editing with visual controls for:
 * - Note duration selection
 * - Accidental buttons
 * - Key/time signature pickers
 * - Common patterns and templates
 *
 * @author JamAI 🎸 & The Trinity (♠️🌿🧵)
 */

import React, { useState } from 'react';
import {
  Music,
  Hash,
  Minus,
  Plus,
  RotateCcw,
  Repeat,
  Type,
  Settings2
} from 'lucide-react';
import {
  buildNote,
  DURATIONS,
  ACCIDENTALS,
  insertBar,
  insertRepeat,
  insertRest,
  createTemplate,
  generateScale
} from '../utils/abcBuilder';

// ============================================================================
// TYPES
// ============================================================================

interface EditorToolbarProps {
  onInsert: (text: string) => void;
  onSetHeader?: (key: string, value: string) => void;
  disabled?: boolean;
}

interface DurationOption {
  label: string;
  value: string;
  icon: string;
  shortcut?: string;
}

interface AccidentalOption {
  label: string;
  value: string;
  symbol: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DURATION_OPTIONS: DurationOption[] = [
  { label: 'Whole', value: '4', icon: '𝅝', shortcut: '1' },
  { label: 'Half', value: '2', icon: '𝅗𝅥', shortcut: '2' },
  { label: 'Quarter', value: '', icon: '♩', shortcut: '4' },
  { label: 'Eighth', value: '/2', icon: '♪', shortcut: '8' },
  { label: 'Sixteenth', value: '/4', icon: '𝅘𝅥𝅯', shortcut: '6' },
];

const ACCIDENTAL_OPTIONS: AccidentalOption[] = [
  { label: 'Natural', value: '=', symbol: '♮' },
  { label: 'Sharp', value: '^', symbol: '♯' },
  { label: 'Flat', value: '_', symbol: '♭' },
  { label: 'Double Sharp', value: '^^', symbol: '𝄪' },
  { label: 'Double Flat', value: '__', symbol: '𝄫' },
];

const NOTE_BUTTONS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const KEY_SIGNATURES = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
  'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb',
  'Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m',
  'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm', 'Abm'
];

const TIME_SIGNATURES = [
  '4/4', '3/4', '2/4', '6/8', '9/8', '12/8',
  '2/2', '3/8', '5/4', '7/8'
];

// ============================================================================
// COMPONENT
// ============================================================================

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onInsert,
  onSetHeader,
  disabled = false
}) => {
  // State for current selections
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedAccidental, setSelectedAccidental] = useState('');
  const [selectedOctave, setSelectedOctave] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // ♠️ Nyro: Handle note insertion with current duration/accidental
  const handleNoteClick = (note: string) => {
    const noteStr = buildNote(note, {
      duration: selectedDuration,
      accidental: selectedAccidental as any,
      octave: selectedOctave,
      addSpace: true
    });
    onInsert(noteStr);
  };

  // 🎸 JamAI: Handle rest insertion
  const handleRestClick = () => {
    onInsert(`z${selectedDuration} `);
  };

  // Handle bar line insertion
  const handleBarClick = (barType: string = '|') => {
    onInsert(` ${barType} `);
  };

  // Handle template insertion
  const handleTemplateInsert = (type: string) => {
    switch (type) {
      case 'scale':
        onInsert(generateScale('C', 'major', 1));
        break;
      case 'newTune':
        onInsert(createTemplate('New Tune', 'C', '4/4', '1/8'));
        break;
      default:
        break;
    }
  };

  return (
    <div className={`bg-gray-800/90 border border-portal-border rounded-lg p-3 mb-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Main Toolbar Row */}
      <div className="flex flex-wrap items-center gap-4">

        {/* 🎵 Note Buttons */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-1">Notes:</span>
          {NOTE_BUTTONS.map((note) => (
            <button
              key={note}
              onClick={() => handleNoteClick(note)}
              className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-aureon-green hover:text-gray-900 text-white font-mono font-bold rounded transition-colors"
              title={`Insert ${note}`}
            >
              {note}
            </button>
          ))}
          <button
            onClick={handleRestClick}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-red-500 text-white font-mono rounded transition-colors ml-1"
            title="Insert Rest"
          >
            z
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-600" />

        {/* ⏱️ Duration Selector */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-1">Duration:</span>
          {DURATION_OPTIONS.map((dur) => (
            <button
              key={dur.value}
              onClick={() => setSelectedDuration(dur.value === selectedDuration ? '' : dur.value)}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors text-lg ${
                selectedDuration === dur.value
                  ? 'bg-aureon-green text-gray-900'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={`${dur.label} note`}
            >
              {dur.icon}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-600" />

        {/* ♯♭ Accidentals */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-1">Accidentals:</span>
          {ACCIDENTAL_OPTIONS.slice(0, 3).map((acc) => (
            <button
              key={acc.value}
              onClick={() => setSelectedAccidental(acc.value === selectedAccidental ? '' : acc.value)}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors text-lg ${
                selectedAccidental === acc.value
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={acc.label}
            >
              {acc.symbol}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-600" />

        {/* 🎼 Octave Controls */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 mr-1">Octave:</span>
          <button
            onClick={() => setSelectedOctave(Math.max(-2, selectedOctave - 1))}
            className="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded"
            title="Octave down"
          >
            <Minus size={12} />
          </button>
          <span className="w-6 text-center text-sm text-white font-mono">
            {selectedOctave > 0 ? `+${selectedOctave}` : selectedOctave}
          </span>
          <button
            onClick={() => setSelectedOctave(Math.min(2, selectedOctave + 1))}
            className="w-6 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded"
            title="Octave up"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-600" />

        {/* 🔁 Bar Lines & Repeats */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleBarClick('|')}
            className="px-2 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-mono"
            title="Bar line"
          >
            |
          </button>
          <button
            onClick={() => handleBarClick('||')}
            className="px-2 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-mono"
            title="Double bar"
          >
            ||
          </button>
          <button
            onClick={() => handleBarClick('|:')}
            className="px-2 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
            title="Repeat start"
          >
            <Repeat size={14} />:
          </button>
          <button
            onClick={() => handleBarClick(':|')}
            className="px-2 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
            title="Repeat end"
          >
            :<Repeat size={14} className="rotate-180" />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* ⚙️ Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded transition-colors ${
            showSettings ? 'bg-aureon-green text-gray-900' : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
          title="More options"
        >
          <Settings2 size={16} />
        </button>
      </div>

      {/* Expanded Settings Panel */}
      {showSettings && (
        <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap items-center gap-4">
          {/* Key Signature */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Key:</span>
            <select
              onChange={(e) => onSetHeader?.('K', e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
              defaultValue="C"
            >
              {KEY_SIGNATURES.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          {/* Time Signature */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Time:</span>
            <select
              onChange={(e) => onSetHeader?.('M', e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
              defaultValue="4/4"
            >
              {TIME_SIGNATURES.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Templates */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Insert:</span>
            <button
              onClick={() => handleTemplateInsert('scale')}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
              title="Insert C major scale"
            >
              Scale
            </button>
            <button
              onClick={() => handleTemplateInsert('newTune')}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
              title="Insert new tune template"
            >
              New Tune
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSelectedDuration('');
              setSelectedAccidental('');
              setSelectedOctave(0);
            }}
            className="ml-auto px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded flex items-center gap-1"
            title="Reset selections"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      )}

      {/* Current Selection Indicator */}
      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <span>Current:</span>
        <code className="bg-gray-900 px-2 py-0.5 rounded text-aureon-green">
          {selectedAccidental || ''}
          {'{note}'}
          {selectedOctave > 0 ? "'".repeat(selectedOctave) : selectedOctave < 0 ? ','.repeat(Math.abs(selectedOctave)) : ''}
          {selectedDuration || ''}
        </code>
        <span className="text-gray-600">← Click a note to insert</span>
      </div>
    </div>
  );
};

export default EditorToolbar;
