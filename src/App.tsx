import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { FormAnalisi } from './components/analisi/FormAnalisi';
import { SettingsModal } from './components/settings/SettingsModal';
import { useNavigationStore } from './stores/navigation.store';

function App() {
  const { currentView, setView } = useNavigationStore();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (currentView === 'impostazioni') {
      setShowSettings(true);
    }
  }, [currentView]);

  const handleCloseSettings = () => {
    setShowSettings(false);
    setView('nuova-analisi');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'nuova-analisi':
      case 'impostazioni':
        return <FormAnalisi />;
      default:
        return <FormAnalisi />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={handleCloseSettings} 
      />
    </div>
  );
}

export default App;
