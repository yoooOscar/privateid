import React from 'react';
import styles from './StatusMessage.module.css';

interface StatusMessageProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <div className={`${styles.message} ${styles[type]}`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.text}>{message}</span>
    </div>
  );
};

