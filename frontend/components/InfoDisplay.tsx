import React from 'react';
import styles from './InfoDisplay.module.css';

interface InfoDisplayProps {
  label: string;
  value: string | React.ReactNode;
  icon?: string;
  copyable?: boolean;
}

export const InfoDisplay: React.FC<InfoDisplayProps> = ({ label, value, icon, copyable = false }) => {
  const handleCopy = () => {
    if (typeof value === 'string' && copyable) {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {label}
      </div>
      <div className={styles.valueContainer}>
        <div className={styles.value}>{value}</div>
        {copyable && typeof value === 'string' && (
          <button className={styles.copyButton} onClick={handleCopy} title="Copy to clipboard">
            📋
          </button>
        )}
      </div>
    </div>
  );
};

