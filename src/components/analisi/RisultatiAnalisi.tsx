import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Edit2, RotateCcw, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import type { AnalisiAdozione, Adozione } from '../../types/adozione.types';

interface RisultatiAnalisiProps {
  analisi: Partial<AnalisiAdozione>;
  onSalva: () => void;
  onRianalizza: () => void;
  onModifica: (campo: string, valore: any) => void;
}

export const RisultatiAnalisi: React.FC<RisultatiAnalisiProps> = ({
  analisi,
  onSalva,
  onRianalizza,
  onModifica
}) => {
  const getStatusAlert = () => {
    const status = analisi.analisiCompetitiva?.statusAdozione;
    
    if (status === 'zanichelli-principale') {
      return (
        <Alert type="success" className="mb-6">
          <div className="font-semibold text-lg">✓ ADOZIONE ZANICHELLI RILEVATA!</div>
          <p className="mt-1">Il testo principale adottato è edito da Zanichelli.</p>
        </Alert>
      );
    } else if (status === 'zanichelli-secondario') {
      return (
        <Alert type="warning" className="mb-6">
          <div className="font-semibold text-lg">⚠ Presenza Zanichelli Secondaria</div>
          <p className="mt-1">Zanichelli è presente tra i testi consigliati ma non come testo principale.</p>
        </Alert>
      );
    } else {
      const editore = analisi.adozioni?.testoPrincipale?.editore || 'Competitor';
      return (
        <Alert type="error" className="mb-6">
          <div className="font-semibold text-lg">⚠ Adozione Competitor: {editore}</div>
          <p className="mt-1">Il testo principale non è edito da Zanichelli.</p>
        </Alert>
      );
    }
  };

  const renderLibro = (libro: Adozione, isPrincipale: boolean) => (
    <div className={`border rounded-lg p-4 ${isPrincipale ? 'border-zanichelli-red border-2' : 'border-gray-200'}`}>
      {isPrincipale && (
        <span className="inline-block bg-zanichelli-red text-white text-xs font-bold px-2 py-1 rounded mb-2">
          TESTO PRINCIPALE
        </span>
      )}
      
      <h4 className="font-semibold text-gray-900 text-lg mb-1">{libro.titolo}</h4>
      
      {libro.sottotitolo && (
        <p className="text-sm text-gray-600 mb-2">{libro.sottotitolo}</p>
      )}
      
      <p className="text-sm text-gray-700 mb-2">
        {libro.autori.join(', ')}
      </p>
      
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          libro.isZanichelli 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {libro.editore}
        </span>
        {libro.isZanichelli && (
          <CheckCircle className="w-4 h-4 text-green-600" />
        )}
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        {libro.anno && <div>Anno: {libro.anno}</div>}
        {libro.isbn && <div>ISBN: {libro.isbn}</div>}
        {libro.edizione && <div>Edizione: {libro.edizione}</div>}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Risultati Analisi</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onRianalizza} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Rianalizza
          </Button>
          <Button onClick={onSalva} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salva in Cronologia
          </Button>
        </div>
      </div>

      {getStatusAlert()}

      {/* Informazioni Istituzionali */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📚 Informazioni Istituzionali
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ateneo</label>
            <p className="text-gray-900 font-medium">{analisi.ateneo}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Docente</label>
            <p className="text-gray-900 font-medium">{analisi.docente}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Insegnamento</label>
            <p className="text-gray-900 font-medium">{analisi.insegnamento}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Corso di Laurea</label>
            <p className="text-gray-900 font-medium">{analisi.corsoDiLaurea}</p>
          </div>
        </div>

        {analisi.emailDocente && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Docente</label>
            <a href={`mailto:${analisi.emailDocente}`} className="text-zanichelli-red hover:underline">
              {analisi.emailDocente}
            </a>
          </div>
        )}
      </Card>

      {/* Classificazione */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏷️ Classificazione</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Materia Standardizzata</label>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {analisi.materiaStandardizzata}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Classe di Laurea</label>
            <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {analisi.classeLaureaMinisteriale}
            </span>
          </div>
          
          {analisi.cfu && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">CFU</label>
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {analisi.cfu} CFU
              </span>
            </div>
          )}
        </div>

        {analisi.ssd && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">SSD</label>
            <p className="text-gray-900">{analisi.ssd}</p>
          </div>
        )}
      </Card>

      {/* Bibliografia */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Bibliografia</h3>
        
        <div className="space-y-4">
          {analisi.adozioni?.testoPrincipale && renderLibro(analisi.adozioni.testoPrincipale, true)}
          
          {analisi.adozioni?.testiConsigliati && analisi.adozioni.testiConsigliati.length > 0 && (
            <>
              <h4 className="font-semibold text-gray-700 mt-6 mb-3">Altri Testi:</h4>
              {analisi.adozioni.testiConsigliati.map((libro, index) => (
                <div key={index}>{renderLibro(libro, false)}</div>
              ))}
            </>
          )}
        </div>
      </Card>

      {/* Analisi Competitiva */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Analisi Competitiva</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {analisi.analisiCompetitiva?.totaleTestiAdottati || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Totale Testi</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {analisi.analisiCompetitiva?.numeroTestiZanichelli || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Zanichelli</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {analisi.analisiCompetitiva?.numeroTestiCompetitor || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Competitor</p>
          </div>
          
          <div className="text-center p-4 bg-zanichelli-red/10 rounded-lg">
            <p className="text-2xl font-bold text-zanichelli-red">
              {analisi.analisiCompetitiva?.percentualeZanichelli || 0}%
            </p>
            <p className="text-sm text-gray-600 mt-1">% Zanichelli</p>
          </div>
        </div>

        {analisi.analisiCompetitiva?.editoriCompetitor && 
         analisi.analisiCompetitiva.editoriCompetitor.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Editori Competitor presenti:</p>
            <div className="flex flex-wrap gap-2">
              {analisi.analisiCompetitiva.editoriCompetitor.map((editore, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {editore}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
