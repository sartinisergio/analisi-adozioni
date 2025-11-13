import React from 'react';
import { Clock, CheckCircle, XCircle, Loader2, Trash2, FileText, Upload } from 'lucide-react';
import { useQueueStore } from '../../stores/queue.store';
import { Button } from '../ui/Button';
import type { QueueItem } from '../../types/queue.types';

export const AnalysisQueue: React.FC = () => {
  const { items, removeFromQueue, clearQueue, getItemsCount } = useQueueStore();
  const counts = getItemsCount();

  const getStatusIcon = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'analyzing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'reviewing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (status: QueueItem['status']) => {
    switch (status) {
      case 'pending':
        return 'In attesa';
      case 'analyzing':
        return 'Analisi in corso...';
      case 'reviewing':
        return 'In revisione';
      case 'completed':
        return 'Completato';
      case 'error':
        return 'Errore';
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Coda di Analisi</h3>
          <p className="text-sm text-gray-600 mt-1">
            {counts.total} elementi • {counts.pending} in attesa • {counts.completed} completati
            {counts.errors > 0 && ` • ${counts.errors} errori`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearQueue}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Svuota Coda
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
              item.status === 'analyzing' || item.status === 'reviewing'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0">
              {getStatusIcon(item.status)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.type === 'pdf' ? (
                  <Upload className="w-4 h-4 text-gray-500" />
                ) : (
                  <FileText className="w-4 h-4 text-gray-500" />
                )}
                <span className="font-medium text-gray-900 truncate">
                  {item.fileName || `Testo ${index + 1}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-medium ${
                  item.status === 'error' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {getStatusText(item.status)}
                </span>
                {item.error && (
                  <span className="text-red-600">• {item.error}</span>
                )}
              </div>
            </div>

            {item.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFromQueue(item.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
