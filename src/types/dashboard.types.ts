// src/types/dashboard.types.ts
export interface DashboardFilters {
  ateneo: string;
  classeLaurea: string;
  corso: string;
  materia: string;
  titolo: string;
  searchText: string;
}

export type GroupByOption = 'materia' | 'ateneo' | 'corso' | 'docente';

export interface DashboardStats {
  totaleAnalisi: number;
  totaleAtenei: number;
  totaleMaterie: number;
  totaleCorsi: number;
  totaleTitoli: number;
  titoliZanichelli: number;
}