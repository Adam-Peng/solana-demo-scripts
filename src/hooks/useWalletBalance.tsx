import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { createContext, useContext, useEffect, useState } from "react";

const BalanceContext = createContext(null);

const connection = new Connection("https://api.devnet.solana.com");

export function useWalletBalance() {
  const [balance, setBalance]: any = useContext(BalanceContext);
  return [balance, setBalance];
}

export const WalletBalanceProvider: React.FC<{}> = ({ children }) => {
  const wallet = useWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet]);

  useEffect(() => {
    (async () => {
      if (wallet?.publicKey) {
        const balance = await connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet]);

  return (
    // @ts-ignore
    <BalanceContext.Provider value={[balance, setBalance]}>
      {children}
    </BalanceContext.Provider>
  );
};
