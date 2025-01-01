import TelegramBot from 'node-telegram-bot-api';
import User from './models/User';
import { Keypair } from '@solana/web3.js';
import dbConnect from '../mongodb';

export default async function start(
  bot: TelegramBot,
  msg: TelegramBot.Message,
  metadata?: TelegramBot.Metadata,
) {
  const userId = msg.from?.id;
  const chatId = msg.chat.id;

  await dbConnect()
  const user = await User.findOne({ telegramId: userId });
  if (!user) {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58()
    const secretKey = Buffer.from(keypair.secretKey).toString('base64')

    const newUser = new User({
      telegramId: userId,
      secretKey: secretKey,
      publicKey
    })

    await newUser.save()
    bot.sendMessage(chatId, `Welcome, ${msg.from?.first_name}! Your Solana wallet has been created.\n\nPublic Key: ${publicKey}`)
  } else {
    bot.sendMessage(chatId, `Welcome back! ${msg.from?.first_name}! Your Solana wallet:\n\nPublic Key: ${user.publicKey}`)
  }
}
