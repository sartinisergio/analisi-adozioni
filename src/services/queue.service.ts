// src/services/queue.service.ts
import { QueueItem } from '../types/adozione.types';
import { analyzePDF } from './openai.service';
import { extractTextFromPDF } from './pdf.service';

class QueueService {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private listeners: Set<(queue: QueueItem[]) => void> = new Set();

  addToQueue(files: File[]): void {
    const newItems: QueueItem[] = files.map(file => ({
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending',
      progress: 0
    }));

    this.queue.push(...newItems);
    this.notifyListeners();
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  subscribe(listener: (queue: QueueItem[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.queue]));
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const item = this.queue.find(i => i.status === 'pending');
      if (!item) break;

      try {
        item.status = 'processing';
        item.progress = 10;
        this.notifyListeners();

        // Estrazione testo PDF
        const pdfText = await extractTextFromPDF(item.file);
        item.progress = 40;
        this.notifyListeners();

        // Analisi con OpenAI
        const result = await analyzePDF(pdfText, item.file.name);
        item.progress = 90;
        this.notifyListeners();

        item.result = result;
        item.status = 'completed';
        item.progress = 100;
        
      } catch (error) {
        item.status = 'error';
        item.error = error instanceof Error ? error.message : 'Errore sconosciuto';
        item.progress = 0;
      }

      this.notifyListeners();
      
      // Piccola pausa tra le richieste per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.isProcessing = false;
  }

  getQueue(): QueueItem[] {
    return [...this.queue];
  }

  removeCompleted(): void {
    this.queue = this.queue.filter(item => 
      item.status !== 'completed' && item.status !== 'error'
    );
    this.notifyListeners();
  }

  clearQueue(): void {
    this.queue = [];
    this.isProcessing = false;
    this.notifyListeners();
  }

  retryFailed(): void {
    this.queue.forEach(item => {
      if (item.status === 'error') {
        item.status = 'pending';
        item.progress = 0;
        item.error = undefined;
      }
    });
    this.notifyListeners();
    this.processQueue();
  }
}

export const queueService = new QueueService();