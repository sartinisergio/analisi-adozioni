export interface AnalysisFilters {
  ateneo: string;
  classeLaurea: string;
  corsoLaurea: string;
  materia: string;
  titoloPrincipale: string;
}

export type GroupingCriterion = 'materia' | 'ateneo' | 'corsoLaurea' | 'docente';

export interface FilterOptions {
  atenei: string[];
  classiLaurea: string[];
  corsiLaurea: string[];
  materie: string[];
}

export interface GroupedAnalysis {
  groupKey: string;
  groupLabel: string;
  count: number;
  analyses: any[];
  isExpanded: boolean;
}
