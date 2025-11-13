import React, { useEffect, useState } from 'react';
import { Download, Upload, Filter, X } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboard.store';
import { FilterPanel } from './FilterPanel';
import { GroupedAnalysisList } from './GroupedAnalysisList';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';

export const Dashboard: React.FC = () => {
  const { loadData, exportData, importData, clearFilters, allData } = useDashboardStore();
  const [showFilters, setShowFilters] = useState(true);
  const [importMode, setImportMode] = useState<'overwrite' | 'append'>('append');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zanichelli-adozioni-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage({ type: 'success', text: `Esportate ${allData.length} adozioni con successo!` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Errore durante l\'esportazione' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string;
        await importData(jsonData, importMode);
        setMessage({ 
          type: 'success', 
          text: `Dati importati con successo! (modalità: ${importMode === 'overwrite' ? 'sovrascrivi' : 'aggiungi'})` 
        });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: 'Errore durante l\'importazione. Verifica il formato del file.' });
        setTimeout(() => setMessage(null), 3000);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header Dashboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Analisi Adozioni</h2>
            <p className="text-gray-600 mt-1">
              Visualizza, filtra ed esporta le tue analisi • {allData.length} adozioni totali
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? 'primary' : 'secondary'}
              className="flex items-center space-x-2"
            >
              {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              <span>{showFilters ? 'Nascondi' : 'Mostra'} Filtri</span>
            </Button>
            
            <Button
              onClick={handleExport}
              variant="secondary"
              className="flex items-center space-x-2"
              disabled={allData.length === 0}
            >
              <Download className="w-4 h-4" />
              <span>Esporta JSON</span>
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button
                  as="span"
                  variant="secondary"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Importa JSON</span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Selezione modalità import */}
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-700 font-medium">Modalità importazione:</span>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="append"
              checked={importMode === 'append'}
              onChange={(e) => setImportMode(e.target.value as 'append')}
              className="w-4 h-4 text-blue-600"
            />
            <span>Aggiungi ai dati esistenti</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="overwrite"
              checked={importMode === 'overwrite'}
              onChange={(e) => setImportMode(e.target.value as 'overwrite')}
              className="w-4 h-4 text-blue-600"
            />
            <span>Sovrascrivi tutti i dati</span>
          </label>
        </div>

        {/* Messaggi di feedback */}
        {message && (
          <div className="mt-4">
            <Alert variant={message.type}>
              {message.text}
            </Alert>
          </div>
        )}
      </div>

      {/* Pannello Filtri */}
      {showFilters && <FilterPanel />}

      {/* Lista Raggruppata */}
      <GroupedAnalysisList />
    </div>
  );
};
