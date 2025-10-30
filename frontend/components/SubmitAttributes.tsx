"use client";

import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import styles from './SubmitAttributes.module.css';

interface SubmitAttributesProps {
  onSubmit: (age: number, region: number, kyc: boolean) => void;
  disabled: boolean;
}

export const SubmitAttributes: React.FC<SubmitAttributesProps> = ({ onSubmit, disabled }) => {
  const [age, setAge] = useState(25);
  const [region, setRegion] = useState(2);
  const [kyc, setKyc] = useState(true);

  const handleSubmit = () => {
    onSubmit(age, region, kyc);
  };

  return (
    <Card title="Submit Your Identity Attributes" subtitle="Encrypted data submission to the blockchain">
      <div className={styles.form}>
        <Input
          label="Age"
          type="number"
          value={age}
          onChange={setAge}
          placeholder="Enter your age"
          helperText="Your age will be encrypted before submission"
          disabled={disabled}
        />
        
        <Input
          label="Region Code"
          type="number"
          value={region}
          onChange={setRegion}
          placeholder="Enter your region code"
          helperText="Numeric code representing your geographical region"
          disabled={disabled}
        />
        
        <Input
          label="KYC Verification Status"
          type="checkbox"
          value={kyc}
          onChange={setKyc}
          helperText="Check if you have completed KYC verification"
          disabled={disabled}
        />

        <div className={styles.buttonContainer}>
          <Button 
            onClick={handleSubmit} 
            disabled={disabled}
            variant="primary"
            fullWidth
          >
            🔐 Submit Encrypted Attributes
          </Button>
        </div>

        <div className={styles.infoBox}>
          <div className={styles.infoIcon}>🛡️</div>
          <div className={styles.infoText}>
            <strong>Privacy Guarantee:</strong> All your data is encrypted using Zama FHEVM 
            before being sent to the blockchain. Nobody can read your actual values.
          </div>
        </div>
      </div>
    </Card>
  );
};

