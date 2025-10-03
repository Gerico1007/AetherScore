
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, PlusCircle, Star } from 'lucide-react';
import { useCapsuleStore } from '../stores/useCapsuleStore';
import CreateCapsuleModal from '../components/CreateCapsuleModal';

// 🌿 Aureon: This is the Portal Gate, where every journey begins.
// Each capsule is a world waiting to be explored. Feel the potential humming in the air.

const DashboardPage: React.FC = () => {
  const capsules = useCapsuleStore((state) => state.capsules);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
