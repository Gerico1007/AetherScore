
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { safeLocalStorageSet, safeLocalStorageGet, safeLocalStorageRemove } from '../utils/storageHelpers';

// 🧵 Synth: Session store for ephemeral UI state
// This store manages short-term application state that persists across page reloads
// but is separate from long-term project data (capsules).

// 🧵 Synth: Safe localStorage wrapper with error handling
const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return safeLocalStorageGet(name);
  },
  setItem: (name: string, value: string): void => {
    safeLocalStorageSet(name, value);
  },
  removeItem: (name: string): void => {
    safeLocalStorageRemove(name);
  },
};

export type SortPreference =
  | 'date-newest'
  | 'date-oldest'
  | 'title-asc'
  | 'title-desc'
  | 'tempo-asc'
  | 'tempo-desc';

interface SessionState {
  // Dashboard UI state
  sortPreference: SortPreference;
  showOnlyFavorites: boolean;
  lastEditedCapsuleId: string | null;

  // Scroll positions (future enhancement)
  scrollPositions: {
    dashboard: number;
    capsulePage: number;
  };

  // Actions
  setSortPreference: (sort: SortPreference) => void;
  setShowOnlyFavorites: (show: boolean) => void;
  setLastEditedCapsuleId: (id: string | null) => void;
  setScrollPosition: (page: 'dashboard' | 'capsulePage', position: number) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      // Initial state
      sortPreference: 'date-newest',
      showOnlyFavorites: false,
      lastEditedCapsuleId: null,
      scrollPositions: {
        dashboard: 0,
        capsulePage: 0,
      },

      // Actions
      setSortPreference: (sort) => set({ sortPreference: sort }),
      setShowOnlyFavorites: (show) => set({ showOnlyFavorites: show }),
      setLastEditedCapsuleId: (id) => set({ lastEditedCapsuleId: id }),
      setScrollPosition: (page, position) =>
        set((state) => ({
          scrollPositions: {
            ...state.scrollPositions,
            [page]: position,
          },
        })),
    }),
    {
      name: 'score-portal-session',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
