// src/stores/analisi.store.ts
import { create } from 'zustand';
import { AdozioneData } from '../types/adozione.types';

interface AnalisiState {
  pendingReviews: AdozioneData[];
  currentReview: AdozioneData | null;
  
  addPendingReview: (analysis: AdozioneData) => void;
  setCurrentReview: (analysis: AdozioneData | null) => void;
  removePendingReview: (analysisId: string) => void;
  clearPendingReviews: () => void;
}

export const useAnalisiStore = create<AnalisiState>((set) => ({
  pendingReviews: [],
  currentReview: null,
  
  addPendingReview: (analysis) =>
    set((state) => ({
      pendingReviews: [...state.pendingReviews, analysis],
      currentReview: state.currentReview || analysis
    })),
  
  setCurrentReview: (analysis) =>
    set({ currentReview: analysis }),
  
  removePendingReview: (analysisId) =>
    set((state) => {
      const newPendingReviews = state.pendingReviews.filter(a => a.id !== analysisId);
      const newCurrentReview = state.currentReview?.id === analysisId 
        ? (newPendingReviews[0] || null)
        : state.currentReview;
      
      return {
        pendingReviews: newPendingReviews,
        currentReview: newCurrentReview
      };
    }),
  
  clearPendingReviews: () =>
    set({ pendingReviews: [], currentReview: null })
}));