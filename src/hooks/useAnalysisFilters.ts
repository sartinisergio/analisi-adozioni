import { useMemo, useState } from 'react';
import type { AnalisiAdozione } from '../types/adozione.types';
import type { AnalysisFilters, GroupingCriterion, GroupedAnalysis } from '../types/filter.types';

export const useAnalysisFilters = (allAnalyses: AnalisiAdozione[]) => {
  const [filters, setFilters] = useState<AnalysisFilters>({
    ateneo: '',
    classeLaurea: '',
    corsoLaurea: '',
    materia: '',
    titoloPrincipale: '',
  });

  const [groupingCriterion, setGroupingCriterion] = useState<GroupingCriterion>('materia');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const filteredAnalyses = useMemo(() => {
    return allAnalyses.filter((analisi) => {
      if (filters.ateneo && analisi.ateneo !== filters.ateneo) return false;
      if (filters.classeLaurea && analisi.classeLaurea !== filters.classeLaurea) return false;
      if (filters.corsoLaurea && analisi.corsoLaurea !== filters.corsoLaurea) return false;
      if (filters.materia && analisi.materiaStandardizzata !== filters.materia) return false;
      
      if (filters.titoloPrincipale) {
        const searchTerm = filters.titoloPrincipale.toLowerCase();
        const titoloPrincipale = analisi.bibliografia[0]?.titolo?.toLowerCase() || '';
        if (!titoloPrincipale.includes(searchTerm)) return false;
      }

      return true;
    });
  }, [allAnalyses, filters]);

  const groupedAnalyses = useMemo(() => {
    const groups = new Map<string, AnalisiAdozione[]>();

    filteredAnalyses.forEach((analisi) => {
      let groupKey = '';
      
      switch (groupingCriterion) {
        case 'materia':
          groupKey = analisi.materiaStandardizzata || 'Materia non specificata';
          break;
        case 'ateneo':
          groupKey = analisi.ateneo || 'Ateneo non specificato';
          break;
        case 'corsoLaurea':
          groupKey = analisi.corsoLaurea || 'Corso non specificato';
          break;
        case 'docente':
          groupKey = analisi.docente || 'Docente non specificato';
          break;
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(analisi);
    });

    const result: GroupedAnalysis[] = Array.from(groups.entries())
      .map(([groupKey, analyses]) => ({
        groupKey,
        groupLabel: groupKey,
        count: analyses.length,
        analyses: analyses.sort((a, b) => {
          const corsoA = a.corsoLaurea || '';
          const corsoB = b.corsoLaurea || '';
          return corsoA.localeCompare(corsoB);
        }),
        isExpanded: expandedGroups.has(groupKey),
      }))
      .sort((a, b) => a.groupLabel.localeCompare(b.groupLabel));

    return result;
  }, [filteredAnalyses, groupingCriterion, expandedGroups]);

  const filterOptions = useMemo(() => {
    const atenei = new Set<string>();
    const classiLaurea = new Set<string>();
    const corsiLaurea = new Set<string>();
    const materie = new Set<string>();

    allAnalyses.forEach((analisi) => {
      if (analisi.ateneo) atenei.add(analisi.ateneo);
      if (analisi.classeLaurea) classiLaurea.add(analisi.classeLaurea);
      if (analisi.corsoLaurea) corsiLaurea.add(analisi.corsoLaurea);
      if (analisi.materiaStandardizzata) materie.add(analisi.materiaStandardizzata);
    });

    return {
      atenei: Array.from(atenei).sort(),
      classiLaurea: Array.from(classiLaurea).sort(),
      corsiLaurea: Array.from(corsiLaurea).sort(),
      materie: Array.from(materie).sort(),
    };
  }, [allAnalyses]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  const resetFilters = () => {
    setFilters({
      ateneo: '',
      classeLaurea: '',
      corsoLaurea: '',
      materia: '',
      titoloPrincipale: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return {
    filters,
    setFilters,
    groupingCriterion,
    setGroupingCriterion,
    filteredAnalyses,
    groupedAnalyses,
    filterOptions,
    toggleGroup,
    resetFilters,
    hasActiveFilters,
  };
};
