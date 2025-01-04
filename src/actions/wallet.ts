import { Context } from 'telegraf';
import dbConnect from '../../mongodb';
import User from '../models/User';
import { getAccountBalance } from '../utils/solana';
import { PublicKey } from '@solana/web3.js';
import { printWithNineDecimals } from '../utils/formating';

export default async function wallet(ctx: Context) {
  const userId = ctx.from?.id;

  await dbConnect();
  const user = await User.findOne({ telegramId: userId });
  const balance = await getAccountBalance(new PublicKey(user?.publicKey!))

  ctx.telegram.sendMessage(
    ctx.chat?.id!,
    `Your Wallet:
  
  Address:<code>${user?.publicKey}</code>
  Balance: <b>${printWithNineDecimals(balance)}</b> SOL
  
  Tap to copy the address and send SOL to deposit.`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'View on Solscan',
              url: `https://solscan.io/account/${user?.publicKey}`,
            },
            { text: 'Close', callback_data: 'close' },
          ],
          [
            { text: 'Deposit SOL', callback_data: 'deposit' },
            {
              text: 'Buy SOL',
              url: 'https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=7H12vyN271bussh4rLcPnz7Ju7KGwo911otFRWT9cY7a&showWalletAddressForm=true&currencyCode=sol&signature=BInyyFGDmMuYziQgn9S2OCQzHxexvZtSExiufbATXVY%3D',
            },
          ],
          [
            { text: 'Withdraw all SOL', callback_data: 'withdraw_all' },
            { text: 'Withdraw X SOL', callback_data: 'withdraw_X' },
          ],
          [
            { text: 'Reset Wallet', callback_data: 'reset' },
            { text: 'Export Seed Phrase', callback_data: 'export_wallet' },
          ],
          [{ text: 'Refresh', callback_data: 'refresh' }],
        ],
      },
    },
  );
}
