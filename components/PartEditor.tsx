
import React, { useState, useEffect, useRef } from 'react';
import abcjs from 'abcjs';
import { useCapsuleStore } from '../stores/useCapsuleStore';
import type { Part } from '../types';
import { Bot, SlidersHorizontal, Music2, BrainCircuit, FileDown, Loader2 } from 'lucide-react';
import { exportToPDF } from '../utils/pdfExporter';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const warningsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // ♠️ Nyro: Initialize abcjs.Editor for automatic rendering, selection sync, and error display
    if (!textareaRef.current || !notationRef.current) return;

    editorRef.current = new abcjs.Editor(textareaRef.current, {
      canvas_id: notationRef.current,
      warnings_id: warningsRef.current,
      onchange: (editor: any) => {
        // Get current ABC content from editor
        const content = editor.editarea.getString();

        // Update Zustand store for persistence
        updatePartContent(capsuleId, part.fileName, content);

        // Update local state for PDF export
        setAbcContent(content);

        // 🎸 JamAI: Render MIDI playback (Editor doesn't auto-handle this)
        if (midiRef.current) {
          midiRef.current.innerHTML = "";
          abcjs.renderMidi(midiRef.current, content, {
            generateDownload: true,
            downloadLabel: "Download MIDI"
          });
        }
      },
      abcjsParams: {
        responsive: "resize",
        staffwidth: notationRef.current.clientWidth - 20,
        paddingleft: 10,
        paddingright: 10,
      },
      indicate_changed: true,
    });

    // Cleanup editor instance on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col h-[70vh]">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">ABC Scribe</h3>
        <textarea
          ref={textareaRef}
          defaultValue={part.content}
          className="flex-grow bg-gray-900/80 border border-portal-border rounded-md p-4 font-mono text-sm text-aureon-green resize-none outline-none focus:ring-2 focus:ring-aureon-green"
          spellCheck="false"
        />
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
