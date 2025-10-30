import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  type?: 'text' | 'number' | 'checkbox';
  value?: string | number | boolean;
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  helperText,
}) => {
  if (type === 'checkbox') {
    return (
      <div className={styles.checkboxContainer}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={value as boolean}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
          />
          <span className={styles.checkboxCustom}></span>
          <span className={styles.label}>{label}</span>
        </label>
        {helperText && <span className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        className={styles.input}
        value={value as string | number}
        onChange={(e) => onChange?.(type === 'number' ? parseInt(e.target.value || '0') : e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
};

