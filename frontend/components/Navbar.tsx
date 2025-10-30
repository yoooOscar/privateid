"use client";

import React from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  isConnected: boolean;
  account?: string;
  onConnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isConnected, account, onConnect }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🔒</div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>PrivID</span>
            <span className={styles.logoSubtitle}>Privacy-Preserving Identity</span>
          </div>
        </div>

        <div className={styles.actions}>
          {isConnected && account && (
            <div className={styles.account}>
              <div className={styles.statusIndicator}></div>
              <span className={styles.accountText}>
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          )}
          
          {!isConnected && (
            <button className={styles.connectButton} onClick={onConnect}>
              <span className={styles.walletIcon}>🦊</span>
              Connect MetaMask
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

