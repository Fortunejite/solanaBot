import { Context } from 'telegraf';

export default async function close(ctx: Context) {
  ctx.deleteMessage()
}