// src/App.tsx
import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { FormAnalisi } from './components/analisi/FormAnalisi';
import { ReviewAnalysis } from './components/analisi/ReviewAnalysis';
import { SettingsModal } from './components/settings/SettingsModal';
import { useNavigationStore } from './stores/navigation.store';
import { useAnalysisStore } from './stores/analysis.store';
import { useSettingsStore } from './stores/settings.store';
import { initializeOpenAI } from './services/openai.service';
import { storageService } from './services/storage.service';
import { queueService } from './services/queue.service';
import { AdozioneData } from './types/adozione.types';

function App() {
  const { currentView, setView } = useNavigationStore();
  const { 
    pendingReviews, 
    currentReview, 
    addPendingReview, 
    setCurrentReview,
    removePendingReview 
  } = useAnalysisStore();
  const { apiKey } = useSettingsStore();

  // Inizializza OpenAI quando l'API key è disponibile
  useEffect(() => {
    if (apiKey) {
      initializeOpenAI(apiKey);
    }
  }, [apiKey]);

  // Handler quando un'analisi è completata dalla coda
  const handleAnalysisComplete = (analysisId: string) => {
    // Recupera l'analisi dalla coda
    const queueItem = queueService.getQueue().find(
      item => item.result?.id === analysisId
    );
    
    if (queueItem?.result) {
      // Aggiungi alle analisi in attesa di revisione
      addPendingReview(queueItem.result);
      
      // Passa automaticamente alla vista di revisione
      setView('review');
    }
  };

  // Handler quando la revisione è completata e salvata
  const handleReviewSave = async (reviewedData: AdozioneData) => {
    try {
      // Salva nel storage
      await storageService.saveAnalysis(reviewedData);
      
      // Rimuovi dalle pending reviews
      removePendingReview(reviewedData.id);
      
      // Se ci sono altre analisi da revisionare, mostra la prossima
      if (pendingReviews.length > 1) {
        const nextReview = pendingReviews.find(a => a.id !== reviewedData.id);
        setCurrentReview(nextReview || null);
      } else {
        // Altrimenti torna alla dashboard
        setView('dashboard');
      }
    } catch (error) {
      console.error('Errore salvataggio analisi:', error);
      alert('Errore durante il salvataggio. Riprova.');
    }
  };

  // Handler per scartare un'analisi
  const handleReviewDiscard = (analysisId: string) => {
    removePendingReview(analysisId);
    
    // Se ci sono altre analisi, mostra la prossima
    if (pendingReviews.length > 1) {
      const nextReview = pendingReviews.find(a => a.id !== analysisId);
      setCurrentReview(nextReview || null);
    } else {
      // Altrimenti torna alla nuova analisi
      setView('new');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Vista Dashboard */}
        {currentView === 'dashboard' && <Dashboard />}
        
        {/* Vista Nuova Analisi */}
        {currentView === 'new' && (
          <FormAnalisi onAnalysisComplete={handleAnalysisComplete} />
        )}
        
        {/* Vista Revisione */}
        {currentView === 'review' && currentReview && (
          <div>
            {pendingReviews.length > 1 && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">
                    Analisi in attesa di revisione: {pendingReviews.length}
                  </span>
                  <br />
                  Stai revisionando: {currentReview.nomeFile}
                </p>
              </div>
            )}
            
            <ReviewAnalysis
              data={currentReview}
              onSave={handleReviewSave}
              onDiscard={handleReviewDiscard}
            />
          </div>
        )}
        
        {/* Vista Impostazioni */}
        {currentView === 'settings' && <SettingsModal />}
      </main>
    </div>
  );
}

export default App;