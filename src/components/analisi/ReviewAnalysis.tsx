import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Edit2, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import type { AdozioneEstesa } from '../../types/adozione.types';

interface ReviewAnalysisProps {
  analisi: AdozioneEstesa[];
  onConfirm: (analisiModificate: AdozioneEstesa[]) => void;
  onBack: () => void;
}

const CLASSI_LAUREA = [
  'L-1 - Beni culturali',
  'L-2 - Biotecnologie',
  'L-3 - Discipline delle arti figurative, della musica, dello spettacolo e della moda',
  'L-4 - Disegno industriale',
  'L-5 - Filosofia',
  'L-6 - Geografia',
  'L-7 - Ingegneria civile e ambientale',
  'L-8 - Ingegneria dell\'informazione',
  'L-9 - Ingegneria industriale',
  'L-10 - Lettere',
  'L-11 - Lingue e culture moderne',
  'L-12 - Mediazione linguistica',
  'L-13 - Scienze biologiche',
  'L-14 - Scienze dei servizi giuridici',
  'L-15 - Scienze del turismo',
  'L-16 - Scienze dell\'amministrazione e dell\'organizzazione',
  'L-17 - Scienze dell\'architettura',
  'L-18 - Scienze dell\'economia e della gestione aziendale',
  'L-19 - Scienze dell\'educazione e della formazione',
  'L-20 - Scienze della comunicazione',
  'L-21 - Scienze della pianificazione territoriale, urbanistica, paesaggistica e ambientale',
  'L-22 - Scienze delle attività motorie e sportive',
  'L-23 - Scienze e tecniche dell\'edilizia',
  'L-24 - Scienze e tecniche psicologiche',
  'L-25 - Scienze e tecnologie agrarie e forestali',
  'L-26 - Scienze e tecnologie agro-alimentari',
  'L-27 - Scienze e tecnologie chimiche',
  'L-28 - Scienze e tecnologie della navigazione',
  'L-29 - Scienze e tecnologie farmaceutiche',
  'L-30 - Scienze e tecnologie fisiche',
  'L-31 - Scienze e tecnologie informatiche',
  'L-32 - Scienze e tecnologie per l\'ambiente e la natura',
  'L-33 - Scienze economiche',
  'L-34 - Scienze geologiche',
  'L-35 - Scienze matematiche',
  'L-36 - Scienze politiche e delle relazioni internazionali',
  'L-37 - Scienze sociali per la cooperazione, lo sviluppo e la pace',
  'L-38 - Scienze zootecniche e tecnologie delle produzioni animali',
  'L-39 - Servizio sociale',
  'L-40 - Sociologia',
  'L-41 - Statistica',
  'L-42 - Storia',
  'L-43 - Diagnostica per la conservazione dei beni culturali',
  'LM-1 - Antropologia culturale ed etnologia',
  'LM-2 - Archeologia',
  'LM-3 - Architettura del paesaggio',
  'LM-4 - Architettura e ingegneria edile-architettura',
  'LM-5 - Archivistica e biblioteconomia',
  'LM-6 - Biologia',
  'LM-7 - Biotecnologie agrarie',
  'LM-8 - Biotecnologie industriali',
  'LM-9 - Biotecnologie mediche, veterinarie e farmaceutiche',
  'LM-10 - Conservazione dei beni architettonici e ambientali',
  'LM-11 - Conservazione e restauro dei beni culturali',
  'LM-12 - Design',
  'LM-13 - Farmacia e farmacia industriale',
  'LM-14 - Filologia moderna',
  'LM-15 - Filologia, letterature e storia dell\'antichità',
  'LM-16 - Finanza',
  'LM-17 - Fisica',
  'LM-18 - Informatica',
  'LM-19 - Informazione e sistemi editoriali',
  'LM-20 - Ingegneria aerospaziale e astronautica',
  'LM-21 - Ingegneria biomedica',
  'LM-22 - Ingegneria chimica',
  'LM-23 - Ingegneria civile',
  'LM-24 - Ingegneria dei sistemi edilizi',
  'LM-25 - Ingegneria dell\'automazione',
  'LM-26 - Ingegneria della sicurezza',
  'LM-27 - Ingegneria delle telecomunicazioni',
  'LM-28 - Ingegneria elettrica',
  'LM-29 - Ingegneria elettronica',
  'LM-30 - Ingegneria energetica e nucleare',
  'LM-31 - Ingegneria gestionale',
  'LM-32 - Ingegneria informatica',
  'LM-33 - Ingegneria meccanica',
  'LM-34 - Ingegneria navale',
  'LM-35 - Ingegneria per l\'ambiente e il territorio',
  'LM-40 - Matematica',
  'LM-41 - Medicina e chirurgia',
  'LM-42 - Medicina veterinaria',
  'LM-43 - Metodologie informatiche per le discipline umanistiche',
  'LM-44 - Modellistica matematico-fisica per l\'ingegneria',
  'LM-45 - Musicologia e beni culturali',
  'LM-46 - Odontoiatria e protesi dentaria',
  'LM-47 - Organizzazione e gestione dei servizi per lo sport e le attività motorie',
  'LM-48 - Pianificazione territoriale urbanistica e ambientale',
  'LM-49 - Progettazione e gestione dei sistemi turistici',
  'LM-50 - Programmazione e gestione dei servizi educativi',
  'LM-51 - Psicologia',
  'LM-52 - Relazioni internazionali',
  'LM-53 - Scienza e ingegneria dei materiali',
  'LM-54 - Scienze chimiche',
  'LM-55 - Scienze cognitive',
  'LM-56 - Scienze dell\'economia',
  'LM-57 - Scienze dell\'educazione degli adulti e della formazione continua',
  'LM-58 - Scienze dell\'universo',
  'LM-59 - Scienze della comunicazione pubblica, d\'impresa e pubblicità',
  'LM-60 - Scienze della natura',
  'LM-61 - Scienze della nutrizione umana',
  'LM-62 - Scienze della politica',
  'LM-63 - Scienze delle pubbliche amministrazioni',
  'LM-64 - Scienze delle religioni',
  'LM-65 - Scienze dello spettacolo e produzione multimediale',
  'LM-66 - Sicurezza informatica',
  'LM-67 - Scienze e tecniche delle attività motorie preventive e adattate',
  'LM-68 - Scienze e tecniche dello sport',
  'LM-69 - Scienze e tecnologie agrarie',
  'LM-70 - Scienze e tecnologie alimentari',
  'LM-71 - Scienze e tecnologie della chimica industriale',
  'LM-72 - Scienze e tecnologie della navigazione',
  'LM-73 - Scienze e tecnologie forestali ed ambientali',
  'LM-74 - Scienze e tecnologie geologiche',
  'LM-75 - Scienze e tecnologie per l\'ambiente e il territorio',
  'LM-76 - Scienze economiche per l\'ambiente e la cultura',
  'LM-77 - Scienze economico-aziendali',
  'LM-78 - Scienze filosofiche',
  'LM-79 - Scienze geofisiche',
  'LM-80 - Scienze geografiche',
  'LM-81 - Scienze per la cooperazione allo sviluppo',
  'LM-82 - Scienze statistiche',
  'LM-83 - Scienze statistiche attuariali e finanziarie',
  'LM-84 - Scienze storiche',
  'LM-85 - Scienze pedagogiche',
  'LM-85 bis - Scienze della formazione primaria',
  'LM-86 - Scienze zootecniche e tecnologie animali',
  'LM-87 - Servizio sociale e politiche sociali',
  'LM-88 - Sociologia e ricerca sociale',
  'LM-89 - Storia dell\'arte',
  'LM-90 - Studi europei',
  'LM-91 - Tecniche e metodi per la società dell\'informazione',
  'LM-92 - Teorie della comunicazione',
  'LM-93 - Teorie e metodologie dell\'e-learning e della media education',
  'LM-94 - Traduzione specialistica e interpretariato',
  'LM-95 - Tropical and Subtropical Agriculture',
  'LMR/02 - Conservazione e restauro dei beni culturali',
  'LMCU - Conservazione e restauro dei beni culturali (ciclo unico)',
];

