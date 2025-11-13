import { create } from 'zustand';

type ViewType = 'dashboard' | 'nuova-analisi' | 'impostazioni';

interface NavigationState {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentView: 'nuova-analisi',
  setView: (view) => set({ currentView: view }),
}));
