// src/services/dashboard.service.ts
import { AdozioneData, AnalisiGroup } from '../types/adozione.types';

export function groupAnalyses(
  analyses: AdozioneData[],
  groupBy: 'materia' | 'ateneo' | 'corso' | 'docente'
): AnalisiGroup[] {
  const groups = new Map<string, AnalisiGroup>();

  analyses.forEach(analisi => {
    // Crea chiave univoca per Ateneo + Classe + Materia + Corso
    const chiave = `${analisi.ateneo}_${analisi.classeLaurea}_${analisi.materiaStandardizzata}_${analisi.corsoDiLaurea}`;

    if (!groups.has(chiave)) {
      groups.set(chiave, {
        chiave,
        ateneo: analisi.ateneo,
        classeLaurea: `${analisi.classeLaurea} - ${analisi.classeLaureaDescrizione}`,
        materiaStandardizzata: analisi.materiaStandardizzata,
        corsoDiLaurea: analisi.corsoDiLaurea,
        docente: analisi.docente,
        annoAccademico: analisi.annoAccademico,
        testiAdottati: [],
        numeroAnalisi: 0,
        analisiIds: []
      });
    }

    const group = groups.get(chiave)!;
    group.numeroAnalisi++;
    group.analisiIds.push(analisi.id);

    // Aggiungi testi evitando duplicati (stesso ISBN o stesso titolo+autori)
    analisi.testiAdottati.forEach(testo => {
      const exists = group.testiAdottati.some(t => 
        (t.isbn && testo.isbn && t.isbn === testo.isbn) ||
        (t.titolo === testo.titolo && JSON.stringify(t.autori) === JSON.stringify(testo.autori))
      );

      if (!exists) {
        group.testiAdottati.push({ ...testo });
      }

      // Identifica il titolo principale
      if (testo.isPrincipale && !group.titoloPrincipale) {
        group.titoloPrincipale = { ...testo };
      }
    });
  });

  // Converti in array e ordina
  const groupsArray = Array.from(groups.values());

  // Ordina in base al criterio di raggruppamento
  switch (groupBy) {
    case 'materia':
      return groupsArray.sort((a, b) => 
        a.materiaStandardizzata.localeCompare(b.materiaStandardizzata)
      );
    case 'ateneo':
      return groupsArray.sort((a, b) => 
        a.ateneo.localeCompare(b.ateneo)
      );
    case 'corso':
      return groupsArray.sort((a, b) => 
        a.corsoDiLaurea.localeCompare(b.corsoDiLaurea)
      );
    case 'docente':
      return groupsArray.sort((a, b) => 
        a.docente.localeCompare(b.docente)
      );
    default:
      return groupsArray;
  }
}

export function getUniqueValues(
  analyses: AdozioneData[],
  field: keyof AdozioneData
): string[] {
  const values = new Set<string>();
  
  analyses.forEach(analisi => {
    const value = analisi[field];
    if (typeof value === 'string' && value.trim()) {
      values.add(value.trim());
    }
  });

  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export function filterAnalyses(
  analyses: AdozioneData[],
  filters: {
    ateneo?: string;
    classeLaurea?: string;
    corso?: string;
    materia?: string;
    titolo?: string;
    searchText?: string;
  }
): AdozioneData[] {
  return analyses.filter(analisi => {
    if (filters.ateneo && analisi.ateneo !== filters.ateneo) return false;
    if (filters.classeLaurea && analisi.classeLaurea !== filters.classeLaurea) return false;
    if (filters.corso && analisi.corsoDiLaurea !== filters.corso) return false;
    if (filters.materia && analisi.materiaStandardizzata !== filters.materia) return false;
    
    if (filters.titolo) {
      const hasTitolo = analisi.testiAdottati.some(t => t.titolo === filters.titolo);
      if (!hasTitolo) return false;
    }
    
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const searchableText = [
        analisi.ateneo,
        analisi.corsoDiLaurea,
        analisi.materiaStandardizzata,
        analisi.nomeInsegnamento,
        analisi.docente,
        ...analisi.testiAdottati.map(t => t.titolo)
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchLower)) return false;
    }
    
    return true;
  });
}

export function calculateStats(analyses: AdozioneData[]) {
  const uniqueAtenei = new Set(analyses.map(a => a.ateneo)).size;
  const uniqueMaterie = new Set(analyses.map(a => a.materiaStandardizzata)).size;
  const uniqueCorsi = new Set(analyses.map(a => a.corsoDiLaurea)).size;
  const uniqueTitoli = new Set(
    analyses.flatMap(a => a.testiAdottati.map(t => t.titolo))
  ).size;
  
  const zanichelli = analyses.reduce((count, a) => {
    return count + a.testiAdottati.filter(t => 
      t.editore.toLowerCase().includes('zanichelli')
    ).length;
  }, 0);

  return {
    totaleAnalisi: analyses.length,
    totaleAtenei: uniqueAtenei,
    totaleMaterie: uniqueMaterie,
    totaleCorsi: uniqueCorsi,
    totaleTitoli: uniqueTitoli,
    titoliZanichelli: zanichelli
  };
}