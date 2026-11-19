# GiftVault

A gift marketplace Telegram Mini App. Browse gifts, favorite them, search, and sort by price.

Bot: [t.me/giftVaultTG_bot](https://t.me/giftVaultTG_bot)

## Status

Early demo. Gifts are fake data stored in a JS array, and favorites reset on reload. No backend, wallet, or payments yet.

## Files

- `index.html` - page structure and CSS
- `script.js` - gift data, search, favorites, sorting, Telegram SDK

## Run locally

Open `index.html` in a browser.

## Deploy

Hosted on Netlify. The bot's menu button (set via @BotFather) points to the Netlify URL.

## Roadmap

- [x] Card grid, search, favorites, filter sheet
- [x] Hosted and connected to the bot
- [ ] Telegram SDK (user name, theme)
- [ ] Backend and database for real listings
- [ ] Verify Telegram `initData` server-side
- [ ] Wallet (TON Connect) and payments

## Security note

Never commit the bot token or any secrets to this repo.