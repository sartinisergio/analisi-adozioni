// src/services/storage.service.ts
import { AdozioneData } from '../types/adozione.types';

const STORAGE_KEY = 'zanichelli_analisi_adozioni';

class StorageService {
  async saveAnalysis(data: AdozioneData): Promise<void> {
    try {
      const existing = await this.getAllAnalyses();
      const index = existing.findIndex(a => a.id === data.id);
      
      if (index >= 0) {
        existing[index] = data;
      } else {
        existing.push(data);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      throw new Error('Impossibile salvare l\'analisi');
    }
  }

  async getAllAnalyses(): Promise<AdozioneData[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Errore nel caricamento:', error);
      return [];
    }
  }

  async getAnalysisById(id: string): Promise<AdozioneData | null> {
    try {
      const analyses = await this.getAllAnalyses();
      return analyses.find(a => a.id === id) || null;
    } catch (error) {
      console.error('Errore nel recupero analisi:', error);
      return null;
    }
  }

  async deleteAnalysis(id: string): Promise<void> {
    try {
      const existing = await this.getAllAnalyses();
      const filtered = existing.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Errore nella cancellazione:', error);
      throw new Error('Impossibile cancellare l\'analisi');
    }
  }

  async clearAllAnalyses(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Errore nella cancellazione totale:', error);
      throw new Error('Impossibile cancellare tutte le analisi');
    }
  }

  async exportToJSON(): Promise<string> {
    const analyses = await this.getAllAnalyses();
    return JSON.stringify(analyses, null, 2);
  }

  async importFromJSON(jsonString: string): Promise<number> {
    try {
      const imported = JSON.parse(jsonString);
      if (!Array.isArray(imported)) {
        throw new Error('Formato non valido');
      }

      const existing = await this.getAllAnalyses();
      const merged = [...existing];

      imported.forEach((item: AdozioneData) => {
        const index = merged.findIndex(a => a.id === item.id);
        if (index >= 0) {
          merged[index] = item;
        } else {
          merged.push(item);
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return imported.length;
    } catch (error) {
      console.error('Errore nell\'import:', error);
      throw new Error('Impossibile importare i dati');
    }
  }
}

export const storageService = new StorageService();
