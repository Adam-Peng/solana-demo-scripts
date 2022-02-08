import { Connection, PublicKey, SystemProgram, Transaction, TransactionSignature } from '@solana/web3.js';
import { CONNECTION } from '../constants'


export async function sendSolToAnotherAddress(
    sendTransaction: (Transaction: Transaction, connection: Connection) => Promise<TransactionSignature>,
    payer_pubkey: string,
    receiver_pubkey: string,
    lamports: number
  ): Promise<true> {
    const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(payer_pubkey),
      toPubkey: new PublicKey(receiver_pubkey),
      lamports, // A lamport has a value of 0.000000001 SOL.
    })
  );

  const signature = await sendTransaction(transaction, CONNECTION);

  await CONNECTION.confirmTransaction(signature, 'processed');

  return true;
}