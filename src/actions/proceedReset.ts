import { Context } from 'telegraf';

export default async function proceed_reset(ctx: Context) {
  ctx.telegram.sendMessage(
    ctx.chat?.id!,
    `<b>CONFIRM:</b> Are you sure you want to reset your BONKbot Wallet?

Please ensure you have exported your private key / seed phrase to avoid permanent loss of any funds on this wallet.

<b>WARNING:</b> This action is irreversible!`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Cancel', callback_data: 'close' },
            { text: 'Confirm', callback_data: 'confirm_reset' },
          ],
        ],
      },
    },
  );
}
