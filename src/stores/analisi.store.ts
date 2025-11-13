import { create } from 'zustand';

interface AnalisiState {
  isAnalyzing: boolean;
  error: string | null;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalisiStore = create<AnalisiState>((set) => ({
  isAnalyzing: false,
  error: null,
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setError: (error) => set({ error })
}));
