# 🚀 Quick Start Guide - 6 Wallet Configuration

## ✅ Bot is Ready! Here's what I've configured:

### 📊 **Updated Configuration:**
- **Wallets:** 6 (instead of 8)
- **Cycles per wallet:** 11 (instead of 50)
- **Total cycles:** 66 buy/sell transactions
- **Duration:** 15 minutes
- **Expected volume:** 0.99 SOL
- **SOL range:** 0.01-0.02 SOL per cycle

### 💰 **Cost Breakdown:**
- **Total budget needed:** 2 SOL
- **Setup costs:** 0.0075 SOL
- **Volume generation:** 0.99 SOL
- **Expected recovery:** ~1.9425 SOL
- **Net loss:** Only 0.0575 SOL (2.9%)

## 🎯 **Step-by-Step Instructions:**

### 1. **Fund Your Main Wallet**
```
Send 2 SOL to: EEeC6Tzky2psp8TZJYLgZs78ucbjEk7dkjeSSYbUCBR9
```

### 2. **Start the Bot**
```bash
npm run bot
```

### 3. **Configure via Telegram**
1. Open Telegram and find your bot
2. Send `/settings`
3. **Set Token Address** (your PumpFun token CA)
4. **Set SOL Amount** (0.01-0.02 SOL per cycle)
5. **Click "Start Bot"**

### 4. **Monitor Progress**
- Bot will create 6 wallets automatically
- Bot will distribute 1 SOL to sub-wallets
- Bot will keep 1 SOL in main wallet for fees
- Bot will generate 0.99 SOL volume over 15 minutes

### 5. **After Completion**
- Bot will sell all tokens back to SOL
- Bot will collect SOL from all sub-wallets
- You'll recover ~1.9425 SOL

## 🔧 **Check Your Setup:**
```bash
node setup-6-wallets.js
```

## 📈 **Expected Results:**
- **Volume:** 0.99 SOL
- **Transactions:** 66 buy/sell cycles
- **Duration:** 15 minutes
- **Cost:** Only 0.0575 SOL
- **Recovery:** 1.9425 SOL

## ⚠️ **Important Notes:**
- Start bot immediately after token launch
- Monitor Telegram for status updates
- Bot will stop automatically when volume target reached
- Keep main wallet funded with 2 SOL minimum

## 🎉 **You're Ready to Launch!**
Your bot is optimized for maximum efficiency with minimal cost!
