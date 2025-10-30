"use client";

import { useMemo, useState } from "react";
import { ethers } from "ethers";
import { MetaMaskProvider, useMetaMaskProvider } from "@/hooks/metamask/useMetaMaskProvider";
import { useFhevm } from "@/fhevm/useFhevm";
import { usePrivID } from "@/hooks/usePrivID";
import { Navbar } from "@/components/Navbar";
import { SubmitAttributes } from "@/components/SubmitAttributes";
import { DecryptFlags } from "@/components/DecryptFlags";
import { SystemInfo } from "@/components/SystemInfo";
import { StatusMessage } from "@/components/StatusMessage";
import styles from "./page.module.css";

function Content() {
  const { provider, chainId, accounts, isConnected, connect } = useMetaMaskProvider();
  const { instance, status } = useFhevm({ provider: provider as ethers.Eip1193Provider | undefined, chainId });
  const signer = useMemo(() => {
    if (!provider || !chainId || !isConnected) return undefined;
    const p = new ethers.BrowserProvider(provider as any);
    return p.getSigner();
  }, [provider, chainId, isConnected]);

  const [signerState, setSignerState] = useState<ethers.JsonRpcSigner | undefined>(undefined);
  signer?.then((s) => setSignerState(s as any));

  const readonly = useMemo(() => {
    if (!provider) return undefined;
    return new ethers.BrowserProvider(provider as any);
  }, [provider]);

  const { contractAddress, submit, decryptFlags, dec, message, handles, refreshHandles } = usePrivID({
    instance,
    eip1193Provider: provider as any,
    chainId,
    ethersSigner: signerState,
    ethersReadonlyProvider: readonly as any,
  });

  const isReady = !!(instance && signerState);
  const userAccount = accounts?.[0];

  const getMessageType = (): 'success' | 'info' | 'warning' | 'error' => {
    if (!message) return 'info';
    if (message.includes('completed')) return 'success';
    if (message.includes('Unable') || message.includes('Need')) return 'warning';
    return 'info';
  };

  return (
    <>
      <Navbar 
        isConnected={isConnected} 
        account={userAccount}
        onConnect={connect}
      />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Privacy-Preserving Identity Verification</h1>
            <p className={styles.subtitle}>
              Secure, encrypted on-chain identity management powered by Zama FHEVM technology
            </p>
          </div>

          {!isConnected && (
            <div className={styles.connectPrompt}>
              <div className={styles.promptIcon}>🦊</div>
              <h2 className={styles.promptTitle}>Connect Your Wallet</h2>
              <p className={styles.promptText}>
                Please connect your MetaMask wallet to start using PrivID. 
                Your data will be encrypted before submission to the blockchain.
              </p>
            </div>
          )}

          {isConnected && (
            <>
              {message && (
                <div className={styles.statusContainer}>
                  <StatusMessage message={message} type={getMessageType()} />
                </div>
              )}

              <div className={styles.grid}>
                <div className={styles.gridItem}>
                  <SubmitAttributes 
                    onSubmit={submit}
                    disabled={!isReady}
                  />
                </div>

                <div className={styles.gridItem}>
                  <DecryptFlags 
                    onDecrypt={decryptFlags}
                    disabled={!isReady}
                    results={dec}
                  />
                </div>

                <div className={styles.gridItemFull}>
                  <SystemInfo 
                    contractAddress={contractAddress}
                    handles={handles}
                    onRefresh={refreshHandles || (() => {})}
                  />
                </div>
              </div>

              <div className={styles.footer}>
                <div className={styles.footerContent}>
                  <div className={styles.footerIcon}>⚡</div>
                  <div className={styles.footerText}>
                    <strong>Powered by Zama FHEVM</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function Page() {
  return (
    <MetaMaskProvider>
      <Content />
    </MetaMaskProvider>
  );
}
