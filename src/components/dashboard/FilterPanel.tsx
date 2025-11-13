import React from 'react';
import { Search, X } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboard.store';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { GroupByOption } from '../../types/dashboard.types';

export const FilterPanel: React.FC = () => {
  const { filters, groupBy, setFilter, setGroupBy, clearFilters } = useDashboardStore();

  const groupByOptions: { value: GroupByOption; label: string }[] = [
    { value: 'materia', label: 'Materia' },
    { value: 'ateneo', label: 'Ateneo' },
    { value: 'corso', label: 'Corso' },
    { value: 'docente', label: 'Docente' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Search className="w-5 h-5" />
          <span>Filtri di Ricerca</span>
        </h3>
        <Button
          onClick={clearFilters}
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1"
        >
          <X className="w-4 h-4" />
          <span>Pulisci Filtri</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Input
          label="Ateneo"
          value={filters.ateneo}
          onChange={(e) => setFilter('ateneo', e.target.value)}
          placeholder="Cerca per ateneo..."
        />
        <Input
          label="Classe di Laurea"
          value={filters.classeLaurea}
          onChange={(e) => setFilter('classeLaurea', e.target.value)}
          placeholder="Cerca per classe..."
        />
        <Input
          label="Corso"
          value={filters.corso}
          onChange={(e) => setFilter('corso', e.target.value)}
          placeholder="Cerca per corso..."
        />
        <Input
          label="Materia"
          value={filters.materia}
          onChange={(e) => setFilter('materia', e.target.value)}
          placeholder="Cerca per materia..."
        />
        <Input
          label="Titolo Libro"
          value={filters.titolo}
          onChange={(e) => setFilter('titolo', e.target.value)}
          placeholder="Cerca per titolo..."
        />
      </div>

      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Raggruppa per:
        </label>
        <div className="flex flex-wrap gap-2">
          {groupByOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setGroupBy(option.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                groupBy === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
