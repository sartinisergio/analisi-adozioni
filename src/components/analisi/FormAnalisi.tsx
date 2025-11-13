// src/components/analisi/FormAnalisi.tsx
import React, { useState, useEffect } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { isOpenAIInitialized } from '../../services/openai.service';
import { queueService } from '../../services/queue.service';
import { QueueViewer } from './QueueViewer';
import { QueueItem } from '../../types/adozione.types';

interface FormAnalisiProps {
  onAnalysisComplete: (analysisId: string) => void;
}

export const FormAnalisi: React.FC<FormAnalisiProps> = ({ onAnalysisComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    // Sottoscrivi agli aggiornamenti della coda
    const unsubscribe = queueService.subscribe((updatedQueue) => {
      setQueue(updatedQueue);
      
      // Se ci sono analisi completate, notifica il componente padre
      updatedQueue.forEach(item => {
        if (item.status === 'completed' && item.result) {
          onAnalysisComplete(item.result.id);
        }
      });
    });

    return unsubscribe;
  }, [onAnalysisComplete]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Valida che siano tutti PDF
    const invalidFiles = files.filter(f => f.type !== 'application/pdf');
    if (invalidFiles.length > 0) {
      setError(`${invalidFiles.length} file non sono PDF validi`);
      return;
    }

    setSelectedFiles(files);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isOpenAIInitialized()) {
      setError('Configura la API Key di OpenAI nelle impostazioni prima di procedere');
      return;
    }

    if (selectedFiles.length === 0) {
      setError('Seleziona almeno un file PDF');
      return;
    }

    try {
      // Aggiungi i file alla coda
      queueService.addToQueue(selectedFiles);
      
      // Reset form
      setSelectedFiles([]);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'aggiunta alla coda');
    }
  };

  const handleRetryFailed = () => {
    queueService.retryFailed();
  };

  const handleClearCompleted = () => {
    queueService.removeCompleted();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Nuova Analisi Adozioni
        </h2>
        <p className="text-gray-600">
          Carica uno o più programmi didattici in formato PDF per estrarre automaticamente 
          le informazioni sulle adozioni librarie
        </p>
      </div>

      {!isOpenAIInitialized() && (
        <Alert variant="warning" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <div>
            <div className="font-semibold">API Key non configurata</div>
            <div className="text-sm mt-1">
              Vai nelle Impostazioni per configurare la tua API Key di OpenAI
            </div>
          </div>
        </Alert>
      )}

      {error && (
        <Alert variant="error" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <div>{error}</div>
        </Alert>
      )}

      {/* Visualizzatore Coda */}
      <QueueViewer
        queue={queue}
        onRetryFailed={handleRetryFailed}
        onClearCompleted={handleClearCompleted}
      />

      {/* Form Upload */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleziona File PDF
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Carica file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".pdf"
                        multiple
                        className="sr-only"
                        onChange={handleFileSelect}
                        disabled={!isOpenAIInitialized()}
                      />
                    </label>
                    <p className="pl-1">o trascina qui</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF fino a 10MB ciascuno (puoi selezionare più file)
                  </p>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  File selezionati: {selectedFiles.length}
                </h4>
                <ul className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={!isOpenAIInitialized() || selectedFiles.length === 0}
                className="flex-1"
              >
                Avvia Analisi ({selectedFiles.length} file)
              </Button>
              
              {selectedFiles.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedFiles([]);
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                >
                  Cancella
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Come funziona:</h3>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex gap-2">
            <span className="font-semibold">1.</span>
            <span>Seleziona uno o più programmi didattici in formato PDF</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">2.</span>
            <span>I file verranno elaborati in sequenza automaticamente</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">3.</span>
            <span>Potrai revisionare ogni analisi completata prima di salvarla</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold">4.</span>
            <span>I dati verranno aggregati nella Dashboard per materia/ateneo/corso</span>
          </li>
        </ol>
      </div>
    </div>
  );
};