import { useState, useCallback } from 'react';

// Simple toast implementation
let toastListeners: Array<(toast: any) => void> = [];

export const toast = ({ title, description, type = 'info' }: {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}) => {
  const toastData = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    description,
    type,
    duration: 5000
  };

  toastListeners.forEach(listener => listener(toastData));

  // Auto remove after duration
  setTimeout(() => {
    console.log(`Toast: ${title} - ${description}`);
  }, toastData.duration);
};

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = useCallback((toastData: any) => {
    setToasts(prev => [...prev, toastData]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastData.id));
    }, toastData.duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Register listener on mount
  useState(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter(l => l !== addToast);
    };
  });

  return {
    toasts,
    toast,
    removeToast,
  };
}
