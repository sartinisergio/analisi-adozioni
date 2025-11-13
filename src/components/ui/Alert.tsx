import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'info';
  className?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
}) => {
  const variants = {
    default: 'bg-green-50 border-green-200 text-green-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    default: <CheckCircle2 className="w-5 h-5" />,
    destructive: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 border rounded-lg ${variants[variant]} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {icons[variant]}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};
