import { create } from 'zustand';
import { StorageService } from '../services/storage.service';
import { DashboardFilters, GroupByOption, GroupedData, AdozioneAnalizzata } from '../types/dashboard.types';

interface DashboardState {
  filters: DashboardFilters;
  groupBy: GroupByOption;
  groupedData: GroupedData[];
  allData: AdozioneAnalizzata[];
  isLoading: boolean;
  
  setFilter: (key: keyof DashboardFilters, value: string) => void;
  setGroupBy: (option: GroupByOption) => void;
  loadData: () => void;
  toggleGroup: (groupKey: string) => void;
  loadMoreInGroup: (groupKey: string) => void;
  clearFilters: () => void;
  exportData: () => string;
  importData: (jsonData: string, mode: 'overwrite' | 'append') => void;
  applyFiltersAndGroup: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  filters: { ateneo: '', classeLaurea: '', corso: '', materia: '', titolo: '' },
  groupBy: 'materia',
  groupedData: [],
  allData: [],
  isLoading: false,

  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
    get().applyFiltersAndGroup();
  },

  setGroupBy: (option) => {
    set({ groupBy: option });
    get().applyFiltersAndGroup();
  },

  loadData: () => {
    set({ isLoading: true });
    const records = StorageService.getAll();
    
    const data: AdozioneAnalizzata[] = records.map((r) => ({
      id: r.id,
      ateneo: r.ateneo || 'Non specificato',
      classeLaurea: r.classeLaurea || 'Non specificato',
      corso: r.corso || 'Non specificato',
      docente: r.docente || 'Non specificato',
      materia: r.materia || 'Non specificato',
      titolo: r.titolo || 'Non specificato',
      autore: r.autore || 'Non specificato',
      editore: r.editore || 'Non specificato',
      isZanichelli: (r.editore || '').toLowerCase().includes('zanichelli'),
      dataAnalisi: new Date(r.dataAnalisi),
      pdfFileName: r.pdfFileName || '',
    }));

    set({ allData: data, isLoading: false });
    get().applyFiltersAndGroup();
  },

  toggleGroup: (groupKey) => {
    set((state) => ({
      groupedData: state.groupedData.map((g) =>
        g.groupKey === groupKey ? { ...g, isExpanded: !g.isExpanded } : g
      ),
    }));
  },

  loadMoreInGroup: (groupKey) => {
    set((state) => ({
      groupedData: state.groupedData.map((g) =>
        g.groupKey === groupKey ? { ...g, page: g.page + 1 } : g
      ),
    }));
  },

  clearFilters: () => {
    set({ filters: { ateneo: '', classeLaurea: '', corso: '', materia: '', titolo: '' } });
    get().applyFiltersAndGroup();
  },

  applyFiltersAndGroup: () => {
    const { allData, filters, groupBy } = get();
    
    let filtered = allData.filter((item) => (
      (!filters.ateneo || item.ateneo.toLowerCase().includes(filters.ateneo.toLowerCase())) &&
      (!filters.classeLaurea || item.classeLaurea.toLowerCase().includes(filters.classeLaurea.toLowerCase())) &&
      (!filters.corso || item.corso.toLowerCase().includes(filters.corso.toLowerCase())) &&
      (!filters.materia || item.materia.toLowerCase().includes(filters.materia.toLowerCase())) &&
      (!filters.titolo || item.titolo.toLowerCase().includes(filters.titolo.toLowerCase()))
    ));

    const groups = new Map<string, AdozioneAnalizzata[]>();
    filtered.forEach((item) => {
      const key = item[groupBy] || 'Non specificato';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    });

    const groupedData: GroupedData[] = Array.from(groups.entries())
      .map(([key, items]) => ({
        groupKey: key,
        groupLabel: key,
        items: items.sort((a, b) => b.dataAnalisi.getTime() - a.dataAnalisi.getTime()),
        isExpanded: false,
        page: 1,
      }))
      .sort((a, b) => b.items.length - a.items.length);

    set({ groupedData });
  },

  exportData: () => StorageService.export(),

  importData: (jsonData, mode) => {
    StorageService.import(jsonData, mode);
    get().loadData();
  },
}));
