// src/App.tsx
import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { FormAnalisi } from './components/analisi/FormAnalisi';
import { ReviewAnalysis } from './components/analisi/ReviewAnalysis';
import { SettingsModal } from './components/settings/SettingsModal';
import { useNavigationStore } from './stores/navigation.store';
import { useAnalisiStore } from './stores/analisi.store'; // ← CORRETTO
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
  } = useAnalisiStore(); // ← CORRETTO

  const { apiKey } = useSettingsStore();

  useEffect(() => {
    if (apiKey) {
      initializeOpenAI(apiKey);
    }
  }, [apiKey]);

  const handleAnalysisComplete = (analysisId: string) => {
    const queueItem = queueService.getQueue().find(
      item => item.result?.id === analysisId
    );
    
    if (queueItem?.result) {
      addPendingReview(queueItem.result);
      setView('review');
    }
  };

  const handleReviewSave = async (reviewedData: AdozioneData) => {
    try {
      await storageService.saveAnalysis(reviewedData);
      removePendingReview(reviewedData.id);
      
      if (pendingReviews.length > 1) {
        const nextReview = pendingReviews.find(a => a.id !== reviewedData.id);
        setCurrentReview(nextReview || null);
      } else {
        setView('dashboard');
      }
    } catch (error) {
      console.error('Errore salvataggio analisi:', error);
      alert('Errore durante il salvataggio. Riprova.');
    }
  };

  const handleReviewDiscard = (analysisId: string) => {
    removePendingReview(analysisId);
    
    if (pendingReviews.length > 1) {
      const nextReview = pendingReviews.find(a => a.id !== analysisId);
      setCurrentReview(nextReview || null);
    } else {
      setView('new');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        
        {currentView === 'new' && (
          <FormAnalisi onAnalysisComplete={handleAnalysisComplete} />
        )}
        
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
        
        {currentView === 'settings' && <SettingsModal />}
      </main>
    </div>
  );
}

export default App;