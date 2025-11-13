import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';
import type { AnalisiAdozione } from '../../types/adozione.types';

interface AnalysisRowProps {
  analisi: AnalisiAdozione;
  onDelete: (id: string) => void;
}

export const AnalysisRow: React.FC<AnalysisRowProps> = ({ analisi, onDelete }) => {
  const titoloPrincipale = analisi.bibliografia[0];
  const isZanichelli = titoloPrincipale?.editore?.toLowerCase().includes('zanichelli');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm text-gray-900">
          {/* Ateneo */}
          <span className="font-medium text-gray-700">{analisi.ateneo}</span>
          <span className="text-gray-400">/</span>
          
          {/* Classe di Laurea */}
          <span className="text-gray-600">{analisi.classeLaurea}</span>
          <span className="text-gray-400">/</span>
          
          {/* Corso di Laurea */}
          <span className="text-gray-600">{analisi.corsoLaurea}</span>
          <span className="text-gray-400">/</span>
          
          {/* Docente */}
          <span className="text-gray-600">{analisi.docente}</span>
          <span className="text-gray-400">/</span>
          
          {/* Titolo Principale */}
          {titoloPrincipale && (
            <span className="flex items-center gap-2">
              <span className={isZanichelli ? 'font-semibold text-blue-700' : 'text-gray-900'}>
                {titoloPrincipale.titolo}
              </span>
              <span className="text-gray-500">
                ({titoloPrincipale.autore} - {titoloPrincipale.editore})
              </span>
              {isZanichelli && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Zanichelli
                </span>
              )}
            </span>
          )}
        </div>
        
        {/* Data */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(analisi.dataAnalisi)}</span>
        </div>
      </div>

      {/* Azioni */}
      <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onDelete(analisi.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Elimina analisi"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
