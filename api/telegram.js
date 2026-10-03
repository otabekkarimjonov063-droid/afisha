export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, customer, items, total, discount, promo } = req.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram token or chat ID is not set in env variables');
    // We return success to the client anyway, just to not break frontend demo if not configured
    return res.status(200).json({ success: true, warning: 'Bot not configured' });
  }

  const itemsList = items.map(item => `- ${item.qty}x ${item.title?.en} (Size: ${item.size}) - ${(item.price * item.qty).toLocaleString()} UZS`).join('\n');
  
  const text = `
🛒 <b>New Order #${id}</b>

👤 <b>Customer:</b> ${customer.name}
📞 <b>Phone:</b> ${customer.phone}
📍 <b>Address:</b> ${customer.address}
💳 <b>Payment:</b> ${customer.payment}
📝 <b>Comment:</b> ${customer.comment || 'None'}

📦 <b>Items:</b>
${itemsList}

💰 <b>Subtotal:</b> ${(total + discount).toLocaleString()} UZS
${promo ? `🎫 <b>Promo applied:</b> ${promo} (-${discount.toLocaleString()} UZS)` : ''}
💳 <b>Total:</b> ${total.toLocaleString()} UZS
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Accept', callback_data: `accept_${id}` },
              { text: '❌ Cancel', callback_data: `cancel_${id}` }
            ]
          ]
        }
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Telegram API Error:', data);
      return res.status(500).json({ error: 'Failed to send to Telegram' });
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
