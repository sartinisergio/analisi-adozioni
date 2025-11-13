export type QueueStatus = 'pending' | 'analyzing' | 'reviewing' | 'completed' | 'error';

export interface QueueItem {
  id: string;
  fileName?: string;
  fileContent?: string;
  content?: string; // alias per compatibilità
  type: 'pdf' | 'text';
  status: QueueStatus;
  error?: string;
  result?: any;
  addedAt: Date;
}

export interface AnalysisQueue {
  items: QueueItem[];
  totalItems: number;
  completedItems: number;
  processingItem: string | null;
}
