import { useSettingsStore } from '../stores/settings.store';
import type { AdozioneEstesa } from '../types/adozione.types';

export class OpenAIService {
  private apiKey: string;
  private model: string;

  constructor() {
    const settings = useSettingsStore.getState();
    this.apiKey = settings.apiKey;
    this.model = settings.model;

    console.log('OpenAIService inizializzato');
    console.log('API Key presente:', !!this.apiKey);
    console.log('Modello:', this.model);

    if (!this.apiKey) {
      throw new Error('API Key OpenAI non configurata. Vai in Impostazioni per configurarla.');
    }
  }

  async analyzeAdozioni(testoCompleto: string): Promise<AdozioneEstesa[]> {
    console.log('Inizio analisi con OpenAI');
    console.log('Lunghezza testo:', testoCompleto.length);

    const prompt = `Analizza questo testo estratto da un programma universitario e estrai le seguenti informazioni in formato JSON:

TESTO DA ANALIZZARE:
${testoCompleto}

Estrai e restituisci SOLO un array JSON con questa struttura (senza altri testi o spiegazioni):

[
  {
    "ateneo": "nome dell'università",
    "docente": "nome del docente",
    "insegnamento": "nome dell'insegnamento/corso",
    "corso": "nome del corso di laurea",
    "materia": "materia standardizzata (es: Biologia, Chimica, Fisica, ecc.)",
    "classeLaurea": "classe di laurea (es: L-13, LM-6, ecc.)",
    "bibliografia": [
      {
        "titolo": "titolo del libro",
        "autori": "autori del libro",
        "editore": "casa editrice",
        "tipo": "principale o consigliato"
      }
    ]
  }
]

IMPORTANTE:
- Restituisci SOLO l'array JSON, senza markdown o altri testi
- Se un campo non è presente, usa stringa vuota ""
- La materia deve essere standardizzata (es: "Chimica Organica" diventa "Chimica")
- Identifica il testo principale come tipo "principale", gli altri come "consigliato"
- Se ci sono più docenti/insegnamenti, crea elementi separati nell'array`;

    try {
      console.log('Invio richiesta a OpenAI...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Sei un assistente specializzato nell\'analisi di programmi universitari. Rispondi SOLO con JSON valido, senza markdown o altri testi.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      console.log('Risposta ricevuta, status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Errore API OpenAI:', errorData);
        
        if (response.status === 401) {
          throw new Error('API Key OpenAI non valida. Verifica la chiave nelle Impostazioni.');
        }
        if (response.status === 429) {
          throw new Error('Limite di richieste raggiunto. Riprova tra qualche minuto.');
        }
        throw new Error(`Errore OpenAI (${response.status}): ${errorData.error?.message || 'Errore sconosciuto'}`);
      }

      const data = await response.json();
      console.log('Risposta OpenAI completa:', data);

      const content = data.choices[0]?.message?.content || '';
      console.log('Contenuto estratto:', content);

      // Pulisci il contenuto da eventuali markdown
      let cleanedContent = content.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/```\n?/g, '');
      }

      console.log('Contenuto pulito:', cleanedContent);

      const parsed = JSON.parse(cleanedContent);
      console.log('JSON parsato:', parsed);

      // Assicurati che sia un array
      const result = Array.isArray(parsed) ? parsed : [parsed];
      
      console.log('Risultato finale:', result);
      return result;

    } catch (error) {
      console.error('Errore durante l\'analisi OpenAI:', error);
      
      if (error instanceof SyntaxError) {
        throw new Error('Risposta OpenAI non valida. Riprova con un PDF più chiaro.');
      }
      
      throw error;
    }
  }
}
