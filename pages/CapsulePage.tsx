
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Download, FileText, Upload, Music4 } from 'lucide-react';
import { useCapsuleStore } from '../stores/useCapsuleStore';
import PartEditor from '../components/PartEditor';
import { exportCapsuleAsZip } from '../utils/capsuleManager';

// ♠️ Nyro: Welcome to the Capsule Sanctum. Here, the abstract becomes concrete.
// Every element is structured for clarity and focus, allowing the creative energy to flow without obstruction.

const CapsulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const capsule = useCapsuleStore((state) => state.getCapsule(id || ''));
  const [activePart, setActivePart] = useState<string | null>(capsule?.parts[0]?.fileName || null);

  if (!capsule) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-jam-red">Capsule Not Found</h2>
        <p className="text-gray-400 mt-2">This star has faded from the constellation.</p>
        <Link to="/" className="mt-4 inline-block text-aureon-green hover:underline">Return to the Portal Gate</Link>
      </div>
    );
  }

  const handleExport = () => {
    exportCapsuleAsZip(capsule);
  };

  const currentPart = capsule.parts.find(p => p.fileName === activePart);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-aureon-green transition-colors">
          <ChevronLeft size={20} />
          Back to Constellation
        </Link>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-nyro-blue text-white font-semibold rounded-lg shadow-lg shadow-nyro-blue/20"
        >
          <Download size={20} />
          Export Capsule (ZIP)
        </button>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm border border-portal-border rounded-xl p-6 mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{capsule.meta.titre}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-400">
          <span><strong>Key:</strong> {capsule.meta.tonalite}</span>
          <span><strong>Tempo:</strong> {capsule.meta.tempo} BPM</span>
          <span><strong>Time Sig:</strong> {capsule.meta.mesure}</span>
          <span><strong>Version:</strong> {capsule.meta.version}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Panel */}
        <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-aureon-green flex items-center gap-2"><Music4/>Atelier des Parties</h2>
            <div className="flex flex-col gap-2">
                {capsule.parts.map(part => (
                    <button key={part.fileName} onClick={() => setActivePart(part.fileName)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${activePart === part.fileName ? 'bg-aureon-green/20 text-aureon-green' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}>
                        {part.fileName}
                    </button>
                ))}
            </div>
            
            <div className="mt-8">
                 <h3 className="text-xl font-semibold mb-4 text-aureon-green flex items-center gap-2"><Upload/>Écho des Sources</h3>
                 <p className="text-sm text-gray-500">Source file management coming in v0.2.</p>
            </div>
            <div className="mt-8">
                 <h3 className="text-xl font-semibold mb-4 text-aureon-green flex items-center gap-2"><FileText/>Galerie des Rendus</h3>
                 <p className="text-sm text-gray-500">Renderings will appear here after conversion.</p>
            </div>
        </div>

        {/* Editor Panel */}
        <div className="lg:col-span-9">
          {currentPart ? (
            <PartEditor key={currentPart.fileName} part={currentPart} capsuleId={capsule.id} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-900/50 border-2 border-dashed border-portal-border rounded-xl">
                <p className="text-gray-500">Select a part to begin weaving.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CapsulePage;
