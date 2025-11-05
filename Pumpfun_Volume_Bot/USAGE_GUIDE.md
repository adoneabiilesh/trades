# 🚀 PumpFun Volume Bot - Complete Usage Guide

## ✅ **Status: READY TO USE**

Your bot is now fully configured and optimized! All issues have been resolved.

---

## 🎯 **Quick Start**

### **1. Start the Bot**
```bash
npm run bot
```

### **2. Use Telegram Commands**
Send these commands to your Telegram bot:

- `/help` - Show all available commands
- `/settings` - Open the main control panel
- `/status` - Check current configuration

---

## ⚙️ **Configuration via Telegram**

### **Step 1: Open Settings**
Send `/settings` to your bot

### **Step 2: Configure Token**
1. Click "Set Token Address"
2. Enter a PumpFun token contract address
3. Example: `6YGUi1TCwEMLqSmFfPjT9dVp7RWGVye17kqvaqhwpump`

### **Step 3: Set SOL Amount**
1. Click "Set SOL Amount"
2. Enter amount per trade (e.g., `0.01`)
3. Recommended: 0.005-0.025 SOL

### **Step 4: Set Slippage**
1. Click "Set Slippage"
2. Enter percentage (e.g., `10` for 10%)
3. Recommended: 5-15%

---

## 🚀 **Running the Bot**

### **Start Trading**
1. Go to `/settings`
2. Click "Start Bot"
3. Bot will:
   - Create 6 sub-wallets
   - Distribute SOL to wallets
   - Execute buy/sell cycles
   - Generate volume

### **Monitor Progress**
- Bot sends updates via Telegram
- Check `/status` for current state
- Monitor wallet balances

### **Stop Trading**
1. Go to `/settings`
2. Click "Stop Bot"
3. Bot will stop gracefully

---

## 💰 **SOL Management**

### **Collect SOL Back**
1. Go to `/settings`
2. Click "Collect SOL"
3. Bot transfers all SOL from sub-wallets to main wallet

### **Sell All Tokens**
1. Go to `/settings`
2. Click "Sell All Tokens"
3. Bot sells all tokens held by sub-wallets

---

## 📊 **Optimized Configuration**

Your bot is now optimized with:

- ✅ **Fixed Telegram timeouts** - No more callback errors
- ✅ **Reduced slippage** - Better execution (10% default)
- ✅ **Optimized SOL amounts** - 0.005-0.025 SOL range
- ✅ **Better error handling** - More reliable operation
- ✅ **Improved performance** - Faster transaction processing

---

## 🔧 **Troubleshooting**

### **Bot Won't Start**
- Check your `.env` file has correct values
- Ensure RPC_URL is working
- Verify PRIVATE_KEY is valid

### **No Telegram Response**
- Check bot token is correct
- Verify your user ID is in allowed list
- Try `/help` command

### **Trading Fails**
- Ensure token address is valid PumpFun token
- Check main wallet has enough SOL
- Verify RPC connection is stable

---

## 💡 **Pro Tips**

1. **Start Small**: Test with small amounts first
2. **Monitor Closely**: Watch Telegram for updates
3. **Check Balances**: Use `/status` regularly
4. **Collect Profits**: Use "Collect SOL" after trading
5. **Valid Tokens**: Only use active PumpFun tokens

---

## 🎉 **You're All Set!**

Your bot is now:
- ✅ **Fully functional**
- ✅ **Optimized for performance**
- ✅ **Error-free**
- ✅ **Ready for trading**

**Start with**: `npm run bot` then `/settings` in Telegram!

---

## 📞 **Need Help?**

If you encounter any issues:
1. Check this guide first
2. Look at console output for errors
3. Verify your configuration
4. Test with small amounts

**Happy Trading!** 🚀
