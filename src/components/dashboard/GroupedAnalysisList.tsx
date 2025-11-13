// src/components/dashboard/GroupedAnalysisList.tsx
import React, { useState } from 'react';
import { AnalisiGroup } from '../../types/adozione.types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  ChevronDown, 
  ChevronRight, 
  Book, 
  GraduationCap, 
  User,
  MapPin,
  Star,
  Trash2
} from 'lucide-react';
import { storageService } from '../../services/storage.service';

interface GroupedAnalysisListProps {
  groups: AnalisiGroup[];
  groupBy: 'materia' | 'ateneo' | 'corso' | 'docente';
  onRefresh: () => void;
}

export const GroupedAnalysisList: React.FC<GroupedAnalysisListProps> = ({
  groups,
  groupBy,
  onRefresh
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (chiave: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(chiave)) {
      newExpanded.delete(chiave);
    } else {
      newExpanded.add(chiave);
    }
    setExpandedGroups(newExpanded);
  };

  const handleDeleteGroup = async (group: AnalisiGroup) => {
    if (!confirm(`Eliminare tutte le ${group.numeroAnalisi} analisi di questo gruppo?`)) {
      return;
    }

    try {
      for (const id of group.analisiIds) {
        await storageService.deleteAnalysis(id);
      }
      onRefresh();
    } catch (err) {
      alert('Errore durante l\'eliminazione');
    }
  };

  const getGroupIcon = () => {
    switch (groupBy) {
      case 'materia': return <Book className="w-5 h-5" />;
      case 'ateneo': return <MapPin className="w-5 h-5" />;
      case 'corso': return <GraduationCap className="w-5 h-5" />;
      case 'docente': return <User className="w-5 h-5" />;
    }
  };

  const getGroupTitle = (group: AnalisiGroup) => {
    switch (groupBy) {
      case 'materia': return group.materiaStandardizzata;
      case 'ateneo': return group.ateneo;
      case 'corso': return group.corsoDiLaurea;
      case 'docente': return group.docente;
    }
  };

  const getGroupSubtitle = (group: AnalisiGroup) => {
    switch (groupBy) {
      case 'materia':
        return `${group.ateneo} • ${group.classeLaurea} • ${group.corsoDiLaurea}`;
      case 'ateneo':
        return `${group.materiaStandardizzata} • ${group.classeLaurea}`;
      case 'corso':
        return `${group.ateneo} • ${group.materiaStandardizzata}`;
      case 'docente':
        return `${group.ateneo} • ${group.materiaStandardizzata} • ${group.corsoDiLaurea}`;
    }
  };

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.chiave);

        return (
          <Card key={group.chiave} className="overflow-hidden">
            {/* Header Gruppo */}
            <div
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
              onClick={() => toggleGroup(group.chiave)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1 text-blue-600">
                    {getGroupIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getGroupTitle(group)}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {group.numeroAnalisi} {group.numeroAnalisi === 1 ? 'programma' : 'programmi'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getGroupSubtitle(group)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Docente: {group.docente} • A.A. {group.annoAccademico}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Contenuto Espanso */}
            {isExpanded && (
              <div className="p-6">
                {/* Titolo Principale */}
                {group.titoloPrincipale && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold text-yellow-900 mb-1">
                          Testo Principale
                        </div>
                        <div className="text-sm text-yellow-800">
                          <div className="font-medium">{group.titoloPrincipale.titolo}</div>
                          <div className="text-yellow-700 mt-1">
                            {group.titoloPrincipale.autori.join(', ')}
                          </div>
                          <div className="flex gap-4 mt-2 text-xs">
                            <span>Editore: {group.titoloPrincipale.editore}</span>
                            {group.titoloPrincipale.anno && (
                              <span>Anno: {group.titoloPrincipale.anno}</span>
                            )}
                            {group.titoloPrincipale.isbn && (
                              <span>ISBN: {group.titoloPrincipale.isbn}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Altri Testi */}
                {group.testiAdottati.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Tutti i Testi Adottati ({group.testiAdottati.length})
                    </h4>
                    <div className="space-y-3">
                      {group.testiAdottati.map((testo) => (
                        <div
                          key={testo.id}
                          className={`p-4 rounded-lg border ${
                            testo.isPrincipale
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {testo.isPrincipale && (
                              <Star className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {testo.titolo}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {testo.autori.join(', ')}
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                                    testo.tipologia === 'principale'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : testo.tipologia === 'consigliato'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {testo.tipologia}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                                <span className="font-medium">
                                  {testo.editore}
                                  {testo.editore.toLowerCase().includes('zanichelli') && (
                                    <span className="ml-1 text-yellow-600">★</span>
                                  )}
                                </span>
                                {testo.anno && <span>Anno: {testo.anno}</span>}
                                {testo.edizione && <span>Ed. {testo.edizione}</span>}
                                {testo.isbn && <span>ISBN: {testo.isbn}</span>}
                              </div>
                              {testo.note && (
                                <div className="mt-2 text-xs text-gray-600 italic">
                                  Note: {testo.note}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};