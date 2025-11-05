# 🚀 PumpFun Bots Setup & Activation Guide

This guide will help you set up and activate both the **Volume Bot** and **Bundler Bot** for your PumpFun token.

## 📋 Overview

You have two powerful bots available:

1. **🔧 PumpFun Bundler Bot** - Creates tokens and performs initial buying with multiple wallets
2. **📈 PumpFun Volume Bot** - Generates ongoing volume through automated buy/sell cycles

## 🛠️ Step 1: Environment Setup

### 1.1 Configure Volume Bot

```bash
# Copy the template to the Volume Bot directory
cp volume-bot-config.env Pumpfun_Volume_Bot/.env

# Edit the .env file with your actual values
notepad Pumpfun_Volume_Bot/.env
```

**Required Values for Volume Bot:**
- `RPC_URL`: Your Solana RPC endpoint (Helius, QuickNode, etc.)
- `PRIVATE_KEY`: Your main wallet's private key (base58)
- `TELEGRAM_BOT_TOKEN`: Bot token from @BotFather
- `TELEGRAM_ALLOWED_USER_IDS`: Your Telegram user ID

### 1.2 Configure Bundler Bot

```bash
# Copy the template to the Bundler Bot directory
cp bundler-bot-config.env pumpfun-bundler/.env

# Edit the .env file with your actual values
notepad pumpfun-bundler/.env
```

**Required Values for Bundler Bot:**
- `HELIUS_RPC_URL`: Your Helius RPC endpoint

## 🔑 Step 2: Generate Wallets

### 2.1 Generate Main Wallet (for Volume Bot)

```bash
# Generate a main wallet for the Volume Bot
node wallet-generator.js --count 1 --output main-wallet.json

# Fund this wallet with SOL (recommended: 0.1-1 SOL)
```

### 2.2 Generate Sub-Wallets (for Bundler Bot)

```bash
# Generate 20 wallets for bundling
node wallet-generator.js --count 20 --output bundler-wallets.json

# Fund these wallets with SOL (recommended: 0.01 SOL each)
```

## 🤖 Step 3: Telegram Bot Setup

### 3.1 Create Telegram Bot

1. Message @BotFather on Telegram
2. Send `/newbot`
3. Choose a name and username for your bot
4. Copy the bot token to your `.env` file

### 3.2 Get Your Telegram User ID

1. Message @userinfobot on Telegram
2. Copy your user ID to the `.env` file

## 🚀 Step 4: Activate Both Bots

### 4.1 First: Use Bundler Bot to Create Token

```bash
# Navigate to bundler directory
cd pumpfun-bundler

# Edit the metadata for your token
notepad metadata.ts

# Run the bundler to create and buy your token
npx ts-node example/basic/index.ts
```

**What this does:**
- Creates your token on PumpFun
- Buys tokens with multiple wallets in one bundle
- Returns your token's contract address

### 4.2 Then: Use Volume Bot for Ongoing Volume

```bash
# Navigate to volume bot directory
cd ../Pumpfun_Volume_Bot

# Install dependencies (if not already done)
npm install

# Start the Telegram bot
npm run bot
```

**What this does:**
- Starts the Telegram bot controller
- Allows you to configure settings via Telegram
- Generates ongoing volume for your token

## 📱 Step 5: Control Volume Bot via Telegram

Once the Volume Bot is running, use these Telegram commands:

### Basic Commands
- `/help` - Show all available commands
- `/settings` - Open main control panel
- `/status` - Show current configuration

### Configuration via /settings
1. **Set Token**: Enter your token's contract address (from Bundler Bot)
2. **Set SOL/Swap**: Amount of SOL per buy/sell cycle (default: 0.004)
3. **Set Slippage**: Max price deviation (default: 0.5%)
4. **Set Sleep**: Pause between cycles in milliseconds

### Bot Operations
- **Start Bot**: Begin volume generation
- **Stop Bot**: Halt volume generation
- **Sell All Tokens**: Sell all tokens from sub-wallets
- **Collect All SOL**: Transfer SOL back to main wallet

## 🔄 Step 6: Complete Workflow

### Phase 1: Token Creation (Bundler Bot)
```bash
# 1. Configure bundler bot
cp bundler-bot-config.env pumpfun-bundler/.env
# Edit .env with your RPC URL

# 2. Customize token metadata
# Edit pumpfun-bundler/metadata.ts with your token details

# 3. Generate wallets for bundling
node wallet-generator.js --count 20 --output bundler-wallets.json

# 4. Fund wallets and run bundler
cd pumpfun-bundler
npx ts-node example/basic/index.ts
```

### Phase 2: Volume Generation (Volume Bot)
```bash
# 1. Configure volume bot
cp volume-bot-config.env Pumpfun_Volume_Bot/.env
# Edit .env with your credentials

# 2. Generate main wallet
node wallet-generator.js --count 1 --output main-wallet.json

# 3. Fund main wallet with SOL

# 4. Start volume bot
cd Pumpfun_Volume_Bot
npm run bot

# 5. Use Telegram to configure and start volume generation
```

## ⚠️ Important Security Notes

1. **Private Keys**: Never share your private keys or commit them to version control
2. **Environment Files**: Keep `.env` files secure and never share them
3. **Telegram Access**: Only add trusted user IDs to `TELEGRAM_ALLOWED_USER_IDS`
4. **Wallet Funding**: Start with small amounts for testing

## 💰 Recommended Funding

### For Bundler Bot:
- Main wallet: 0.1 SOL
- Each sub-wallet: 0.01 SOL
- Total: ~0.3 SOL

### For Volume Bot:
- Main wallet: 0.5-1 SOL (for distribution to sub-wallets)
- Each sub-wallet will use: 0.004 SOL per cycle

## 🆘 Troubleshooting

### Common Issues:

1. **"RPC_URL not set"**
   - Ensure your `.env` file is in the correct directory
   - Check that the RPC URL is valid

2. **"Insufficient balance"**
   - Fund your wallets with more SOL
   - Check wallet addresses are correct

3. **"Telegram bot not responding"**
   - Verify bot token is correct
   - Check your user ID is in the allowed list
   - Ensure bot is running (`npm run bot`)

4. **"Token not found"**
   - Verify token contract address is correct
   - Ensure token exists on PumpFun

## 📊 Monitoring Your Bots

### Bundler Bot Success Indicators:
- Token creation transaction confirmed
- Multiple buy transactions in bundle
- Token appears on PumpFun website

### Volume Bot Success Indicators:
- Telegram bot responds to commands
- Sub-wallets are created and funded
- Buy/sell cycles are executing
- Volume increasing on PumpFun

## 🎯 Pro Tips

1. **Start Small**: Test with small amounts first
2. **Monitor Closely**: Watch your bots during initial runs
3. **Adjust Settings**: Fine-tune SOL amounts and timing based on results
4. **Keep Records**: Track your token's performance and bot activity
5. **Backup Wallets**: Keep secure backups of your wallet files

---

**Ready to launch your PumpFun token with both bots? Follow the steps above and you'll be generating volume in no time! 🚀**
