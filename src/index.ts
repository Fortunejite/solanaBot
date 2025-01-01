import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import start from './start';

dotenv.config();

const token = process.env.BOT_TOKEN || '';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => start(bot, msg))
bot.on('message', (msg) => bot.sendMessage(msg.chat.id, `You said: ${msg.text}`))

console.log('token: ', token);
