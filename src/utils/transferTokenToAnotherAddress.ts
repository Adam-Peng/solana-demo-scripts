import { PublicKey, Transaction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CONNECTION } from '../constants'
import {getOrCreateAssociatedTokenAccount} from './getOrCreateAssociatedTokenAccount'
import {createTransferInstruction} from './createTransferInstructions'

export async function transferTokenToAnotherAddress(
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
    mintAddress: string,
    toPubkey: string,
    payer_pubkey: string,
    amount: number = 1
  ): Promise<true> {
    const publicKey = new PublicKey(payer_pubkey);
    try {
        const toPublicKey = new PublicKey(toPubkey)
        const mint = new PublicKey(mintAddress)

        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            CONNECTION,
            publicKey,
            mint,
            publicKey,
            signTransaction
        )

        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            CONNECTION,
            publicKey,
            mint,
            toPublicKey,
            signTransaction
        )

        const transaction = new Transaction().add(
            createTransferInstruction(
                fromTokenAccount.address, // source
                toTokenAccount.address, // dest
                publicKey,
                amount,
                [],
                TOKEN_PROGRAM_ID
            )
        )

        const blockHash = await CONNECTION.getRecentBlockhash()
        transaction.feePayer = await publicKey
        transaction.recentBlockhash = await blockHash.blockhash
        const signed = await signTransaction(transaction)

        await CONNECTION.sendRawTransaction(signed.serialize())
    } catch (error: any) {
        console.error(`Transaction failed: ${error.message}`)
    }
    
    return true;
}