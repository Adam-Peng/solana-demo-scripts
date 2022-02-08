import React, { FC } from 'react';
import { useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { transferTokenToAnotherAddress } from '../utils/transferTokenToAnotherAddress';
import { PublicKey } from "@solana/web3.js"
import { getTokensByOwners, Token } from '../utils/getTokensByOwner';

const TokenDetail: FC<{ token: Token }> = ({ token }) => {
  const wallet = useWallet();
  const [transferTo, setTransferTo] = useState<string>("");
  const [transfering, setTransfering] = useState<boolean | -1>(false);
  const { pubkey: associatedAccount, mintAddress, mintInfo, amount, mintMeta } = token;
  const name = mintMeta.onChainData.data.name;
  const image = mintMeta.offChainData.image;
  const onTransfer = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) alert('wallet is not loaded');
    setTransfering(true);
    await transferTokenToAnotherAddress(
      // @ts-ignore
      wallet.signTransaction,
      mintAddress,
      transferTo,
      (wallet.publicKey as PublicKey)?.toString(),
      1)
    setTransfering(-1);
    alert(`Token ${mintAddress} have been transferred to ${transferTo}`);
  }
  return (
    <tr>
      <td>{name}</td>
      <td>{associatedAccount}</td>
      <td>{mintAddress}</td>
      <td>{amount}</td>
      <td><img src={image} width={100} /></td>
      <th>
        <button onClick={() => alert(JSON.stringify(mintMeta.onChainData, null, 2))}>Onchain Data</button>
        <button onClick={() => alert(JSON.stringify(mintMeta.offChainData, null, 2))}>Offchain Data</button>
      </th>
      <th>
        <input type="text" placeholder='address' onChange={(e) => setTransferTo(e.target.value)} disabled={transfering === -1 || transfering === true} />
        <button disabled={transfering === -1 || transfering === true} onClick={() => onTransfer()}>
          {
            transfering === true ? "Tansferring" : transfering === -1 ? "Transferred" : "Transfer"
          }
        </button>
      </th>
    </tr>
  )
}

export const Tokens = () => {
  const wallet = useWallet();
  const walletAddress = wallet.publicKey?.toBase58();
  const [tokens, setTokens] = useState<Token[] | -1>(-1);
  useEffect(() => {
    if (walletAddress) {
      getTokensByOwners(walletAddress).then((result) => {
        setTokens(result);
      });
    }
  }, [walletAddress]);
  return (
    <div style={{ display: "block" }}>
      <hr />
      <h1>Wallet Tokens</h1>
      <em>{tokens !== -1 ? "See full details in console" : "loading"}</em>
      {
        Array.isArray(tokens) &&
        <table>
          <tr>
            <th>Token name</th>
            <th>Associated Account Address</th>
            <th>Mint Address</th>
            <th>Token amount</th>
            <th>Image</th>
            <th>Data</th>
            <th>Transfer To</th>
          </tr>
          {
            tokens.map((token, index) => <TokenDetail token={token} key={index} />)
          }
        </table>
      }
    </div>
  );
};

