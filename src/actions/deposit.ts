import { Context } from 'telegraf';
import dbConnect from '../../mongodb';
import User from '../models/User';
import { airdrop } from '../utils/solana';
import { PublicKey } from '@solana/web3.js';

export default async function deposit(ctx: Context) {
  const userId = ctx.from?.id;

  await dbConnect();
  const user = await User.findOne({ telegramId: userId });
  ctx.telegram.sendMessage(ctx.chat?.id!, 'To deposit send SOL to below address:');
  ctx.telegram.sendMessage(ctx.chat?.id!, `<code>${user?.publicKey}</code>`, {
    parse_mode: 'HTML',
  });
  await airdrop(new PublicKey(user?.publicKey!))
}
