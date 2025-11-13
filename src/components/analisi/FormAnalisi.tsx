import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { PDFService } from '../../services/pdf.service';
import { OpenAIService } from '../../services/openai.service';
import { StorageService } from '../../services/storage.service';
import { ReviewAnalysis } from './ReviewAnalysis';
import type { AdozioneEstesa } from '../../types/adozione.types';

type Step = 'upload' | 'analyzing' | 'review' | 'success';

export const FormAnalisi: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [analisiResult, setAnalisiResult] = useState<AdozioneEstesa[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError(null);
    } else {
      setError('Seleziona un file PDF valido');
    }
  };

  const handleAnalyze = async () => {
    if (!pdfFile) {
      setError('Seleziona prima un file PDF');
      return;
    }

    setCurrentStep('analyzing');
    setError(null);

    try {
      const pdfService = new PDFService();
      const text = await pdfService.extractText(pdfFile);

      const openAIService = new OpenAIService();
      const result = await openAIService.analyzeAdozioni(text);

      setAnalisiResult(result);
      setCurrentStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante l\'analisi');
      setCurrentStep('upload');
    }
  };

  const handleConfirmAnalysis = (analisiModificate: AdozioneEstesa[]) => {
    try {
      console.log('Salvataggio con LocalStorage...');
      let savedCount = 0;
      
      for (const item of analisiModificate) {
        if (item.bibliografia && item.bibliografia.length > 0) {
          for (const libro of item.bibliografia) {
            StorageService.save({
              ateneo: item.ateneo || '',
              classeLaurea: item.classeLaurea || '',
              corso: item.corso || '',
              docente: item.docente || '',
              materia: item.materia || '',
              insegnamento: item.insegnamento || '',
              titolo: libro.titolo || '',
              autore: libro.autori || '',
              editore: libro.editore || '',
              dataAnalisi: new Date().toISOString(),
              pdfFileName: pdfFile?.name || '',
            });
            savedCount++;
          }
        }
      }

      console.log(`Salvate ${savedCount} adozioni!`);
      setSuccessMessage(`✓ Salvate ${savedCount} adozioni!`);
      setCurrentStep('success');
      
      setTimeout(() => {
        setPdfFile(null);
        setAnalisiResult(null);
        setCurrentStep('upload');
        setError(null);
        setSuccessMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Errore salvataggio:', error);
      setError('Errore durante il salvataggio');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {currentStep === 'upload' && (
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Prepara Analisi Batch</h2>
            <p className="text-gray-600">Carica un file PDF di programma universitario</p>
          </div>

          {error && <Alert variant="error" className="mb-6">{error}</Alert>}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Carica File PDF</h3>
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              id="pdf-upload"
            />
            
            <label htmlFor="pdf-upload">
              <Button as="span" className="cursor-pointer">Seleziona File PDF</Button>
            </label>

            {pdfFile && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 inline mr-2" />
                <span className="text-blue-800 font-medium">{pdfFile.name}</span>
              </div>
            )}
          </div>

          {pdfFile && (
            <div className="mt-6 flex justify-center">
              <Button onClick={handleAnalyze} size="lg">Avvia Analisi</Button>
            </div>
          )}
        </Card>
      )}

      {currentStep === 'analyzing' && (
        <Card className="p-12 text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Analisi in corso...</h3>
          <p className="text-gray-600">Elaborazione con AI in corso...</p>
        </Card>
      )}

      {currentStep === 'review' && analisiResult && (
        <ReviewAnalysis
          analisi={analisiResult}
          onConfirm={handleConfirmAnalysis}
          onBack={() => setCurrentStep('upload')}
        />
      )}

      {currentStep === 'success' && (
        <Card className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Completato!</h3>
          <p className="text-gray-600">{successMessage}</p>
        </Card>
      )}
    </div>
  );
};
