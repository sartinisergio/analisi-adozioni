import { create } from 'zustand';
import type { QueueItem } from '../types/queue.types';

interface QueueState {
  items: QueueItem[];
  currentIndex: number;
  isProcessing: boolean;
  
  // Azioni base
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  
  // Gestione processamento
  startProcessing: () => void;
  stopProcessing: () => void;
  moveToNext: () => void;
  
  // Aggiornamento items
  updateItemStatus: (id: string, status: QueueItem['status'], error?: string) => void;
  setItemResult: (id: string, result: any) => void;
  
  // Getter
  getCurrentItem: () => QueueItem | null;
  getItemsCount: () => {
    total: number;
    pending: number;
    completed: number;
    errors: number;
  };
}

export const useQueueStore = create<QueueState>((set, get) => ({
  items: [],
  currentIndex: 0,
  isProcessing: false,

  addToQueue: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeFromQueue: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearQueue: () =>
    set({
      items: [],
      currentIndex: 0,
      isProcessing: false,
    }),

  startProcessing: () =>
    set({
      isProcessing: true,
      currentIndex: 0,
    }),

  stopProcessing: () =>
    set({
      isProcessing: false,
    }),

  moveToNext: () =>
    set((state) => {
      const nextIndex = state.currentIndex + 1;
      
      // Se abbiamo finito tutti gli item, ferma il processing
      if (nextIndex >= state.items.length) {
        return {
          currentIndex: nextIndex,
          isProcessing: false,
        };
      }
      
      return {
        currentIndex: nextIndex,
      };
    }),

  updateItemStatus: (id, status, error) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, status, error }
          : item
      ),
    })),

  setItemResult: (id, result) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, result }
          : item
      ),
    })),

  getCurrentItem: () => {
    const state = get();
    return state.items[state.currentIndex] || null;
  },

  getItemsCount: () => {
    const state = get();
    return {
      total: state.items.length,
      pending: state.items.filter((i) => i.status === 'pending').length,
      completed: state.items.filter((i) => i.status === 'completed').length,
      errors: state.items.filter((i) => i.status === 'error').length,
    };
  },
}));
