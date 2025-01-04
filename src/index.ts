import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import start from './commands/start';
import help from './commands/help';
import dbConnect from '../mongodb';
import User from './models/User';
import wallet from './actions/wallet';
import deposit from './actions/deposit';
import reset from './actions/reset';
import close from './actions/close';
import proceed_reset from './actions/proceedReset';
import confirm_reset from './actions/confirmReset';
import { messageAction } from './commands/fetchToken';

dotenv.config();

const token = process.env.BOT_TOKEN || '';

export const bot = new Telegraf(token);

bot.start(start);
bot.help(help);
bot.on('message', messageAction);

bot.action('wallet', wallet);
bot.action('deposit', deposit);
bot.action('close', close);
bot.action('reset', reset);
bot.action('proceed_reset', proceed_reset);
bot.action('confirm_reset', confirm_reset);

bot.catch((e, ctx) => {
  ctx.reply('Something went wrong...');
  console.log(e);
});
bot.launch().then(() => console.log('Bot is running...'));
