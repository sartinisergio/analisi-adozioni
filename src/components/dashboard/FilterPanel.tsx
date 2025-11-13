// src/components/dashboard/FilterPanel.tsx
import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { DashboardFilters } from '../../types/dashboard.types';
import { AdozioneData } from '../../types/adozione.types';
import { getUniqueValues } from '../../services/dashboard.service';

interface FilterPanelProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  analyses: AdozioneData[]; // Aggiungi questo per generare filtri dinamici
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  analyses
}) => {
  // Genera opzioni dinamiche dai dati esistenti
  const filterOptions = useMemo(() => ({
    atenei: getUniqueValues(analyses, 'ateneo'),
    classi: getUniqueValues(analyses, 'classeLaurea'),
    corsi: getUniqueValues(analyses, 'corsoDiLaurea'),
    materie: getUniqueValues(analyses, 'materiaStandardizzata'), // USA materiaStandardizzata
    titoli: analyses.reduce((acc, a) => {
      a.testiAdottati.forEach(t => {
        if (!acc.includes(t.titolo)) acc.push(t.titolo);
      });
      return acc;
    }, [] as string[]).sort()
  }), [analyses]);

  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Filtri di Ricerca</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Filtro Ateneo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ateneo
          </label>
          <select
            value={filters.ateneo}
            onChange={(e) => updateFilter('ateneo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti gli atenei</option>
            {filterOptions.atenei.map(ateneo => (
              <option key={ateneo} value={ateneo}>{ateneo}</option>
            ))}
          </select>
        </div>

        {/* Filtro Classe di Laurea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Classe di Laurea
          </label>
          <select
            value={filters.classeLaurea}
            onChange={(e) => updateFilter('classeLaurea', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutte le classi</option>
            {filterOptions.classi.map(classe => (
              <option key={classe} value={classe}>{classe}</option>
            ))}
          </select>
        </div>

        {/* Filtro Corso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Corso di Laurea
          </label>
          <select
            value={filters.corso}
            onChange={(e) => updateFilter('corso', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i corsi</option>
            {filterOptions.corsi.map(corso => (
              <option key={corso} value={corso}>{corso}</option>
            ))}
          </select>
        </div>

        {/* Filtro Materia STANDARDIZZATA */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Materia
          </label>
          <select
            value={filters.materia}
            onChange={(e) => updateFilter('materia', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutte le materie</option>
            {filterOptions.materie.map(materia => (
              <option key={materia} value={materia}>{materia}</option>
            ))}
          </select>
        </div>

        {/* Filtro Titolo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titolo Adottato
          </label>
          <select
            value={filters.titolo}
            onChange={(e) => updateFilter('titolo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tutti i titoli</option>
            {filterOptions.titoli.map(titolo => (
              <option key={titolo} value={titolo}>{titolo}</option>
            ))}
          </select>
        </div>

        {/* Ricerca Libera */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ricerca Libera
          </label>
          <Input
            type="text"
            value={filters.searchText}
            onChange={(e) => updateFilter('searchText', e.target.value)}
            placeholder="Cerca in tutti i campi..."
          />
        </div>
      </div>

      {/* Indicatore filtri attivi */}
      {Object.values(filters).some(v => v !== '') && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Filtri attivi: {Object.values(filters).filter(v => v !== '').length}
          </span>
          <button
            onClick={() => onFiltersChange({
              ateneo: '',
              classeLaurea: '',
              corso: '',
              materia: '',
              titolo: '',
              searchText: ''
            })}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Cancella tutti i filtri
          </button>
        </div>
      )}
    </div>
  );
};