
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Capsule, CapsuleMeta, Part } from '../types';

// 🎸 JamAI: This is our shared memory, our collective consciousness.
// Every change here ripples through the portal, keeping all our creations in harmony.

// Seed data for a multi-voice piece, as requested.
const zochartiLochSeed: Part = {
  fileName: 'zocharti-loch-round-v01.abc',
  content: `X: 1
T: Zocharti Loch
C: Jewish Folk Song
M: 4/4
L: 1/8
K: Dm
V:1 name="Voice 1"
V:2 name="Voice 2"
V:3 name="Voice 3"
[V:1] z8 | z8 | z8 | D2 E2 F2 G2 | A2 G2 F2 E2 | D4 D4 | z8 |
[V:2] z8 | D2 E2 F2 G2 | A2 G2 F2 E2 | D4 D4 | z8 | z8 | z8 |
[V:3] D2 E2 F2 G2 | A2 G2 F2 E2 | D4 D4 | z8 | z8 | z8 | z8 |`
};

const initialCapsules: Capsule[] = [
  {
    id: 'zocharti-loch-cosmic-echo',
    meta: {
      titre: 'Zocharti Loch (Cosmic Echo)',
      tempo: 100,
      mesure: '4/4',
      tonalite: 'Dm',
      ppq: 480,
      pickup: 0,
      version: 'v01'
    },
    parts: [zochartiLochSeed],
    sources: []
  }
];

interface CapsuleState {
  capsules: Capsule[];
  getCapsule: (id: string) => Capsule | undefined;
  addCapsule: (meta: CapsuleMeta) => Capsule;
  updateCapsuleMeta: (id: string, meta: Partial<CapsuleMeta>) => void;
  updatePartContent: (capsuleId: string, fileName: string, content: string) => void;
  addPart: (capsuleId: string, fileName: string) => void;
}

export const useCapsuleStore = create<CapsuleState>()(
  persist(
    (set, get) => ({
      capsules: [],
      getCapsule: (id: string) => get().capsules.find(c => c.id === id),
      addCapsule: (meta) => {
        const newCapsule: Capsule = {
          id: `${meta.titre.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          meta,
          parts: [{ fileName: 'part-main-v01.abc', content: `X:1\nT:${meta.titre}\nM:${meta.mesure}\nK:${meta.tonalite}\nL:1/8\n|:` }],
          sources: [],
        };
        set((state) => ({ capsules: [...state.capsules, newCapsule] }));
        return newCapsule;
      },
      updateCapsuleMeta: (id, metaUpdate) => {
        set((state) => ({
          capsules: state.capsules.map(c =>
            c.id === id ? { ...c, meta: { ...c.meta, ...metaUpdate } } : c
          ),
        }));
      },
      updatePartContent: (capsuleId, fileName, content) => {
        set((state) => ({
          capsules: state.capsules.map(c =>
            c.id === capsuleId
              ? {
                  ...c,
                  parts: c.parts.map(p =>
                    p.fileName === fileName ? { ...p, content } : p
                  ),
                }
              : c
          ),
        }));
      },
      addPart: (capsuleId, fileName) => {
         const capsule = get().getCapsule(capsuleId);
         if (!capsule) return;
         const newPartContent = `X:${capsule.parts.length + 1}\nT:${capsule.meta.titre} (Part ${capsule.parts.length + 1})\nM:${capsule.meta.mesure}\nK:${capsule.meta.tonalite}\nL:1/8\n|:`;
         const newPart: Part = { fileName, content: newPartContent };
          set((state) => ({
              capsules: state.capsules.map(c => 
                  c.id === capsuleId ? { ...c, parts: [...c.parts, newPart] } : c
              )
          }));
      },
    }),
    {
      name: 'score-portal-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.capsules.length === 0) {
          // 🌿 Aureon: On first entry, let's plant a seed of inspiration.
          state.capsules = initialCapsules;
        }
      }
    }
  )
);
