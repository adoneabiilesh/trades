# 🚀 Enhanced PumpFun Bots Setup & Activation Guide

This guide will help you set up and activate both the **Enhanced Volume Bot** and **Enhanced Bundler Bot** with optimized parameters for natural-looking volume generation.

## 📋 Enhanced Overview

You now have two powerful enhanced bots available:

1. **🔧 Enhanced PumpFun Bundler Bot** - Creates tokens and performs initial buying with 8 wallets and randomized delays
2. **📈 Enhanced PumpFun Volume Bot** - Generates 400 trades over 30 minutes with unpredictable patterns

## 🎯 Enhanced Features

### Bundler Bot Enhancements:
- ✅ **8 wallets** (reduced from 20 for better efficiency)
- ✅ **Randomized delays** (0-2 seconds between purchases)
- ✅ **Variable SOL amounts** (0.01-0.02 SOL to avoid uniform spikes)
- ✅ **Price bumps** (0.1-0.5% mimics small market reactions)

### Volume Bot Enhancements:
- ✅ **8 wallets** for volume generation
- ✅ **50 cycles per wallet** = 400 total trades (200 buys + 200 sells)
- ✅ **30-minute duration** for natural spread
- ✅ **Randomized intervals** (20-60 seconds keeps chart movement unpredictable)
- ✅ **Variable SOL amounts** (0.01-0.02 SOL avoids uniform spikes)
- ✅ **Price bumps** (0.1-0.5% mimics small market reactions)

## 🛠️ Step 1: Enhanced Environment Setup

### 1.1 Configure Enhanced Volume Bot

```bash
# Copy the enhanced template to the Volume Bot directory
cp volume-bot-config.env Pumpfun_Volume_Bot/.env

# Edit the .env file with your actual values
notepad Pumpfun_Volume_Bot/.env
```

**Enhanced Values for Volume Bot:**
- `WALLET_COUNT=8` (pre-configured)
- `CYCLES_PER_WALLET=50` (pre-configured)
- `TOTAL_CYCLES=400` (pre-configured)
- `MIN_INTERVAL_SECONDS=20` (pre-configured)
- `MAX_INTERVAL_SECONDS=60` (pre-configured)
- `TOTAL_DURATION_MINUTES=30` (pre-configured)
- `MIN_SOL_AMOUNT=0.01` (pre-configured)
- `MAX_SOL_AMOUNT=0.02` (pre-configured)
- `MIN_PRICE_BUMP_PERCENT=0.1` (pre-configured)
- `MAX_PRICE_BUMP_PERCENT=0.5` (pre-configured)

### 1.2 Configure Enhanced Bundler Bot

```bash
# Copy the enhanced template to the Bundler Bot directory
cp bundler-bot-config.env pumpfun-bundler/.env

# Edit the .env file with your actual values
notepad pumpfun-bundler/.env
```

**Enhanced Values for Bundler Bot:**
- `BUNDLER_WALLET_COUNT=8` (pre-configured)
- `MIN_BUNDLE_DELAY_MS=0` (pre-configured)
- `MAX_BUNDLE_DELAY_MS=2000` (pre-configured)
- `MIN_SOL_AMOUNT=0.01` (pre-configured)
- `MAX_SOL_AMOUNT=0.02` (pre-configured)
- `MIN_PRICE_BUMP_PERCENT=0.1` (pre-configured)
- `MAX_PRICE_BUMP_PERCENT=0.5` (pre-configured)

## 🔑 Step 2: Generate Enhanced Wallets

### 2.1 Generate Bundler Wallets (8 wallets)

```bash
# Generate 8 wallets for bundling
node wallet-generator.js --count 8 --output bundler-wallets.json

# Fund these wallets with SOL (recommended: 0.02 SOL each = 0.16 SOL total)
```

### 2.2 Generate Volume Wallets (8 wallets)

```bash
# Generate 8 wallets for volume generation
node wallet-generator.js --count 8 --output volume-wallets.json

# Fund these wallets with SOL (recommended: 0.02 SOL each = 0.16 SOL total)
```

### 2.3 Generate Main Wallet (for Volume Bot)

```bash
# Generate a main wallet for the Volume Bot
node wallet-generator.js --count 1 --output main-wallet.json

# Fund this wallet with SOL (recommended: 0.5-1 SOL for distribution)
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

## 🚀 Step 4: Activate Enhanced Bots

### 4.1 First: Use Enhanced Bundler Bot to Create Token

```bash
# Navigate to bundler directory
cd pumpfun-bundler

# Edit the metadata for your token
notepad metadata.ts

# Run the enhanced bundler to create and buy your token
npx ts-node example/basic/enhanced-bundler.ts
```

**What the Enhanced Bundler does:**
- Creates your token on PumpFun
- Uses 8 wallets instead of 20 for efficiency
- Adds randomized delays (0-2 seconds) between purchases
- Uses variable SOL amounts (0.01-0.02 SOL)
- Implements price bumps (0.1-0.5%)
- Returns your token's contract address

### 4.2 Then: Use Enhanced Volume Bot for Ongoing Volume

```bash
# Navigate to volume bot directory
cd ../Pumpfun_Volume_Bot

# Install dependencies (if not already done)
npm install

