export type GroupByOption = 'materia' | 'ateneo' | 'corso' | 'docente';

export interface DashboardFilters {
  ateneo: string;
  classeLaurea: string;
  corso: string;
  materia: string;
  titolo: string;
}

export interface GroupedData {
  groupKey: string;
  groupLabel: string;
  items: AdozioneAnalizzata[];
  isExpanded: boolean;
  page: number;
}

export interface AdozioneAnalizzata {
  id: string;
  ateneo: string;
  classeLaurea: string;
  corso: string;
  docente: string;
  materia: string;
  titolo: string;
  autore: string;
  editore: string;
  isZanichelli: boolean;
  dataAnalisi: Date;
  pdfFileName: string;
}
