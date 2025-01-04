import { Context } from 'telegraf';
import User from '../models/User';
import dbConnect from '../../mongodb';
import { resetWallet } from '../utils/solana';

export default async function confirm_reset(ctx: Context) {
  const userId = ctx.from?.id;
  const publicKey = await resetWallet(userId!);
  ctx.telegram.sendMessage(
    ctx.chat?.id!,
    `Success: Your new wallet is:

<code>${publicKey}</code>

You can now send SOL to this address to deposit into your new wallet. Press refresh to see your new wallet.`,
    {
      parse_mode: 'HTML',
    },
  );
}
