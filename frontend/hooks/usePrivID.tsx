"use client";

import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringInMemoryStorage } from "@/fhevm/GenericStringStorage";
import { PrivIDAddresses } from "@/abi/PrivIDAddresses";
import { PrivIDABI } from "@/abi/PrivIDABI";

export type ClearBoolType = {
  handle: string;
  clear: boolean;
};

type PrivIDInfoType = {
  abi: typeof PrivIDABI.abi;
  address?: `0x${string}`;
  chainId?: number;
  chainName?: string;
};

function getPrivIDByChainId(chainId: number | undefined): PrivIDInfoType {
  if (!chainId) {
    return { abi: PrivIDABI.abi } as any;
  }
  const entry =
    (PrivIDAddresses as any)[chainId.toString() as keyof typeof PrivIDAddresses];
  if (!("address" in entry) || entry.address === ethers.ZeroAddress) {
    return { abi: PrivIDABI.abi, chainId } as any;
  }
  return {
    address: entry?.address as `0x${string}` | undefined,
    chainId: entry?.chainId ?? chainId,
    chainName: entry?.chainName,
    abi: PrivIDABI.abi,
  } as any;
}

export const usePrivID = (parameters: {
  instance: FhevmInstance | undefined;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
}) => {
  const { instance, chainId, ethersSigner, ethersReadonlyProvider } = parameters;

  const [ageRegionKycHandles, setHandles] = useState<{
    age?: string;
    region?: string;
    kyc?: string;
  }>({});
  const [dec, setDec] = useState<{
    isAdult?: ClearBoolType;
    isKyc?: ClearBoolType;
    isRegion?: ClearBoolType;
  }>({});
  const [message, setMessage] = useState<string>("");
  const isRunningRef = useRef<boolean>(false);
  const storage = useMemo(() => new GenericStringInMemoryStorage(), []);

  const info = useMemo(() => getPrivIDByChainId(chainId), [chainId]);

  const contractReadonly = useMemo(() => {
    if (!info.address || !ethersReadonlyProvider) return undefined;
    return new ethers.Contract(info.address, info.abi, ethersReadonlyProvider);
  }, [info.address, info.abi, ethersReadonlyProvider]);

  const contractWrite = useMemo(() => {
    if (!info.address || !ethersSigner) return undefined;
    return new ethers.Contract(info.address, info.abi, ethersSigner);
  }, [info.address, info.abi, ethersSigner]);

  const refreshMyAttributes = useCallback(async () => {
    const c = contractWrite ?? contractReadonly;
    if (!c) return;
    const res = await c.getMyAttributes();
    setHandles({ age: res[0], region: res[1], kyc: res[2] });
  }, [contractReadonly, contractWrite]);

  const decryptFlags = useCallback(
    async (allowedRegion: number) => {
      if (isRunningRef.current) return;
      const c = contractWrite ?? contractReadonly;
      if (!instance || !c || !ethersSigner) return;
      if (!contractWrite) {
        setMessage("Need signer to compute flags");
        return;
      }
      if (!ageRegionKycHandles.age || !ageRegionKycHandles.region || !ageRegionKycHandles.kyc) {
        setMessage("No handles yet");
        return;
      }
      isRunningRef.current = true;
      try {
        const userAddress = await ethersSigner.getAddress();
        const sig = await FhevmDecryptionSignature.loadOrSign(
          instance,
          [c.target.toString()],
          ethersSigner,
          storage
        );
        if (!sig) {
          setMessage("Unable to build FHEVM decryption signature");
          return;
        }

        // 构造密文输入并发送交易在链上计算与授权
        const input = instance.createEncryptedInput(
          c.target.toString(),
          userAddress
        );
        input.add8(allowedRegion);
        const enc = await input.encrypt();

        const tx = await (contractWrite as any).computeAccessFlagsEnc(
          enc.handles[0],
          enc.inputProof
        );
        await tx.wait();

        // 读取上次计算的加密结果（针对 msg.sender）
        const [a, b] = await (contractWrite as any).getMyLastFlagsEnc();

        const res = await instance.userDecrypt(
          [
            { handle: a, contractAddress: c.target.toString() },
            { handle: b, contractAddress: c.target.toString() },
          ],
          sig.privateKey,
          sig.publicKey,
          sig.signature,
          sig.contractAddresses,
          sig.userAddress,
          sig.startTimestamp,
          sig.durationDays
        );

        const toBool = (v: unknown): boolean => {
          if (typeof v === "boolean") return v;
          if (typeof v === "bigint") return v !== 0n;
          if (typeof v === "number") return v !== 0;
          if (typeof v === "string") return v !== "0" && v !== "";
          return false;
        };

        setDec({
          isAdult: { handle: a, clear: toBool((res as any)[a]) },
          isRegion: { handle: b, clear: toBool((res as any)[b]) },
        });
        setMessage("Decryption completed");
      } finally {
        isRunningRef.current = false;
      }
    },
    [ageRegionKycHandles, contractReadonly, contractWrite, ethersSigner, instance, storage]
  );

  const submit = useCallback(
    async (age: number, region: number, kyc: boolean) => {
      if (isRunningRef.current) return;
      if (!instance || !contractWrite || !ethersSigner) return;

      isRunningRef.current = true;
      try {
        await new Promise((r) => setTimeout(r, 100));
        const input = instance.createEncryptedInput(
          contractWrite.target.toString(),
          ethersSigner.address
        );
        input.add8(age);
        input.add8(region);
        input.addBool(kyc);
        const enc = await input.encrypt();
        const tx = await contractWrite.submitAttributes(
          enc.handles[0],
          enc.handles[1],
          enc.handles[2],
          enc.inputProof
        );
        await tx.wait();
        setMessage("Submit completed");
        await refreshMyAttributes();
      } finally {
        isRunningRef.current = false;
      }
    },
    [contractWrite, ethersSigner, instance, refreshMyAttributes]
  );

  useEffect(() => {
    refreshMyAttributes();
  }, [refreshMyAttributes]);

  return {
    contractAddress: info.address,
    handles: ageRegionKycHandles,
    refreshHandles: refreshMyAttributes,
    submit,
    decryptFlags,
    dec,
    message,
  };
};