export const ReviewAnalysis: React.FC<ReviewAnalysisProps> = ({
  analisi,
  onConfirm,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editedAnalisi, setEditedAnalisi] = useState<AdozioneEstesa[]>([...analisi]);
  const [editingField, setEditingField] = useState<string | null>(null);

  const currentItem = editedAnalisi[currentIndex];

  const handleFieldChange = (field: keyof AdozioneEstesa, value: string) => {
    const updated = [...editedAnalisi];
    updated[currentIndex] = {
      ...updated[currentIndex],
      [field]: value,
    };
    setEditedAnalisi(updated);
  };

  const handleBookChange = (bookIndex: number, field: string, value: string) => {
    const updated = [...editedAnalisi];
    const currentBooks = [...(updated[currentIndex].bibliografia || [])];
    currentBooks[bookIndex] = {
      ...currentBooks[bookIndex],
      [field]: value,
    };
    updated[currentIndex] = {
      ...updated[currentIndex],
      bibliografia: currentBooks,
    };
    setEditedAnalisi(updated);
  };

  const handleSave = () => {
    console.log('=== CLICK CONFERMA E CONTINUA ===');
    console.log('Dati da salvare:', editedAnalisi);
    onConfirm(editedAnalisi);
  };

  const isValid = () => {
    const valid = (
      currentItem.ateneo &&
      currentItem.docente &&
      currentItem.insegnamento &&
      currentItem.materia &&
      currentItem.bibliografia &&
      currentItem.bibliografia.length > 0 &&
      currentItem.bibliografia.every(libro => libro.titolo && libro.editore)
    );
    console.log('Validazione:', valid);
    return valid;
  };

  const renderEditableField = (
    label: string,
    field: keyof AdozioneEstesa,
    value: string
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              {field === 'classeLaurea' ? (
                <select
                  value={value}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                >
                  <option value="">Seleziona classe di laurea</option>
                  {CLASSI_LAUREA.map((classe) => (
                    <option key={classe} value={classe}>
                      {classe}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={value}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="flex-1"
                  autoFocus
                />
              )}
              <Button
                onClick={() => setEditingField(null)}
                variant="primary"
                size="sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                {value || <span className="text-gray-400">Non specificato</span>}
              </div>
              <Button
                onClick={() => setEditingField(field)}
                variant="secondary"
                size="sm"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Elemento {currentIndex + 1} di {editedAnalisi.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentIndex + 1) / editedAnalisi.length) * 100)}% completato
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / editedAnalisi.length) * 100}%` }}
          />
        </div>
      </div>

      {!isValid() && (
        <Alert variant="error">
          <strong>Attenzione:</strong> Compila tutti i campi obbligatori prima di continuare.
          Assicurati che ogni libro abbia almeno Titolo ed Editore.
        </Alert>
      )}

      {isValid() && (
        <Alert variant="success">
          <CheckCircle className="w-5 h-5 inline mr-2" />
          Tutti i dati sono completi! Puoi procedere con il salvataggio.
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
          Informazioni Istituzionali
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderEditableField('Ateneo', 'ateneo', currentItem.ateneo)}
          {renderEditableField('Docente', 'docente', currentItem.docente)}
          {renderEditableField('Insegnamento', 'insegnamento', currentItem.insegnamento)}
          {renderEditableField('Corso di Laurea', 'corso', currentItem.corso)}
          {renderEditableField('Materia Standardizzata', 'materia', currentItem.materia)}
          {renderEditableField('Classe di Laurea', 'classeLaurea', currentItem.classeLaurea)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📚 Bibliografia
        </h3>

        {currentItem.bibliografia && currentItem.bibliografia.length > 0 ? (
          <div className="space-y-4">
            {currentItem.bibliografia.map((libro, bookIndex) => (
              <div
                key={bookIndex}
                className={`border rounded-lg p-4 ${
                  libro.titolo?.toLowerCase().includes('principale')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                {libro.titolo?.toLowerCase().includes('principale') && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      TESTO PRINCIPALE
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titolo *
                    </label>
                    <Input
                      value={libro.titolo || ''}
                      onChange={(e) => handleBookChange(bookIndex, 'titolo', e.target.value)}
                      placeholder="Inserisci il titolo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Autori
                    </label>
                    <Input
                      value={libro.autori || ''}
                      onChange={(e) => handleBookChange(bookIndex, 'autori', e.target.value)}
                      placeholder="Inserisci gli autori"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Editore *
                    </label>
                    <Input
                      value={libro.editore || ''}
                      onChange={(e) => handleBookChange(bookIndex, 'editore', e.target.value)}
                      placeholder="Inserisci l'editore"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="error">
            Nessun libro trovato nella bibliografia. Aggiungi almeno un libro.
          </Alert>
        )}
      </div>

      <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
        <Button
          onClick={onBack}
          variant="secondary"
        >
          ← Indietro
        </Button>

        <div className="flex items-center space-x-3">
          {currentIndex > 0 && (
            <Button
              onClick={() => setCurrentIndex(currentIndex - 1)}
              variant="secondary"
            >
              ← Elemento Precedente
            </Button>
          )}

          {currentIndex < editedAnalisi.length - 1 ? (
            <Button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              variant="primary"
              disabled={!isValid()}
            >
              Elemento Successivo →
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={!isValid()}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Conferma e Continua</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
