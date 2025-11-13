import React from 'react';
import { FileText, Settings, BarChart3 } from 'lucide-react';
import { useNavigationStore } from '../stores/navigation.store';

export const Header: React.FC = () => {
  const { currentView, setView } = useNavigationStore();

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'nuova-analisi' as const, label: 'Nuova Analisi', icon: FileText },
    { id: 'impostazioni' as const, label: 'Impostazioni', icon: Settings },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Zanichelli Adozioni Analyzer</h1>
              <p className="text-blue-100 text-sm">Analisi intelligente delle adozioni universitarie</p>
            </div>
          </div>
          
          <nav className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    console.log('Clicked:', item.id); // Debug
                    setView(item.id);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'bg-blue-700 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
