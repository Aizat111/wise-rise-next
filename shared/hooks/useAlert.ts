import { useCallback, useState } from 'react';

export interface AlertState {
  id: string;
  variant:
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'toshi'
    | 'toshiNeon'
    | 'toshiBlue'
    | 'toshiPurple'
    | 'toshiPink'
    | 'announcement'
    | 'promotion'
    | 'maintenance'
    | 'security'
    | 'subtle'
    | 'ghost';
  title: string;
  description?: string;
  visible: boolean;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface UseAlertReturn {
  alerts: AlertState[];
  showAlert: (_alert: Omit<AlertState, 'id' | 'visible'>) => string;
  hideAlert: (_id: string) => void;
  hideAllAlerts: () => void;
  clearAlerts: () => void;
}

export function useAlert(): UseAlertReturn {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const showAlert = useCallback((alert: Omit<AlertState, 'id' | 'visible'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newAlert: AlertState = {
      ...alert,
      id,
      visible: true
    };

    setAlerts(prev => [...prev, newAlert]);

    // Auto-hide after duration if specified
    if (alert.duration && alert.duration > 0) {
      setTimeout(() => {
        hideAlert(id);
      }, alert.duration);
    }

    return id;
  }, []);

  const hideAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(alert => (alert.id === id ? { ...alert, visible: false } : alert)));

    // Remove from array after animation
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 300);
  }, []);

  const hideAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, visible: false })));

    // Clear all after animation
    setTimeout(() => {
      setAlerts([]);
    }, 300);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    alerts,
    showAlert,
    hideAlert,
    hideAllAlerts,
    clearAlerts
  };
}
