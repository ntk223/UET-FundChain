import { UI_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from './config.js';

/**
 * Notification utilities for user feedback
 * Can be extended to use toast libraries like react-hot-toast or sonner
 */

export class NotificationManager {
  static instance = null;

  constructor() {
    if (NotificationManager.instance) {
      return NotificationManager.instance;
    }
    NotificationManager.instance = this;
    this.listeners = new Set();
  }

  /**
   * Subscribe to notifications
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   */
  notify(type, message, duration = UI_CONFIG.NOTIFICATION_DURATION) {
    this.listeners.forEach(listener => {
      listener({ type, message, duration, timestamp: Date.now() });
    });
  }

  /**
   * Show success notification
   */
  success(message, duration) {
    this.notify('success', message, duration);
    console.log('✅', message);
  }

  /**
   * Show error notification
   */
  error(message, duration) {
    this.notify('error', message, duration);
    console.error('❌', message);
  }

  /**
   * Show info notification
   */
  info(message, duration) {
    this.notify('info', message, duration);
    console.info('ℹ️', message);
  }

  /**
   * Show warning notification
   */
  warning(message, duration) {
    this.notify('warning', message, duration);
    console.warn('⚠️', message);
  }
}

// Singleton instance
export const notifications = new NotificationManager();

/**
 * Helper functions for common notifications
 */
export const notifySuccess = (key) => {
  const message = SUCCESS_MESSAGES[key] || key;
  notifications.success(message);
};

export const notifyError = (key, customMessage) => {
  const message = customMessage || ERROR_MESSAGES[key] || key;
  notifications.error(message);
};

/**
 * Format error messages from blockchain errors
 */
export const formatBlockchainError = (error) => {
  if (!error) return ERROR_MESSAGES.NETWORK_ERROR;
  
  const errorString = error.toString().toLowerCase();
  
  // Check for common error patterns
  if (errorString.includes('user rejected')) {
    return ERROR_MESSAGES.TRANSACTION_REJECTED;
  }
  
  if (errorString.includes('insufficient funds')) {
    return ERROR_MESSAGES.INSUFFICIENT_BALANCE;
  }
  
  if (errorString.includes('only owner')) {
    return ERROR_MESSAGES.NOT_CAMPAIGN_OWNER;
  }
  
  if (errorString.includes('only donors')) {
    return ERROR_MESSAGES.NOT_DONOR;
  }
  
  if (errorString.includes('already voted')) {
    return ERROR_MESSAGES.ALREADY_VOTED;
  }
  
  if (errorString.includes('campaign has ended')) {
    return ERROR_MESSAGES.CAMPAIGN_ENDED;
  }
  
  if (errorString.includes('campaign not ended')) {
    return 'Chiến dịch chưa kết thúc';
  }
  
  if (errorString.includes('campaign did not reach target')) {
    return ERROR_MESSAGES.CAMPAIGN_NOT_SUCCESSFUL;
  }
  
  if (errorString.includes('quorum not reached')) {
    return ERROR_MESSAGES.QUORUM_NOT_REACHED;
  }
  
  if (errorString.includes('proposal not approved')) {
    return ERROR_MESSAGES.PROPOSAL_NOT_APPROVED;
  }
  
  if (errorString.includes('already executed')) {
    return ERROR_MESSAGES.PROPOSAL_EXECUTED;
  }
  
  // Return original error message if no pattern matches
  return error.message || error.toString();
};

/**
 * React hook for notifications
 */
export const useNotifications = () => {
  const [notification, setNotification] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = notifications.subscribe((notif) => {
      setNotification(notif);
      
      // Auto-dismiss after duration
      setTimeout(() => {
        setNotification(null);
      }, notif.duration);
    });

    return unsubscribe;
  }, []);

  return {
    notification,
    success: (msg, duration) => notifications.success(msg, duration),
    error: (msg, duration) => notifications.error(msg, duration),
    info: (msg, duration) => notifications.info(msg, duration),
    warning: (msg, duration) => notifications.warning(msg, duration)
  };
};

export default notifications;
