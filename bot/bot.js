const { Telegraf } = require('telegraf');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

bot.command('start', (ctx) => {
  ctx.reply('Welcome to the Afisha Shop Bot! I will notify you of new orders here.');
});

bot.command('catalog', (ctx) => {
  ctx.reply('To view the catalog, please visit our website: https://your-vercel-deployment.vercel.app/catalog');
});

bot.command('orders', (ctx) => {
  ctx.reply('You can manage orders in the admin panel on the website.');
});

// Handle callback queries for Accept/Cancel inline buttons sent from Vercel function
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data; // e.g. "accept_12345" or "cancel_12345"
  const [action, orderId] = data.split('_');

  if (action === 'accept') {
    await ctx.answerCbQuery(`Order #${orderId} accepted!`);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Remove buttons
    await ctx.reply(`✅ Order #${orderId} was marked as ACCEPTED.`);
  } else if (action === 'cancel') {
    await ctx.answerCbQuery(`Order #${orderId} cancelled!`);
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Remove buttons
    await ctx.reply(`❌ Order #${orderId} was marked as CANCELLED.`);
  }
});

bot.launch().then(() => {
  console.log('Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
