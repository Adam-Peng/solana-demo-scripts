import { Connection } from "@solana/web3.js";

export const NODE_RPC = "https://api.devnet.solana.com"; // devnet environment
export const CONNECTION = new Connection(NODE_RPC);