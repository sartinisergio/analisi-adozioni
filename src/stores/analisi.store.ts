// src/stores/analysis.store.ts
import { create } from 'zustand';
import { AdozioneData } from '../types/adozione.types';

interface AnalysisState {
  pendingReviews: AdozioneData[];
  currentReview: AdozioneData | null;
  
  addPendingReview: (analysis: AdozioneData) => void;
  setCurrentReview: (analysis: AdozioneData | null) => void;
  removePendingReview: (analysisId: string) => void;
  clearPendingReviews: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  pendingReviews: [],
  currentReview: null,
  
  addPendingReview: (analysis) =>
    set((state) => ({
      pendingReviews: [...state.pendingReviews, analysis],
      currentReview: state.currentReview || analysis // Se non c'è nessuna review corrente, imposta questa
    })),
  
  setCurrentReview: (analysis) =>
    set({ currentReview: analysis }),
  
  removePendingReview: (analysisId) =>
    set((state) => ({
      pendingReviews: state.pendingReviews.filter(a => a.id !== analysisId),
      currentReview: state.currentReview?.id === analysisId 
        ? state.pendingReviews[0] || null 
        : state.currentReview
    })),
  
  clearPendingReviews: () =>
    set({ pendingReviews: [], currentReview: null })
}));