// src/components/analisi/ReviewAnalysis.tsx
import React, { useState } from 'react';
import { AdozioneData, TestoAdottato, CLASSI_LAUREA } from '../../types/adozione.types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AlertCircle, Save, X, Plus, Trash2, Star } from 'lucide-react';
import { Alert } from '../ui/Alert';

interface ReviewAnalysisProps {
  data: AdozioneData;
  onSave: (reviewedData: AdozioneData) => void;
  onDiscard: (analysisId: string) => void;
}

export const ReviewAnalysis: React.FC<ReviewAnalysisProps> = ({
  data,
  onSave,
  onDiscard
}) => {
  const [formData, setFormData] = useState<AdozioneData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof AdozioneData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Rimuovi errore se presente
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const updateTesto = (index: number, field: keyof TestoAdottato, value: any) => {
    const newTesti = [...formData.testiAdottati];
    newTesti[index] = { ...newTesti[index], [field]: value };
    
    // Se cambia isPrincipale, assicurati che solo uno sia principale
    if (field === 'isPrincipale' && value === true) {
      newTesti.forEach((t, i) => {
        if (i !== index) t.isPrincipale = false;
      });
      updateField('titoloPrincipale', newTesti[index].id);
    }
    
    updateField('testiAdottati', newTesti);
  };

  const addTesto = () => {
    const newTesto: TestoAdottato = {
      id: `testo_${Date.now()}`,
      titolo: '',
      autori: [''],
      editore: '',
      tipologia: 'consigliato',
      isPrincipale: false
    };
    updateField('testiAdottati', [...formData.testiAdottati, newTesto]);
  };

  const removeTesto = (index: number) => {
    const newTesti = formData.testiAdottati.filter((_, i) => i !== index);
    // Se era il principale, imposta il primo come principale
    if (formData.testiAdottati[index].isPrincipale && newTesti.length > 0) {
      newTesti[0].isPrincipale = true;
      updateField('titoloPrincipale', newTesti[0].id);
    }
    updateField('testiAdottati', newTesti);
  };

  const updateAutore = (testoIndex: number, autoreIndex: number, value: string) => {
    const newTesti = [...formData.testiAdottati];
    const newAutori = [...newTesti[testoIndex].autori];
    newAutori[autoreIndex] = value;
    newTesti[testoIndex] = { ...newTesti[testoIndex], autori: newAutori };
    updateField('testiAdottati', newTesti);
  };

  const addAutore = (testoIndex: number) => {
    const newTesti = [...formData.testiAdottati];
    newTesti[testoIndex] = {
      ...newTesti[testoIndex],
      autori: [...newTesti[testoIndex].autori, '']
    };
    updateField('testiAdottati', newTesti);
  };

  const removeAutore = (testoIndex: number, autoreIndex: number) => {
    const newTesti = [...formData.testiAdottati];
    const newAutori = newTesti[testoIndex].autori.filter((_, i) => i !== autoreIndex);
    if (newAutori.length === 0) newAutori.push(''); // Mantieni almeno un autore
    newTesti[testoIndex] = { ...newTesti[testoIndex], autori: newAutori };
    updateField('testiAdottati', newTesti);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.ateneo.trim()) newErrors.ateneo = 'Campo obbligatorio';
    if (!formData.corsoDiLaurea.trim()) newErrors.corsoDiLaurea = 'Campo obbligatorio';
    if (!formData.materiaStandardizzata.trim()) newErrors.materiaStandardizzata = 'Campo obbligatorio';
    if (!formData.docente.trim()) newErrors.docente = 'Campo obbligatorio';
    if (!formData.classeLaurea.trim()) newErrors.classeLaurea = 'Campo obbligatorio';

    if (formData.testiAdottati.length === 0) {
      newErrors.testiAdottati = 'Inserisci almeno un testo';
    }

    formData.testiAdottati.forEach((testo, index) => {
      if (!testo.titolo.trim()) {
        newErrors[`testo_${index}_titolo`] = 'Titolo obbligatorio';
      }
      if (testo.autori.every(a => !a.trim())) {
        newErrors[`testo_${index}_autori`] = 'Almeno un autore obbligatorio';
      }
      if (!testo.editore.trim()) {
        newErrors[`testo_${index}_editore`] = 'Editore obbligatorio';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      alert('Completa tutti i campi obbligatori');
      return;
    }

    // Assicurati che ci sia un titolo principale
    if (!formData.testiAdottati.some(t => t.isPrincipale) && formData.testiAdottati.length > 0) {
      formData.testiAdottati[0].isPrincipale = true;
      formData.titoloPrincipale = formData.testiAdottati[0].id;
    }

    const reviewedData: AdozioneData = {
      ...formData,
      statoRevisione: 'revisionato',
      timestamp: Date.now()
    };

    onSave(reviewedData);
  };

  const handleDiscard = () => {
    if (confirm('Scartare questa analisi? I dati non verranno salvati.')) {
      onDiscard(formData.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Revisione Analisi
        </h2>
        <p className="text-gray-600">
          Verifica e correggi i dati estratti automaticamente dal programma didattico
        </p>
        <p className="text-sm text-gray-500 mt-1">
          File: {formData.nomeFile}
        </p>
      </div>

      <Alert variant="info" className="mb-6">
        <AlertCircle className="w-4 h-4" />
        <div>
          <div className="font-semibold">Attenzione ai dettagli</div>
          <div className="text-sm mt-1">
            Verifica in particolare la <strong>materia standardizzata</strong> (deve essere specifica, 
            es. "Chimica Organica" non "Chimica") e la <strong>classe di laurea</strong>
          </div>
        </div>
      </Alert>

      <div className="space-y-6">
        {/* Dati Istituzionali */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dati Istituzionali
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ateneo *
                </label>
                <Input
                  value={formData.ateneo}
                  onChange={(e) => updateField('ateneo', e.target.value)}
                  error={errors.ateneo}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facoltà
                </label>
                <Input
                  value={formData.facolta}
                  onChange={(e) => updateField('facolta', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dipartimento
                </label>
                <Input
                  value={formData.dipartimento}
                  onChange={(e) => updateField('dipartimento', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corso di Laurea *
                </label>
                <Input
                  value={formData.corsoDiLaurea}
                  onChange={(e) => updateField('corsoDiLaurea', e.target.value)}
                  error={errors.corsoDiLaurea}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classe di Laurea *
                </label>
                <select
                  value={formData.classeLaurea}
                  onChange={(e) => {
                    const classe = CLASSI_LAUREA.find(c => c.codice === e.target.value);
                    updateField('classeLaurea', e.target.value);
                    if (classe) {
                      updateField('classeLaureaDescrizione', classe.nome);
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.classeLaurea ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleziona classe di laurea</option>
                  {CLASSI_LAUREA.map(classe => (
                    <option key={classe.codice} value={classe.codice}>
                      {classe.codice} - {classe.nome}
                    </option>
                  ))}
                </select>
                {errors.classeLaurea && (
                  <p className="text-red-600 text-sm mt-1">{errors.classeLaurea}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anno Accademico
                </label>
                <Input
                  value={formData.annoAccademico}
                  onChange={(e) => updateField('annoAccademico', e.target.value)}
                  placeholder="2024/2025"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Dati Insegnamento */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dati Insegnamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Materia Standardizzata * 
                  <span className="text-xs text-gray-500 ml-2">
                    (Deve essere specifica: es. "Chimica Organica", "Biologia Molecolare")
                  </span>
                </label>
                <Input
                  value={formData.materiaStandardizzata}
                  onChange={(e) => updateField('materiaStandardizzata', e.target.value)}
                  error={errors.materiaStandardizzata}
                  placeholder="es. Chimica Organica"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Insegnamento (dal programma)
                </label>
                <Input
                  value={formData.nomeInsegnamento}
                  onChange={(e) => updateField('nomeInsegnamento', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CFU
                </label>
                <Input
                  type="number"
                  value={formData.cfu}
                  onChange={(e) => updateField('cfu', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSD (Settore Scientifico Disciplinare)
                </label>
                <Input
                  value={formData.ssd}
                  onChange={(e) => updateField('ssd', e.target.value)}
                  placeholder="es. BIO/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semestre
                </label>
                <select
                  value={formData.semestre}
                  onChange={(e) => updateField('semestre', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleziona</option>
                  <option value="1">Primo</option>
                  <option value="2">Secondo</option>
                  <option value="Annuale">Annuale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Docente *
                </label>
                <Input
                  value={formData.docente}
                  onChange={(e) => updateField('docente', e.target.value)}
                  error={errors.docente}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Docente
                </label>
                <Input
                  type="email"
                  value={formData.emailDocente || ''}
                  onChange={(e) => updateField('emailDocente', e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Testi Adottati */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Testi Adottati
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addTesto}
              >
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Testo
              </Button>
            </div>

            {errors.testiAdottati && (
              <Alert variant="error" className="mb-4">
                <AlertCircle className="w-4 h-4" />
                <div>{errors.testiAdottati}</div>
              </Alert>
            )}

            <div className="space-y-4">
              {formData.testiAdottati.map((testo, testoIndex) => (
                <div
                  key={testo.id}
                  className={`p-4 border-2 rounded-lg ${
                    testo.isPrincipale
                      ? 'border-yellow-300 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {testo.isPrincipale && (
                        <Star className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className="font-medium text-gray-900">
                        Testo {testoIndex + 1}
                        {testo.isPrincipale && ' (Principale)'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {!testo.isPrincipale && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTesto(testoIndex, 'isPrincipale', true)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Imposta come Principale
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTesto(testoIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titolo *
                      </label>
                      <Input
                        value={testo.titolo}
                        onChange={(e) => updateTesto(testoIndex, 'titolo', e.target.value)}
                        error={errors[`testo_${testoIndex}_titolo`]}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Autori *
                      </label>
                      <div className="space-y-2">
                        {testo.autori.map((autore, autoreIndex) => (
                          <div key={autoreIndex} className="flex gap-2">
                            <Input
                              value={autore}
                              onChange={(e) => updateAutore(testoIndex, autoreIndex, e.target.value)}
                              placeholder="Nome Cognome"
                              className="flex-1"
                            />
                            {testo.autori.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeAutore(testoIndex, autoreIndex)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addAutore(testoIndex)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Aggiungi Autore
                        </Button>
                      </div>
                      {errors[`testo_${testoIndex}_autori`] && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors[`testo_${testoIndex}_autori`]}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Editore *
                      </label>
                      <Input
                        value={testo.editore}
                        onChange={(e) => updateTesto(testoIndex, 'editore', e.target.value)}
                        error={errors[`testo_${testoIndex}_editore`]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Anno
                      </label>
                      <Input
                        type="number"
                        value={testo.anno || ''}
                        onChange={(e) => updateTesto(testoIndex, 'anno', parseInt(e.target.value) || undefined)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ISBN
                      </label>
                      <Input
                        value={testo.isbn || ''}
                        onChange={(e) => updateTesto(testoIndex, 'isbn', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Edizione
                      </label>
                      <Input
                        value={testo.edizione || ''}
                        onChange={(e) => updateTesto(testoIndex, 'edizione', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipologia
                      </label>
                      <select
                        value={testo.tipologia}
                        onChange={(e) => updateTesto(testoIndex, 'tipologia', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="principale">Principale</option>
                        <option value="consigliato">Consigliato</option>
                        <option value="riferimento">Riferimento</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note
                      </label>
                      <textarea
                        value={testo.note || ''}
                        onChange={(e) => updateTesto(testoIndex, 'note', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Note Generali */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Note Generali
            </h3>
            <textarea
              value={formData.note || ''}
              onChange={(e) => updateField('note', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Eventuali note o osservazioni..."
            />
          </div>
        </Card>

        {/* Azioni */}
        <div className="flex gap-4 justify-end sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <Button
            variant="outline"
            onClick={handleDiscard}
          >
            <X className="w-4 h-4 mr-2" />
            Scarta Analisi
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salva e Continua
          </Button>
        </div>
      </div>
    </div>
  );
};