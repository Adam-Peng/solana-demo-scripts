import { PublicKey } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { CONNECTION } from '../constants'

// tokenmeta is a PDA a which derived by mint address
// the formula is ['metadata', metadata_program_id, mint_id]
// is it totally fine to forget it because sdk already wrapped it for us

export async function getMetaplexTokenMeta(mintAdress: string) {
  let mintPubkey = new PublicKey(mintAdress);
  let tokenmetaPubkey = await Metadata.getPDA(mintPubkey);

  const tokenmeta = await Metadata.load(CONNECTION, tokenmetaPubkey);
  const onChainData = tokenmeta.data;
  const {data: {uri}} = onChainData;
  const offChainData = await (await fetch(uri)).json();
  return {
    onChainData,
    offChainData
  }
};
