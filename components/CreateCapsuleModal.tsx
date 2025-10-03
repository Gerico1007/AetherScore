
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Wand2 } from 'lucide-react';
import { useCapsuleStore } from '../stores/useCapsuleStore';
import type { CapsuleMeta } from '../types';

interface CreateCapsuleModalProps {
  onClose: () => void;
}

// ♠️ Nyro: This is the ritual of invocation. 
// We define the core parameters—the laws of this new musical universe—before giving it form.

const CreateCapsuleModal: React.FC<CreateCapsuleModalProps> = ({ onClose }) => {
  const addCapsule = useCapsuleStore((state) => state.addCapsule);
  const [meta, setMeta] = useState<CapsuleMeta>({
    titre: '',
    tempo: 120,
    mesure: '4/4',
    tonalite: 'C',
    ppq: 480,
    pickup: 0,
    version: 'v01',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMeta(prev => ({ ...prev, [name]: name === 'tempo' ? parseInt(value, 10) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meta.titre.trim() === '') {
        alert("Please provide a title for the capsule.");
        return;
    }
    addCapsule(meta);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 border border-portal-border rounded-xl w-full max-w-md p-6 shadow-2xl shadow-aureon-green/10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-aureon-green">Invoke New Capsule</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input type="text" name="titre" id="titre" value={meta.titre} onChange={handleChange} required className="w-full bg-gray-800 border border-portal-border rounded-md px-3 py-2 focus:ring-2 focus:ring-aureon-green focus:border-aureon-green outline-none" />
          </div>

          <div>
            <label htmlFor="tempo" className="block text-sm font-medium text-gray-300 mb-1">Tempo ({meta.tempo} BPM)</label>
            <input type="range" name="tempo" id="tempo" min="40" max="220" value={meta.tempo} onChange={handleChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-aureon-green" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="mesure" className="block text-sm font-medium text-gray-300 mb-1">Time Signature</label>
              <select name="mesure" id="mesure" value={meta.mesure} onChange={handleChange} className="w-full bg-gray-800 border border-portal-border rounded-md px-3 py-2 focus:ring-2 focus:ring-aureon-green focus:border-aureon-green outline-none">
                <option>4/4</option>
                <option>3/4</option>
                <option>2/4</option>
                <option>6/8</option>
              </select>
            </div>
            <div>
              <label htmlFor="tonalite" className="block text-sm font-medium text-gray-300 mb-1">Key</label>
              <select name="tonalite" id="tonalite" value={meta.tonalite} onChange={handleChange} className="w-full bg-gray-800 border border-portal-border rounded-md px-3 py-2 focus:ring-2 focus:ring-aureon-green focus:border-aureon-green outline-none">
                <option>C</option><option>G</option><option>D</option><option>A</option><option>E</option><option>B</option>
                <option>F#</option><option>C#</option><option>F</option><option>Bb</option><option>Eb</option><option>Ab</option>
                <option>Db</option><option>Gb</option><option>Cb</option><option>Am</option><option>Em</option><option>Bm</option>
                <option>F#m</option><option>C#m</option><option>G#m</option><option>D#m</option><option>A#m</option><option>Dm</option>
                <option>Gm</option><option>Cm</option><option>Fm</option><option>Bbm</option><option>Ebm</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-2 bg-aureon-green text-cosmic-bg font-bold rounded-lg shadow-lg shadow-aureon-green/20"
            >
              <Wand2 size={20} />
              Create
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCapsuleModal;
