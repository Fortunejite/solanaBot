import { Context } from 'telegraf';

export default async function reset(ctx: Context) {
  ctx.telegram.sendMessage(
    ctx.chat?.id!,
    `Are you sure you want to reset your BONKbot Wallet?

<b>WARNING:</b> This action is irreversible!

BONKbot will generate a new wallet for you and discard your old one.`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Cancel', callback_data: 'close' },
            { text: 'Confirm', callback_data: 'proceed_reset' },
          ],
        ],
      },
    },
  );
}
