// src/stores/dashboard.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardFilters, GroupByOption } from '../types/dashboard.types';

interface DashboardState {
  groupBy: GroupByOption;
  filters: DashboardFilters;
  setGroupBy: (groupBy: GroupByOption) => void;
  setFilters: (filters: DashboardFilters) => void;
  resetFilters: () => void;
}

const initialFilters: DashboardFilters = {
  ateneo: '',
  classeLaurea: '',
  corso: '',
  materia: '',
  titolo: '',
  searchText: ''
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      groupBy: 'materia',
      filters: initialFilters,
      
      setGroupBy: (groupBy) => set({ groupBy }),
      
      setFilters: (filters) => set({ filters }),
      
      resetFilters: () => set({ filters: initialFilters })
    }),
    {
      name: 'dashboard-storage'
    }
  )
);