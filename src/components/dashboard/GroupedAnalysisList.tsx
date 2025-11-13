import React from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { useDashboardStore } from '../../stores/dashboard.store';
import { Button } from '../ui/Button';

export const GroupedAnalysisList: React.FC = () => {
  const { groupedData, toggleGroup, loadMoreInGroup, isLoading } = useDashboardStore();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Caricamento dati in corso...</p>
      </div>
    );
  }

  if (groupedData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessuna analisi trovata</h3>
        <p className="text-gray-500">Inizia caricando un PDF dalla sezione "Nuova Analisi"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedData.map((group) => {
        const visibleItems = group.items.slice(0, group.page * 20);
        const hasMore = visibleItems.length < group.items.length;
        const zanichelliCount = group.items.filter(item => item.isZanichelli).length;

        return (
          <div key={group.groupKey} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header del gruppo */}
            <button
              onClick={() => toggleGroup(group.groupKey)}
              className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 transition-all"
            >
              <div className="flex items-center space-x-3">
                {group.isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                )}
                <h3 className="text-lg font-bold text-gray-800">{group.groupLabel}</h3>
                <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                  {group.items.length} {group.items.length === 1 ? 'adozione' : 'adozioni'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {zanichelliCount > 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
                    {zanichelliCount} Zanichelli
                  </span>
                )}
              </div>
            </button>

            {/* Contenuto del gruppo */}
            {group.isExpanded && (
              <div className="divide-y divide-gray-100">
                {visibleItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">
                          {item.ateneo} / {item.classeLaurea} / {item.corso} / {item.docente}
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-800">{item.titolo}</h4>
                          {item.isZanichelli && (
                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-md shadow-sm">
                              ZANICHELLI
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.autore} - {item.editore}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                        {new Date(item.dataAnalisi).toLocaleDateString('it-IT')}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pulsante Carica Altri */}
                {hasMore && (
                  <div className="px-6 py-4 bg-gray-50">
                    <Button
                      onClick={() => loadMoreInGroup(group.groupKey)}
                      variant="secondary"
                      className="w-full"
                    >
                      Carica altri 20 risultati ({group.items.length - visibleItems.length} rimanenti)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