# Start the enhanced Telegram bot
npm run bot
```

**What the Enhanced Volume Bot does:**
- Uses 8 wallets for volume generation
- Executes 50 cycles per wallet (400 total trades)
- Spreads activity over 30 minutes
- Uses randomized intervals (20-60 seconds)
- Implements variable SOL amounts (0.01-0.02 SOL)
- Adds price bumps (0.1-0.5%)
- Creates unpredictable chart movement

## 📱 Step 5: Control Enhanced Volume Bot via Telegram

Once the Enhanced Volume Bot is running, use these Telegram commands:

### Basic Commands
- `/help` - Show all available commands
- `/settings` - Open main control panel
- `/status` - Show current configuration

### Enhanced Configuration via /settings
1. **Set Token**: Enter your token's contract address (from Enhanced Bundler Bot)
2. **Set SOL/Swap**: Amount of SOL per buy/sell cycle (default: 0.01-0.02 SOL range)
3. **Set Slippage**: Max price deviation (default: 0.5%)
4. **Set Sleep**: Pause between cycles (default: 20-60 seconds randomized)

### Enhanced Bot Operations
- **Start Bot**: Begin enhanced volume generation (400 trades over 30 minutes)
- **Stop Bot**: Halt volume generation
- **Sell All Tokens**: Sell all tokens from sub-wallets
- **Collect All SOL**: Transfer SOL back to main wallet

## 🔄 Step 6: Complete Enhanced Workflow

### Phase 1: Enhanced Token Creation (Bundler Bot)
```bash
# 1. Configure enhanced bundler bot
cp bundler-bot-config.env pumpfun-bundler/.env
# Edit .env with your RPC URL

# 2. Customize token metadata
# Edit pumpfun-bundler/metadata.ts with your token details

# 3. Generate 8 wallets for bundling
node wallet-generator.js --count 8 --output bundler-wallets.json

# 4. Fund wallets (0.02 SOL each = 0.16 SOL total) and run enhanced bundler
cd pumpfun-bundler
npx ts-node example/basic/enhanced-bundler.ts
```

### Phase 2: Enhanced Volume Generation (Volume Bot)
```bash
# 1. Configure enhanced volume bot
cp volume-bot-config.env Pumpfun_Volume_Bot/.env
# Edit .env with your credentials

# 2. Generate main wallet and 8 volume wallets
node wallet-generator.js --count 1 --output main-wallet.json
node wallet-generator.js --count 8 --output volume-wallets.json

# 3. Fund wallets (0.02 SOL each for volume wallets, 0.5-1 SOL for main)

# 4. Start enhanced volume bot
cd Pumpfun_Volume_Bot
npm run bot

# 5. Use Telegram to configure and start enhanced volume generation
```

## ⚠️ Enhanced Security Notes

1. **Private Keys**: Never share your private keys or commit them to version control
2. **Environment Files**: Keep `.env` files secure and never share them
3. **Telegram Access**: Only add trusted user IDs to `TELEGRAM_ALLOWED_USER_IDS`
4. **Wallet Funding**: Start with small amounts for testing
5. **Enhanced Features**: Monitor the randomized patterns to ensure they look natural

## 💰 Enhanced Funding Recommendations

### For Enhanced Bundler Bot:
- Main wallet: 0.1 SOL
- Each of 8 sub-wallets: 0.02 SOL
- Total: ~0.26 SOL

### For Enhanced Volume Bot:
- Main wallet: 0.5-1 SOL (for distribution to sub-wallets)
- Each of 8 sub-wallets: 0.02 SOL
- Total: ~0.66-1.16 SOL

## 🆘 Enhanced Troubleshooting

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

5. **"Enhanced features not working"**
   - Check that you're using the enhanced scripts
   - Verify configuration parameters are set correctly

## 📊 Enhanced Monitoring

### Enhanced Bundler Bot Success Indicators:
- Token creation transaction confirmed
- 8 buy transactions with randomized delays
- Variable SOL amounts used
- Token appears on PumpFun website

### Enhanced Volume Bot Success Indicators:
- Telegram bot responds to commands
- 8 sub-wallets are created and funded
- 400 trades executed over 30 minutes
- Randomized intervals between cycles
- Variable SOL amounts used
- Volume increasing on PumpFun with natural patterns

## 🎯 Enhanced Pro Tips

1. **Start Small**: Test with small amounts first
2. **Monitor Patterns**: Watch for natural-looking volume patterns
3. **Adjust Timing**: Fine-tune intervals based on market conditions
4. **Keep Records**: Track your token's performance and bot activity
5. **Backup Wallets**: Keep secure backups of your wallet files
6. **Randomization**: The enhanced randomization makes activity appear more natural
7. **Duration**: 30-minute spread prevents suspicious clustering
8. **Variable Amounts**: Different SOL amounts avoid uniform spikes

## 🔧 Enhanced Configuration Files

The enhanced setup includes these optimized files:
- `bundler-wallets.json` (8 wallets for bundling)
- `volume-wallets.json` (8 wallets for volume)
- `Pumpfun_Volume_Bot/.env` (Enhanced Volume Bot config)
- `pumpfun-bundler/.env` (Enhanced Bundler Bot config)
- `pumpfun-bundler/example/basic/enhanced-bundler.ts` (Enhanced bundler script)
- `Pumpfun_Volume_Bot/enhanced-volume-bot.ts` (Enhanced volume bot script)

---

**Ready to launch your PumpFun token with enhanced, natural-looking volume generation? Follow the steps above and you'll be creating organic trading patterns in no time! 🚀**
