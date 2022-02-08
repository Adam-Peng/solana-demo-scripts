import React, { FC } from 'react';
import { useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { getTokensByOwners } from '../utils/getTokensByOwner';
import { useWalletBalance } from '../hooks/useWalletBalance';

export const WalletData: FC = () => {
  const wallet = useWallet();
  const [balance] = useWalletBalance();
  const walletAddress = wallet.publicKey?.toBase58();
  return (
    <div style={{ display: "block" }}>
      <h3>Wallet Address: {walletAddress}</h3>
      <h3>Wallet Balance: {balance}</h3>
    </div>
  );
};

