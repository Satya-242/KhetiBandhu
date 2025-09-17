import React from 'react';
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastNotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  className?: string;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  type,
  title,
  message,
  className
}) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle,
  };

  const styles = {
    success: 'notification-success',
    error: 'notification-error',
    info: 'bg-sky-50 border border-sky-200 text-sky-800',
    warning: 'bg-earth-50 border border-earth-200 text-earth-800',
  };

  const Icon = icons[type];

  return (
    <div className={cn(styles[type], 'rounded-lg p-4 flex items-start gap-3', className)}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        {message && (
          <p className="text-sm mt-1 opacity-90">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ToastNotification;