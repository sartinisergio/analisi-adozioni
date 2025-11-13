export interface AdozioneRecord {
  id: string;
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

const STORAGE_KEY = 'zanichelli_adozioni';

export class StorageService {
  static save(record: Omit<AdozioneRecord, 'id'>): void {
    const records = this.getAll();
    const newRecord: AdozioneRecord = {
      ...record,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    records.push(newRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  static getAll(): AdozioneRecord[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static export(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }

  static import(jsonData: string, mode: 'overwrite' | 'append'): void {
    const newData: AdozioneRecord[] = JSON.parse(jsonData);
    
    if (mode === 'overwrite') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } else {
      const existing = this.getAll();
      const combined = [...existing, ...newData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    }
  }
}
