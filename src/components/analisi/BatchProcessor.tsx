import React, { useEffect, useState } from 'react';
import { useQueueStore } from '../../stores/queue.store';
import { useAnalisiStore } from '../../stores/analisi.store';
import { useSettingsStore } from '../../stores/settings.store';
import { openAIService } from '../../services/openai.service';
import { ReviewAnalysis } from './ReviewAnalysis';
import { Button } from '../ui/Button';
import { PlayCircle, StopCircle, Plus, LayoutDashboard } from 'lucide-react';
import { Alert } from '../ui/Alert';

interface BatchProcessorProps {
  onAnalisiSalvata: (analisi: any) => void;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({ onAnalisiSalvata }) => {
  const { 
    items, 
    currentIndex, 
    isProcessing, 
    getCurrentItem, 
    updateItemStatus, 
    setItemResult,
    moveToNext,
    startProcessing,
    stopProcessing,
    getItemsCount
  } = useQueueStore();

  const { apiKey } = useSettingsStore();
  const { setError } = useAnalisiStore();
  
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const counts = getItemsCount();
  const currentItem = getCurrentItem();

  // Avvia l'analisi del prossimo elemento in coda
  const analyzeCurrentItem = async () => {
    const item = getCurrentItem();
    if (!item || !apiKey) return;

    setIsAnalyzing(true);
    updateItemStatus(item.id, 'analyzing');
    setError(null);

    try {
      openAIService.initialize(apiKey);
      const risultato = await openAIService.analizzaBibliografia(item.content);
      
      const analisiCompleta = {
        ...risultato,
        id: crypto.randomUUID(),
        testoOriginale: item.content,
        timestamp: new Date(),
        ultimaModifica: new Date()
      };

      // Salva il risultato nell'item
      setItemResult(item.id, analisiCompleta);
      updateItemStatus(item.id, 'reviewing');
      
      // Mostra per revisione
      setCurrentAnalysis(analisiCompleta);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Errore durante l\'analisi';
      updateItemStatus(item.id, 'error', errorMessage);
      setError(errorMessage);
      
      // Passa automaticamente al prossimo in caso di errore
      setTimeout(() => {
        moveToNext();
      }, 2000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quando cambia l'item corrente, avvia l'analisi
  useEffect(() => {
    if (isProcessing && currentItem && currentItem.status === 'pending') {
      analyzeCurrentItem();
    }
  }, [currentIndex, isProcessing]);

  const handleStartProcessing = () => {
    if (!apiKey) {
      setError('Configura la chiave API nelle impostazioni prima di iniziare');
      return;
    }
    
    if (counts.pending === 0) {
      setError('Nessun elemento in attesa da analizzare');
      return;
    }

    startProcessing();
  };

  const handleConfirmAndContinue = (analisiModificata: any) => {
    if (!currentItem) return;

    // Salva l'analisi
    onAnalisiSalvata(analisiModificata);
    
    // Aggiorna lo stato dell'item
    updateItemStatus(currentItem.id, 'completed');
    setCurrentAnalysis(null);
    
    // Passa al prossimo
    moveToNext();
  };

  const handleSkip = () => {
    if (!currentItem) return;
    
    updateItemStatus(currentItem.id, 'error', 'Saltato dall\'utente');
    setCurrentAnalysis(null);
    moveToNext();
  };

  const handleStopProcessing = () => {
    stopProcessing();
    setCurrentAnalysis(null);
  };

  // Se stiamo mostrando la revisione
  if (currentAnalysis && currentItem?.status === 'reviewing') {
    return (
      <ReviewAnalysis
        analisi={currentAnalysis}
        onConfirm={handleConfirmAndContinue}
        onSkip={handleSkip}
        itemNumber={currentIndex + 1}
        totalItems={items.length}
      />
    );
  }

  // Controlli del batch
  if (items.length > 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Elaborazione Batch
          </h3>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">{counts.total}</span> elementi totali
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {counts.pending} in attesa • {counts.completed} completati
                  {counts.errors > 0 && ` • ${counts.errors} errori`}
                </p>
              </div>

              {!isProcessing ? (
                <Button
                  onClick={handleStartProcessing}
                  disabled={counts.pending === 0 || !apiKey}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" />
                  Avvia Elaborazione
                </Button>
              ) : (
                <Button
                  onClick={handleStopProcessing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <StopCircle className="w-5 h-5" />
                  Interrompi
                </Button>
              )}
            </div>

            {isProcessing && isAnalyzing && (
              <Alert type="info">
                Analisi in corso dell'elemento {currentIndex + 1} di {items.length}...
              </Alert>
            )}

            {!apiKey && (
              <Alert type="warning">
                Configura la chiave API nelle impostazioni per iniziare l'elaborazione
              </Alert>
            )}
          </div>

          {/* Barra di progresso */}
          {items.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progresso</span>
                <span>{Math.round((counts.completed / counts.total) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-zanichelli-red h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(counts.completed / counts.total) * 100}%` }}
                />
              </div>

              {/* Messaggio quando tutto è completato */}
              {counts.completed === counts.total && counts.total > 0 && !isProcessing && (
                <div className="mt-6 p-6 bg-green-50 border-2 border-green-500 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-green-900 mb-2">
                        ✓ Elaborazione Completata!
                      </h4>
                      <p className="text-green-800 mb-4">
                        Tutte le {counts.total} analisi sono state completate e salvate nella cronologia.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            const { clearQueue } = useQueueStore.getState();
                            clearQueue();
                            window.location.reload();
                          }}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Nuova Analisi Batch
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const { clearQueue } = useQueueStore.getState();
                            clearQueue();
                            const allButtons = Array.from(document.querySelectorAll('button'));
                            const dashboardBtn = allButtons.find(btn => btn.textContent?.includes('Dashboard'));
                            if (dashboardBtn) {
                              dashboardBtn.click();
                            }
                          }}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          Vedi Tutte le Analisi
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
