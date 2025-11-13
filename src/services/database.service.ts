import Dexie from 'dexie';

export interface CronologiaRecord {
  id?: number;
  ateneo: string;
  classeLaurea: string;
  corso: string;
  docente: string;
  materia: string;
  insegnamento: string;
  titolo: string;
  autore: string;
  editore: string;
  dataAnalisi: string;
  pdfFileName: string;
}

const db = new Dexie('ZanichelliAdozioniDB');

db.version(1).stores({
  cronologia: '++id, ateneo, docente, materia, editore, dataAnalisi'
});

export const database = db;
export const cronologiaTable = db.table<CronologiaRecord>('cronologia');
