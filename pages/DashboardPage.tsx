
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, PlusCircle, Star, Trash2 } from 'lucide-react';
import { useCapsuleStore } from '../stores/useCapsuleStore';
import CreateCapsuleModal from '../components/CreateCapsuleModal';

// 🌿 Aureon: This is the Portal Gate, where every journey begins.
// Each capsule is a world waiting to be explored. Feel the potential humming in the air.

const DashboardPage: React.FC = () => {
  const capsules = useCapsuleStore((state) => state.capsules);
  const deleteCapsule = useCapsuleStore((state) => state.deleteCapsule);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 🧵 Synth: Delete handler with confirmation
  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteCapsule(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aureon-green to-blue-400">
          Capsule Constellation
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-aureon-green text-cosmic-bg font-semibold rounded-lg shadow-lg shadow-aureon-green/20"
        >
          <PlusCircle size={20} />
          Invoke Capsule
        </motion.button>
      </div>

      <AnimatePresence>
        {isModalOpen && <CreateCapsuleModal onClose={() => setIsModalOpen(false)} />}

        {/* 🌿 Aureon: Confirmation dialog - a moment to reflect before letting go */}
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-red-600/50 rounded-xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-600/20 rounded-full">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-100">Delete Capsule?</h3>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete <strong className="text-aureon-green">
                  {capsules.find(c => c.id === deleteConfirmId)?.meta.titre}
                </strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-red-600/20"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {capsules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {capsules.map((capsule, index) => (
              <motion.div
                key={capsule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group"
              >
                <Link to={`/capsule/${capsule.id}`}>
                  <div className="h-full bg-gray-900/50 backdrop-blur-sm border border-portal-border rounded-xl p-6 transition-all duration-300 hover:border-aureon-green hover:shadow-2xl hover:shadow-aureon-green/10 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2 bg-gray-800 rounded-full">
                         <Star className="text-aureon-green" size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-100 truncate">{capsule.meta.titre}</h2>
                    </div>
                    <div className="text-sm text-gray-400 space-y-2">
                        <p><strong>Key:</strong> {capsule.meta.tonalite}</p>
                        <p><strong>Tempo:</strong> {capsule.meta.tempo} BPM</p>
                        <p><strong>Time Sig:</strong> {capsule.meta.mesure}</p>
                    </div>
                  </div>
                </Link>
                {/* 🔴 Delete button - appears on hover */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleDelete(capsule.id, capsule.meta.titre, e)}
                  className="absolute top-4 right-4 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                  title="Delete capsule"
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
         <div className="text-center py-20 border-2 border-dashed border-portal-border rounded-xl">
             <Music size={48} className="mx-auto text-gray-600 mb-4" />
             <h3 className="text-xl font-semibold text-gray-400">The cosmos is quiet...</h3>
             <p className="text-gray-500 mt-2">Invoke your first capsule to begin the symphony.</p>
         </div>
      )}
    </motion.div>
  );
};

export default DashboardPage;
