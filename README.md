# Afisha Poster E-Commerce

A modern, fast, and fully responsive e-commerce platform for event posters built with React 18, Vite, Tailwind CSS v4, Framer Motion, GSAP, and Zustand.

## Features
- **Modern UI/UX**: Bold poster-culture aesthetics, glassmorphism, gradient meshes.
- **Animations**: GSAP horizontal scroll, Framer Motion page transitions and micro-interactions.
- **Multilingual**: i18n support for UZ, RU, EN.
- **Dark Mode**: Tailwind v4 class-based dark mode.
- **State Management**: Persisted global state using Zustand.
- **Demo Auth**: Client-side auth with Web Crypto SHA-256 (for demo purposes only).
- **Admin Panel**: Dashboard with Recharts, Products/Orders management.
- **Telegram Integration**: Serverless Vercel function to send new orders to a Telegram Bot.

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite dev server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Telegram Bot Integration

The app uses Vercel Serverless Functions to forward orders to a Telegram bot. 
To set it up:

1. Talk to [@BotFather](https://t.me/botfather) on Telegram and create a new bot. You will get a `TELEGRAM_BOT_TOKEN`.
2. Get your `TELEGRAM_CHAT_ID`. You can get it by messaging your bot and checking the API: `https://api.telegram.org/bot<TOKEN>/getUpdates`.
3. In your Vercel project settings, add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` as Environment Variables.

You can also run the separate Node.js bot (for custom commands) inside `/bot`:
```bash
cd bot
npm install telegraf
TELEGRAM_BOT_TOKEN=your_token node bot.js
```

## Disclaimer
The authentication system included in this project is strictly for demonstration purposes. Passwords are hashed locally and stored in `localStorage`. In a real-world scenario, you MUST use a secure backend server and proper database for user management and authentication.
