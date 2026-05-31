'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export default function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && notifications.length > 0) {
        onClose(notifications[0].id);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [notifications, onClose]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-24 left-0 right-0 flex justify-center items-start z-[9999] pointer-events-none">
      <div className="flex flex-col items-center gap-3 w-full max-w-md px-4">
        {notifications.map(notification => {
          const Icon = icons[notification.type];
          return (
            <div
              key={notification.id}
              className={`pointer-events-auto w-full shadow-2xl rounded-xl border-2 p-5 flex items-start gap-4 animate-in slide-in-from-top-2 fade-in duration-300 ${colors[notification.type]}`}
            >
              <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${iconColors[notification.type]}`} />
              <p className="flex-1 text-base font-medium">{notification.message}</p>
              <button
                onClick={() => onClose(notification.id)}
                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}