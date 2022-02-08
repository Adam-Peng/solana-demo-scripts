import React, { FC, ReactNode, useMemo } from 'react';
import {useEffect, useState} from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import {sendSolToAnotherAddress} from '../utils/sendSolToAnotherAddress';
import {useWalletBalance} from '../hooks/useWalletBalance';
import { PublicKey } from "@solana/web3.js"

export const SendSols: FC = () =>  {
  const wallet = useWallet();
  const [receipient, setReceipient] = useState("");
  const [lamports, setLamports] = useState(0);
  const [sending, setSending] = useState(false);
  const onSend = async () => {
    if (!wallet.publicKey) alert('wallet is not loaded');
    setSending(true);
    await sendSolToAnotherAddress(wallet.sendTransaction, (wallet.publicKey as PublicKey)?.toString(), receipient, lamports)
    alert(`${lamports} lamports have been sent to ${receipient}`);
    setSending(false);
  }
  return (
    <div style={{display: "block"}}>
      <hr/>
      <h1>Send Sols</h1>
      <div>
        <input type="number" placeholder='Number of lamports you want to send' onChange={(e) => setLamports(Number(e.target.value)) } />
      </div>
      <div>
        <input type="text" placeholder="Recepient's wallet address" onChange={(e) => setReceipient(e.target.value) } />
      </div>
      <button onClick={() => onSend()} disabled={!wallet.connected || sending}>{sending ? 'sending' : 'Send'}</button>
    </div>
  );
};

