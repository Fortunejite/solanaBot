import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import User from '../models/User';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import bs58 from 'bs58';
import Deleted from '../models/Deleted';
import dbConnect from '../../mongodb';

const RPC_URL = 'https://api.testnet.solana.com';

export const createWallet = async (userId: number) => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic).slice(0, 32);
  const keypair = Keypair.fromSeed(seed);
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = Buffer.from(keypair.secretKey).toString('base64');

  await dbConnect();

  const newUser = new User({
    telegramId: userId,
    secretKey,
    publicKey,
    seed,
  });

  await newUser.save();
  return publicKey;
};

export const resetWallet = async (userId: number) => {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic).slice(0, 32);
  const keypair = Keypair.fromSeed(seed);
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = Buffer.from(keypair.secretKey).toString('base64');

  await dbConnect();

  const user = await User.findOne({ telegramId: userId });

  await User.updateOne({ telegramId: userId }, { secretKey, publicKey, seed });
  const deletedUser = new Deleted({
    telegramId: user?.telegramId,
    secretKey: user?.secretKey,
    publicKey: user?.publicKey,
    seed: user?.seed,
  });

  await deletedUser.save();

  return publicKey;
};

export const getAccountBalance = async (publicKey: PublicKey) => {
  const connection = new Connection(RPC_URL, 'confirmed');
  const balance = await connection.getBalance(publicKey);
  return balance / LAMPORTS_PER_SOL;
};
export const airdrop = async (publicKey: PublicKey) => {
  const connection = new Connection(RPC_URL, 'confirmed');
  const airdropSignature = await connection.requestAirdrop(
    publicKey,
    2 * LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(airdropSignature);
  console.log('Airdropped 2 SOL to', publicKey);
};
