// src/components/analisi/QueueViewer.tsx
import React from 'react';
import { QueueItem } from '../../types/adozione.types';
import { CheckCircle2, XCircle, Loader2, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QueueViewerProps {
  queue: QueueItem[];
  onRetryFailed: () => void;
  onClearCompleted: () => void;
}

export const QueueViewer: React.FC<QueueViewerProps> = ({
  queue,
  onRetryFailed,
  onClearCompleted
}) => {
  const pending = queue.filter(i => i.status === 'pending').length;
  const processing = queue.filter(i => i.status === 'processing').length;
  const completed = queue.filter(i => i.status === 'completed').length;
  const failed = queue.filter(i => i.status === 'error').length;

  if (queue.length === 0) return null;

  return (
    <Card className="mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Coda di Elaborazione</h3>
          <div className="flex gap-2">
            {failed > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetryFailed}
              >
                Riprova Falliti ({failed})
              </Button>
            )}
            {completed > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCompleted}
              >
                Pulisci Completati
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold text-gray-600">In Attesa</div>
            <div className="text-2xl font-bold text-blue-600">{pending}</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-600">In Elaborazione</div>
            <div className="text-2xl font-bold text-blue-600">{processing}</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-semibold text-green-600">Completati</div>
            <div className="text-2xl font-bold text-green-600">{completed}</div>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="font-semibold text-red-600">Falliti</div>
            <div className="text-2xl font-bold text-red-600">{failed}</div>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {queue.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0">
                {item.status === 'pending' && (
                  <FileText className="w-5 h-5 text-gray-400" />
                )}
                {item.status === 'processing' && (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
                {item.status === 'completed' && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {item.status === 'error' && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {item.file.name}
                </div>
                {item.status === 'error' && item.error && (
                  <div className="text-xs text-red-600 mt-1">{item.error}</div>
                )}
                {item.status === 'processing' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.progress}%
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 text-xs text-gray-500">
                {item.status === 'pending' && 'In attesa'}
                {item.status === 'processing' && 'Elaborazione...'}
                {item.status === 'completed' && 'Completato'}
                {item.status === 'error' && 'Errore'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};