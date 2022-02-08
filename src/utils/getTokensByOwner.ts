import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import * as SPLToken from "@solana/spl-token";
import { MetadataData } from "@metaplex-foundation/mpl-token-metadata";
import {CONNECTION} from '../constants'
import {getMintInfo} from './getMintInfo'
import {getMetaplexTokenMeta} from './getMetaplexTokenMeta'
// get token accounts by owner


export interface Token {
  pubkey: string;
  mintAddress: string;
  amount: number;
  mintInfo: SPLToken.MintInfo;
  mintMeta: {
    onChainData: MetadataData;
    offChainData: any;
  }
}
export async function getTokensByOwners(ownerAddress: string) {
  const tokens: Token[]  = [];
  // 1. you can fetch all token account by an owner
  const response = await CONNECTION.getTokenAccountsByOwner(
    new PublicKey(ownerAddress),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );
  for (const e of response.value) {
    const accountInfo = SPLToken.AccountLayout.decode(e.account.data);
    const amount = SPLToken.u64.fromBuffer(accountInfo.amount).toNumber();
    // skip if amount is 0, which indicated the token has been transferred to another account.
    if (amount === 0) continue;
    const mintAdress = new PublicKey(accountInfo.mint).toString();
    const mintInfo = await getMintInfo(mintAdress);
    const mintMeta = await getMetaplexTokenMeta(mintAdress);
    tokens.push({
      pubkey: e.pubkey.toBase58(),
      mintAddress: mintAdress,
      amount: SPLToken.u64.fromBuffer(accountInfo.amount).toNumber(),
      mintInfo,
      mintMeta
    })
  }
  console.table(tokens)
  return tokens;
}

