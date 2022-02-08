import { CONNECTION } from "../constants";

import * as SPLToken from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

// fetch mint info

// you can get mint informations by a mint address

export async function getMintInfo(mintAddress: string) {
  // we can use the function which lives in @solana/spl-token to fetch mint info
  // the parameters are, (connection, mint address, token program id, fee payer)
  // here we just want to fetch info, so we don't need to pass fee payer
  // @ts-ignore
  let token = new SPLToken.Token(CONNECTION, new PublicKey(mintAddress), SPLToken.TOKEN_PROGRAM_ID, null);
  let tokenInfo = await token.getMintInfo();
  return tokenInfo;
  // you will find that the data not include name, symbol, image...
  // because in the begin, solana don't make these data write on chain
  // if you want to fetch these info, refer to ./getMetaplexTokenMeta.ts
}
