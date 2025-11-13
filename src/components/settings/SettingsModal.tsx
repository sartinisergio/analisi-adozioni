import React, { useState } from 'react';
import { X, Save, Key, Cpu } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { useSettingsStore } from '../../stores/settings.store';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, model, setApiKey, setModel } = useSettingsStore();
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(model);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(localApiKey);
    setModel(localModel);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 2000);
  };

  const models = [
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Consigliato - Veloce ed Economico)' },
    { value: 'gpt-4o', label: 'GPT-4o (Più Preciso)' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Economico)' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Impostazioni</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {saved && (
            <Alert variant="success">
              ✓ Impostazioni salvate con successo!
            </Alert>
          )}

          {/* API Key Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Key className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">API Key OpenAI</h3>
            </div>
            
            <Input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="sk-..."
              label="Inserisci la tua API Key"
            />
            
            <div className="mt-3 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Come ottenere una API Key:</strong>
              </p>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Vai su <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">platform.openai.com/api-keys</a></li>
                <li>Accedi con il tuo account OpenAI</li>
                <li>Clicca su "Create new secret key"</li>
                <li>Copia la chiave e incollala qui sopra</li>
              </ol>
            </div>
          </div>

          {/* Model Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Modello AI</h3>
            </div>
            
            <div className="space-y-2">
              {models.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    localModel === m.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={m.value}
                    checked={localModel === m.value}
                    onChange={(e) => setLocalModel(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{m.label}</span>
                </label>
              ))}
            </div>

            <div className="mt-3 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> GPT-4o Mini è consigliato per il miglior rapporto qualità/prezzo.
                Ogni analisi costa circa $0.01-0.03.
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Informazioni sulla Privacy</h4>
            <p className="text-sm text-gray-600">
              La tua API Key viene salvata localmente nel browser e non viene mai inviata a server esterni.
              Viene utilizzata solo per comunicare direttamente con OpenAI.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Salva Impostazioni</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
