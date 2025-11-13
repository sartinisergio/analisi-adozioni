// src/types/adozione.types.ts

export interface ClasseLaurea {
  codice: string;
  nome: string;
  descrizione: string;
}

export const CLASSI_LAUREA: ClasseLaurea[] = [
  {
    codice: "L-13",
    nome: "Scienze biologiche",
    descrizione: "Corso di laurea triennale in Scienze biologiche che prepara laureati con conoscenze di base dei principali settori delle scienze biologiche e competenze metodologiche e tecnologiche multidisciplinari per attività professionali e di ricerca in ambito biologico."
  },
  {
    codice: "L-2",
    nome: "Biotecnologie",
    descrizione: "Corso di laurea triennale in Biotecnologie finalizzato alla formazione di laureati con competenze integrate di base nei diversi settori delle biotecnologie, con particolare riferimento agli aspetti cellulari e molecolari."
  },
  {
    codice: "L-27",
    nome: "Scienze e tecnologie chimiche",
    descrizione: "Corso di laurea triennale in Scienze e tecnologie chimiche che forma laureati con adeguate conoscenze di base dei diversi settori della chimica e competenze nelle metodiche disciplinari di indagine."
  },
  {
    codice: "LM-6",
    nome: "Biologia",
    descrizione: "Corso di laurea magistrale in Biologia che forma laureati con elevata preparazione scientifica ed operativa nelle discipline che caratterizzano la classe, con approfondimenti negli aspetti applicativi e strumentali."
  },
  {
    codice: "LM-8",
    nome: "Biotecnologie industriali",
    descrizione: "Corso di laurea magistrale in Biotecnologie industriali per formare laureati con competenze avanzate nelle biotecnologie applicate ai settori industriali."
  },
  {
    codice: "LM-9",
    nome: "Biotecnologie mediche, veterinarie e farmaceutiche",
    descrizione: "Corso di laurea magistrale che forma laureati con competenze avanzate nelle biotecnologie applicate in ambito medico, veterinario e farmaceutico."
  },
  {
    codice: "LM-54",
    nome: "Scienze chimiche",
    descrizione: "Corso di laurea magistrale in Scienze chimiche per formare laureati con elevata preparazione scientifica ed operativa nelle discipline chimiche."
  }
];

export interface TestoAdottato {
  id: string;
  titolo: string;
  autori: string[];
  editore: string;
  anno?: number;
  isbn?: string;
  edizione?: string;
  tipologia: 'principale' | 'consigliato' | 'riferimento';
  isPrincipale: boolean;
  note?: string;
}

export interface AdozioneData {
  id: string;
  timestamp: number;
  nomeFile: string;
  
  // Dati istituzionali
  ateneo: string;
  facolta: string;
  dipartimento: string;
  corsoDiLaurea: string;
  classeLaurea: string;
  classeLaureaDescrizione: string;
  
  // Dati insegnamento
  materiaStandardizzata: string;
  nomeInsegnamento: string;
  annoAccademico: string;
  semestre: string;
  cfu: number;
  ssd: string;
  
  // Docenza
  docente: string;
  emailDocente?: string;
  
  // Testi adottati
  testiAdottati: TestoAdottato[];
  titoloPrincipale?: string;
  
  // Metadati analisi
  statoRevisione: 'da_revisionare' | 'revisionato' | 'approvato';
  note?: string;
}

export interface QueueItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  result?: AdozioneData;
}

export interface AnalisiGroup {
  chiave: string;
  ateneo: string;
  classeLaurea: string;
  materiaStandardizzata: string;
  corsoDiLaurea: string;
  docente: string;
  annoAccademico: string;
  testiAdottati: TestoAdottato[];
  titoloPrincipale?: TestoAdottato;
  numeroAnalisi: number;
  analisiIds: string[];
}

// Mantieni le vecchie interfacce per compatibilità (opzionale)
export interface Adozione {
  titolo: string;
  sottotitolo?: string;
  autori: string[];
  editore: string;
  anno?: number;
  isbn?: string;
  edizione?: string;
  url?: string;
  isZanichelli: boolean;
  isPrincipale: boolean;
  isConsigliato: boolean;
  prezzo?: number;
}

export interface AnalisiCompetitiva {
  totaleTestiAdottati: number;
  numeroTestiZanichelli: number;
  numeroTestiCompetitor: number;
  percentualeZanichelli: number;
  editoriCompetitor: string[];
  statusAdozione: 'zanichelli-principale' | 'zanichelli-secondario' | 'competitor' | 'nessun-zanichelli';
}

export interface Opportunita {
  tipo: 'conversione' | 'upgrade' | 'mantenimento';
  priorita: 'alta' | 'media' | 'bassa';
  azioniSuggerite: string[];
}

export interface AnalisiAdozione {
  id: string;
  timestamp: Date;
  testoOriginale: string;
  nomeFile?: string;
  
  ateneo: string;
  regione?: string;
  docente: string;
  emailDocente?: string;
  insegnamento: string;
  corsoDiLaurea: string;
  
  materiaStandardizzata: string;
  classeLaureaMinisteriale: string;
  annoCorso?: number;
  semestre?: string;
  cfu?: number;
  ssd?: string;
  
  adozioni: {
    testoPrincipale: Adozione;
    testiConsigliati: Adozione[];
  };
  
  analisiCompetitiva: AnalisiCompetitiva;
  
  note?: string;
  opportunita?: Opportunita;
  
  modificatoManualmente: boolean;
  ultimaModifica: Date;
  numeroRianalisi: number;
}
