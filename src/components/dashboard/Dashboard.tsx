// src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { FilterPanel } from './FilterPanel';
import { GroupedAnalysisList } from './GroupedAnalysisList';
import { useDashboardStore } from '../../stores/dashboard.store';
import { storageService } from '../../services/storage.service';
import { groupAnalyses } from '../../services/dashboard.service';
import { AdozioneData, AnalisiGroup } from '../../types/adozione.types';
import { DashboardFilters } from '../../types/dashboard.types';
import { Download, Upload, Trash2, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export const Dashboard: React.FC = () => {
  const { groupBy, setGroupBy, filters, setFilters } = useDashboardStore();
  const [analyses, setAnalyses] = useState<AdozioneData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Carica analisi al mount
  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = async () => {
    try {
      setLoading(true);
      const data = await storageService.getAllAnalyses();
      setAnalyses(data);
      setError('');
    } catch (err) {
      setError('Errore nel caricamento delle analisi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtra e raggruppa analisi
  const { filteredAnalyses, groupedAnalyses, stats } = useMemo(() => {
    // Applica filtri
    let filtered = analyses.filter(analisi => {
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

    // Raggruppa
    const grouped = groupAnalyses(filtered, groupBy);

    // Calcola statistiche
    const uniqueAtenei = new Set(filtered.map(a => a.ateneo)).size;
    const uniqueMaterie = new Set(filtered.map(a => a.materiaStandardizzata)).size;
    const uniqueCorsi = new Set(filtered.map(a => a.corsoDiLaurea)).size;
    const uniqueTitoli = new Set(
      filtered.flatMap(a => a.testiAdottati.map(t => t.titolo))
    ).size;
    const zanichelli = filtered.reduce((count, a) => {
      return count + a.testiAdottati.filter(t => 
        t.editore.toLowerCase().includes('zanichelli')
      ).length;
    }, 0);

    return {
      filteredAnalyses: filtered,
      groupedAnalyses: grouped,
      stats: {
        totaleAnalisi: filtered.length,
        totaleAtenei: uniqueAtenei,
        totaleMaterie: uniqueMaterie,
        totaleCorsi: uniqueCorsi,
        totaleTitoli: uniqueTitoli,
        titoliZanichelli: zanichelli
      }
    };
  }, [analyses, filters, groupBy]);

  // Export JSON
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(analyses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `zanichelli-adozioni-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Errore durante l\'export');
    }
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        if (!Array.isArray(importedData)) {
          throw new Error('Formato file non valido');
        }

        // Salva tutte le analisi importate
        for (const analisi of importedData) {
          await storageService.saveAnalysis(analisi);
        }

        await loadAnalyses();
        alert(`${importedData.length} analisi importate con successo`);
      } catch (err) {
        alert('Errore durante l\'import: file non valido');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Cancella tutte le analisi
  const handleClearAll = async () => {
    if (!confirm('Sei sicuro di voler cancellare TUTTE le analisi? Questa operazione non può essere annullata.')) {
      return;
    }

    try {
      await storageService.clearAllAnalyses();
      await loadAnalyses();
    } catch (err) {
      alert('Errore durante la cancellazione');
    }
  };

  // Export CSV per analisi di mercato
  const handleExportCSV = () => {
    try {
      const headers = [
        'Ateneo',
        'Classe Laurea',
        'Corso',
        'Materia',
        'Docente',
        'Anno Accademico',
        'Titolo',
        'Autori',
        'Editore',
        'ISBN',
        'Tipologia',
        'È Principale'
      ];

      const rows = filteredAnalyses.flatMap(analisi =>
        analisi.testiAdottati.map(testo => [
          analisi.ateneo,
          `${analisi.classeLaurea} - ${analisi.classeLaureaDescrizione}`,
          analisi.corsoDiLaurea,
          analisi.materiaStandardizzata,
          analisi.docente,
          analisi.annoAccademico,
          testo.titolo,
          testo.autori.join('; '),
          testo.editore,
          testo.isbn || '',
          testo.tipologia,
          testo.isPrincipale ? 'Sì' : 'No'
        ])
      );

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analisi-mercato-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Errore durante l\'export CSV');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento analisi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <div>{error}</div>
      </Alert>
    );
  }

  return (
    <div>
      {/* Header con Statistiche */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Adozioni</h2>
            <p className="text-gray-600 mt-1">
              Analisi e statistiche sulle adozioni librarie universitarie
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredAnalyses.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={analyses.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <label>
              <Button variant="outline" size="sm" as="span">
                <Upload className="w-4 h-4 mr-2" />
                Import JSON
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            {analyses.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancella Tutto
              </Button>
            )}
          </div>
        </div>

        {/* Statistiche Principali */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Analisi Totali</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totaleAnalisi}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Atenei</div>
            <div className="text-2xl font-bold text-green-600">{stats.totaleAtenei}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Materie</div>
            <div className="text-2xl font-bold text-purple-600">{stats.totaleMaterie}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Corsi</div>
            <div className="text-2xl font-bold text-orange-600">{stats.totaleCorsi}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Titoli Unici</div>
            <div className="text-2xl font-bold text-indigo-600">{stats.totaleTitoli}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Titoli Zanichelli</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.titoliZanichelli}</div>
          </div>
        </div>
      </div>

      {/* Filtri */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        analyses={analyses}
      />

      {/* Controlli Raggruppamento */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Raggruppa per:</span>
          </div>
          <div className="flex gap-2">
            {(['materia', 'ateneo', 'corso', 'docente'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setGroupBy(option)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  groupBy === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista Raggruppata */}
      {filteredAnalyses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nessuna analisi trovata
          </h3>
          <p className="text-gray-600 mb-4">
            {analyses.length === 0
              ? 'Inizia caricando i primi programmi didattici dalla sezione "Nuova Analisi"'
              : 'Prova a modificare i filtri di ricerca'}
          </p>
        </div>
      ) : (
        <GroupedAnalysisList
          groups={groupedAnalyses}
          groupBy={groupBy}
          onRefresh={loadAnalyses}
        />
      )}
    </div>
  );
};