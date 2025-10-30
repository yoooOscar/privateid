"use client";

import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import styles from './DecryptFlags.module.css';

interface DecryptFlagsProps {
  onDecrypt: (region: number) => void;
  disabled: boolean;
  results?: {
    isAdult?: { clear: boolean };
    isRegion?: { clear: boolean };
  };
}

export const DecryptFlags: React.FC<DecryptFlagsProps> = ({ onDecrypt, disabled, results }) => {
  const [checkRegion, setCheckRegion] = useState(2);

  const handleDecrypt = () => {
    onDecrypt(checkRegion);
  };

  return (
    <Card title="Verify Access Permissions" subtitle="Check eligibility based on encrypted attributes">
      <div className={styles.form}>
        <Input
          label="Target Region Code"
          type="number"
          value={checkRegion}
          onChange={setCheckRegion}
          placeholder="Enter region code to verify"
          helperText="Check if your region matches this code"
          disabled={disabled}
        />

        <div className={styles.buttonContainer}>
          <Button 
            onClick={handleDecrypt} 
            disabled={disabled}
            variant="secondary"
            fullWidth
          >
            🔍 Verify Permissions
          </Button>
        </div>

        {results && (results.isAdult !== undefined || results.isRegion !== undefined) && (
          <div className={styles.resultsContainer}>
            <h3 className={styles.resultsTitle}>Verification Results</h3>
            
            <div className={styles.resultsList}>
              {results.isAdult !== undefined && (
                <div className={`${styles.resultItem} ${results.isAdult.clear ? styles.success : styles.fail}`}>
                  <div className={styles.resultIcon}>
                    {results.isAdult.clear ? '✅' : '❌'}
                  </div>
                  <div className={styles.resultInfo}>
                    <div className={styles.resultLabel}>Age Verification</div>
                    <div className={styles.resultValue}>
                      {results.isAdult.clear ? 'Adult (18+)' : 'Under 18'}
                    </div>
                  </div>
                </div>
              )}

              {results.isRegion !== undefined && (
                <div className={`${styles.resultItem} ${results.isRegion.clear ? styles.success : styles.fail}`}>
                  <div className={styles.resultIcon}>
                    {results.isRegion.clear ? '✅' : '❌'}
                  </div>
                  <div className={styles.resultInfo}>
                    <div className={styles.resultLabel}>Region Verification</div>
                    <div className={styles.resultValue}>
                      {results.isRegion.clear ? 'Region Match' : 'Region Mismatch'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>🔐</div>
          <div className={styles.infoText}>
            <strong>How it works:</strong> The verification is performed on encrypted data. 
            The smart contract computes access flags without revealing your actual age or region.
          </div>
        </div>
      </div>
    </Card>
  );
};

