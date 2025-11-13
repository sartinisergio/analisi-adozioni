// src/services/openai.service.ts
import OpenAI from 'openai';
import { AdozioneData, CLASSI_LAUREA, TestoAdottato } from '../types/adozione.types';

let openaiClient: OpenAI | null = null;

export function initializeOpenAI(apiKey: string): void {
  openaiClient = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
}

export function isOpenAIInitialized(): boolean {
  return openaiClient !== null;
}

function buildEnhancedPrompt(pdfText: string): string {
  const classiInfo = CLASSI_LAUREA.map(c => 
    `- ${c.codice}: ${c.nome} - ${c.descrizione}`
  ).join('\n');

  return `Sei un esperto analista di programmi didattici universitari per la casa editrice Zanichelli.

CLASSI DI LAUREA MINISTERIALI DISPONIBILI:
${classiInfo}

COMPITO:
Analizza il seguente programma didattico universitario ed estrai TUTTE le informazioni richieste con MASSIMA PRECISIONE.

REGOLE CRITICHE PER L'ESTRAZIONE:

1. MATERIA STANDARDIZZATA:
   - Identifica la materia SPECIFICA, NON generica
   - CORRETTO: "Chimica Organica", "Chimica Generale", "Chimica Fisica"
   - ERRATO: "Chimica" (troppo generico)
   - CORRETTO: "Biologia Molecolare", "Biologia Cellulare"
   - ERRATO: "Biologia" (troppo generico)
   - Usa la nomenclatura standard del settore scientifico-disciplinare

2. CLASSE DI LAUREA:
   - Identifica il codice esatto (es: L-13, LM-6)
   - Se trovi il codice, usa la descrizione completa dalla lista sopra
   - Se non trovi il codice ma riconosci il corso, deducilo dalla descrizione
   - Esempio: "Scienze Biologiche triennale" → L-13

3. TESTI ADOTTATI:
   - Elenca TUTTI i testi nell'ORDINE in cui appaiono
   - Il PRIMO testo della lista è SEMPRE il principale (isPrincipale: true)
   - Distingui tra: principale, consigliato, riferimento
   - Estrai ISBN quando disponibile

4. DATI DOCENTE:
   - Nome completo del docente
   - Email se presente

TESTO DEL PROGRAMMA:
${pdfText}

RISPOSTA RICHIESTA IN FORMATO JSON:
{
  "ateneo": "nome completo università",
  "facolta": "nome facoltà",
  "dipartimento": "nome dipartimento",
  "corsoDiLaurea": "nome completo corso",
  "classeLaurea": "codice (es: L-13)",
  "classeLaureaDescrizione": "nome completo dalla lista",
  "materiaStandardizzata": "nome SPECIFICO materia (es: Chimica Organica)",
  "nomeInsegnamento": "nome esatto insegnamento dal programma",
  "annoAccademico": "YYYY/YYYY",
  "semestre": "1 o 2 o Annuale",
  "cfu": numero,
  "ssd": "codice settore (es: BIO/10)",
  "docente": "Nome Cognome",
  "emailDocente": "email se disponibile",
  "testiAdottati": [
    {
      "titolo": "titolo completo",
      "autori": ["Autore1", "Autore2"],
      "editore": "nome editore",
      "anno": anno,
      "isbn": "codice isbn",
      "edizione": "numero edizione",
      "tipologia": "principale o consigliato o riferimento",
      "isPrincipale": true per il PRIMO della lista,
      "note": "eventuali note"
    }
  ]
}

Rispondi SOLO con il JSON, senza testo aggiuntivo.`;
}

export async function analyzePDF(
  pdfText: string,
  fileName: string
): Promise<AdozioneData> {
  if (!openaiClient) {
    throw new Error('OpenAI non inizializzato. Configura la API key nelle impostazioni.');
  }

  try {
    const prompt = buildEnhancedPrompt(pdfText);

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sei un assistente specializzato nell\'analisi di programmi didattici universitari. Rispondi sempre e solo con JSON valido, senza markdown o testo aggiuntivo.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Risposta vuota da OpenAI');
    }

    const cleanedContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsedData = JSON.parse(cleanedContent);

    if (parsedData.testiAdottati && parsedData.testiAdottati.length > 0) {
      parsedData.testiAdottati[0].isPrincipale = true;
      parsedData.testiAdottati[0].tipologia = 'principale';
      
      parsedData.testiAdottati = parsedData.testiAdottati.map((testo: any, index: number) => ({
        ...testo,
        id: `testo_${Date.now()}_${index}`,
        isPrincipale: index === 0
      }));

      parsedData.titoloPrincipale = parsedData.testiAdottati[0].id;
    }

    const adozioneData: AdozioneData = {
      id: `analisi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      nomeFile: fileName,
      ...parsedData,
      statoRevisione: 'da_revisionare'
    };

    return adozioneData;

  } catch (error) {
    console.error('Errore analisi OpenAI:', error);
    if (error instanceof Error) {
      throw new Error(`Errore nell'analisi: ${error.message}`);
    }
    throw new Error('Errore sconosciuto nell\'analisi del PDF');
  }
}
