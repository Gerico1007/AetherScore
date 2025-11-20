
import React, { useState, useEffect, useRef } from 'react';
import abcjs from 'abcjs';
import CodeMirror from '@uiw/react-codemirror';
import { useCapsuleStore } from '../stores/useCapsuleStore';
import type { Part } from '../types';
import { Bot, SlidersHorizontal, Music2, BrainCircuit, FileDown, Loader2 } from 'lucide-react';
import { exportToPDF } from '../utils/pdfExporter';
import { abcLanguage } from '../utils/abcLanguage';

interface PartEditorProps {
  part: Part;
  capsuleId: string;
}

// 🎸 JamAI: This is the jam space! The left side is your sheet music, the right is the live band.
// Write a lick, and you'll see and hear it instantly. Let's make some noise!

const PartEditor: React.FC<PartEditorProps> = ({ part, capsuleId }) => {
  const [abcContent, setAbcContent] = useState(part.content);
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const updatePartContent = useCapsuleStore((state) => state.updatePartContent);

  const notationRef = useRef<HTMLDivElement>(null);
  const midiRef = useRef<HTMLDivElement>(null);
  const warningsRef = useRef<HTMLDivElement>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🧵 Synth: PDF export handler with error boundary
  const handlePdfExport = async () => {
    setIsPdfExporting(true);
    try {
      const capsule = useCapsuleStore.getState().getCapsule(capsuleId);
      const filename = capsule?.meta.titre
        ? `${capsule.meta.titre.toLowerCase().replace(/\s+/g, '-')}.pdf`
        : 'score.pdf';

      await exportToPDF(abcContent, { filename });
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please check your ABC notation is valid.');
    } finally {
      setIsPdfExporting(false);
    }
  };

  // ♠️ Nyro: Render ABC notation and MIDI with debouncing
  useEffect(() => {
    // Clear previous timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // Debounce rendering (300ms for responsive feel)
    renderTimeoutRef.current = setTimeout(() => {
      // Update Zustand store for persistence
      updatePartContent(capsuleId, part.fileName, abcContent);

      // Render notation
      if (notationRef.current) {
        try {
          // Clear warnings
          if (warningsRef.current) {
            warningsRef.current.innerHTML = "";
          }

          abcjs.renderAbc(notationRef.current, abcContent, {
            responsive: "resize",
            staffwidth: notationRef.current.clientWidth - 20,
            paddingleft: 10,
            paddingright: 10,
            add_classes: true,
            oneSvgPerLine: false
          });
        } catch (error: any) {
          // Display parsing errors
          if (warningsRef.current) {
            warningsRef.current.innerHTML = `<span class="text-red-400">⚠️ ${error.message}</span>`;
          }
        }
      }

      // 🎸 JamAI: Render MIDI playback
      if (midiRef.current) {
        midiRef.current.innerHTML = "";
        try {
          abcjs.renderMidi(midiRef.current, abcContent, {
            generateDownload: true,
            downloadLabel: "Download MIDI"
          });
        } catch (error) {
          // Silently fail MIDI rendering if ABC is invalid
          console.warn('MIDI rendering failed:', error);
        }
      }
    }, 300);

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abcContent, part.fileName, capsuleId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col h-[70vh]">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">ABC Scribe</h3>
        <div className="flex-grow overflow-hidden rounded-md border border-portal-border">
          <CodeMirror
            value={abcContent}
            onChange={(value) => setAbcContent(value)}
            extensions={[abcLanguage]}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              foldGutter: true,
              dropCursor: true,
              indentOnInput: false,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: false,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLineGutter: true
            }}
            style={{
              height: '100%',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}
            className="h-full"
          />
        </div>
        {/* 🌿 Aureon: Parser warnings appear here when ABC notation has errors */}
        <div
          ref={warningsRef}
          className="text-red-400 text-xs font-mono mt-2 p-2 bg-red-900/20 rounded border border-red-800/50 empty:hidden"
        />
      </div>

      <div className="flex flex-col gap-6 h-[70vh]">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Live Notation</h3>
          <div ref={notationRef} className="bg-gray-900/80 border border-portal-border rounded-md p-4 overflow-auto max-h-[25vh]"></div>
        </div>
        
        <div>
           <h3 className="text-lg font-semibold mb-2 text-gray-300">MIDI Playback</h3>
           <div ref={midiRef} className="bg-gray-900/80 border border-portal-border rounded-md p-4"></div>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-300">Alchemical Forge</h3>
            <div className="flex flex-wrap gap-4">
                 {/* 🌿 Aureon: These are portals to other forms. What does your music want to become? */}
                <button
                  onClick={handlePdfExport}
                  disabled={isPdfExporting}
                  className="flex items-center gap-2 px-3 py-2 bg-aureon-green text-gray-900 font-semibold rounded-lg shadow-md hover:bg-aureon-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPdfExporting ? (
                    <><Loader2 size={18} className="animate-spin" /> Exporting...</>
                  ) : (
                    <><FileDown size={18} /> Export to PDF</>
                  )}
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    <Music2 size={18} /> To MusicXML
                </button>
                 <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    <SlidersHorizontal size={18} /> To WAV
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    <BrainCircuit size={18} /> Ask AI Agent
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">✨ PDF export now available! MusicXML & WAV coming in v0.2</p>
        </div>
      </div>
    </div>
  );
};

export default PartEditor;
