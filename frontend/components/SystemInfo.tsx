"use client";

import React from 'react';
import { Card } from './Card';
import { InfoDisplay } from './InfoDisplay';
import { Button } from './Button';
import styles from './SystemInfo.module.css';

interface SystemInfoProps {
  contractAddress?: string;
  handles: {
    age?: string;
    region?: string;
    kyc?: string;
  };
  onRefresh: () => void;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ contractAddress, handles, onRefresh }) => {
  return (
    <Card title="System Information" subtitle="Blockchain and contract details">
      <div className={styles.container}>
        {contractAddress && (
          <InfoDisplay
            label="Smart Contract Address"
            value={contractAddress}
            icon="📜"
            copyable
          />
        )}

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Encrypted Data Handles</h3>
            <Button onClick={onRefresh} size="small" variant="secondary">
              🔄 Refresh
            </Button>
          </div>

          <div className={styles.handlesList}>
            <InfoDisplay
              label="Age Handle"
              value={handles.age ? `${handles.age.slice(0, 20)}...` : 'Not available'}
              icon="👤"
            />
            <InfoDisplay
              label="Region Handle"
              value={handles.region ? `${handles.region.slice(0, 20)}...` : 'Not available'}
              icon="🌍"
            />
            <InfoDisplay
              label="KYC Handle"
              value={handles.kyc ? `${handles.kyc.slice(0, 20)}...` : 'Not available'}
              icon="✓"
            />
          </div>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>💡</div>
          <div className={styles.infoText}>
            <strong>What are handles?</strong> Handles are encrypted references to your data on the blockchain. 
            They allow operations on encrypted values without revealing the actual data.
          </div>
        </div>
      </div>
    </Card>
  );
};

