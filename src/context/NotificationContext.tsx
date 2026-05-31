'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import NotificationContainer from '@/components/NotificationContainer';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface NotificationContextType {
  notify: (message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

let globalNotify: ((message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => void) | null = null;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    const newNotification: Notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, newNotification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  // ✅ only change — was `globalNotify = notify;` directly in render
  useEffect(() => {
    globalNotify = notify;
  }, [notify]);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationContainer notifications={notifications} onClose={id => setNotifications(prev => prev.filter(n => n.id !== id))} />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const notify = (message: string, type?: 'info' | 'success' | 'warning' | 'error', duration?: number) => {
  if (globalNotify) {
    globalNotify(message, type, duration);
  }
};

export const notifySuccess = (message: string, duration?: number) => notify(message, 'success', duration);
export const notifyError = (message: string, duration?: number) => notify(message, 'error', duration);
export const notifyWarning = (message: string, duration?: number) => notify(message, 'warning', duration);
export const notifyInfo = (message: string, duration?: number) => notify(message, 'info', duration);