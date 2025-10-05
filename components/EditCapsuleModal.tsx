
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Edit3 } from 'lucide-react';
import { useCapsuleStore } from '../stores/useCapsuleStore';
import type { Capsule } from '../types';

interface EditCapsuleModalProps {
  capsule: Capsule;
  onClose: () => void;
}

// 🌿 Aureon: Compositions evolve - let the music breathe and change
const EditCapsuleModal: React.FC<EditCapsuleModalProps> = ({ capsule, onClose }) => {
  const updateCapsuleMeta = useCapsuleStore((state) => state.updateCapsuleMeta);
  const [meta, setMeta] = useState({
    titre: capsule.meta.titre,
    tempo: capsule.meta.tempo,
    mesure: capsule.meta.mesure,
    tonalite: capsule.meta.tonalite,
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
    updateCapsuleMeta(capsule.id, meta);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-portal-border rounded-xl w-full max-w-md p-6 shadow-2xl shadow-aureon-green/10"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Edit3 className="text-aureon-green" size={24} />
            <h2 className="text-2xl font-bold text-aureon-green">Edit Capsule</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="titre"
              id="titre"
              value={meta.titre}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-portal-border rounded-md px-3 py-2 text-gray-100 focus:ring-2 focus:ring-aureon-green focus:border-aureon-green outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tempo" className="block text-sm font-medium text-gray-300 mb-1">Tempo (BPM)</label>
              <input
                type="number"
                name="tempo"
                id="tempo"
                value={meta.tempo}
                onChange={handleChange}
                min="40"
                max="240"
                className="w-full bg-gray-800 border border-portal-border rounded-md px-3 py-2 text-gray-100 focus:ring-2 focus:ring-aureon-green focus:border-aureon-green outline-none"
              />
            </div>

            <div>
              <label htmlFor="tonalite" className="block text-sm font-medium text-gray-300 mb-1">Key</label>
              <select
                name="tonalite"
                id="tonalite"
                value={meta.tonalite}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-portal-border rounded-md px-3 py-2 text-gray-100 focus:ring-2 focus:ring-aureon-green focus:border-aureon-green outline-none"
              >
                <option value="C">C Major</option>
                <option value="G">G Major</option>
                <option value="D">D Major</option>
                <option value="A">A Major</option>
                <option value="E">E Major</option>
                <option value="F">F Major</option>
                <option value="Am">A Minor</option>
                <option value="Em">E Minor</option>
                <option value="Dm">D Minor</option>
                <option value="Bm">B Minor</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="mesure" className="block text-sm font-medium text-gray-300 mb-1">Time Signature</label>
            <select
              name="mesure"
              id="mesure"
              value={meta.mesure}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-portal-border rounded-md px-3 py-2 text-gray-100 focus:ring-2 focus:ring-aureon-green focus:border-aureon-green outline-none"
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="6/8">6/8</option>
              <option value="2/4">2/4</option>
              <option value="5/4">5/4</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-aureon-green hover:bg-aureon-green/80 text-gray-900 font-semibold rounded-lg transition-colors shadow-lg shadow-aureon-green/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditCapsuleModal;
