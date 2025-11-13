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
