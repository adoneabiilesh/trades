#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Enhanced PumpFun Bots Setup Assistant');
console.log('=========================================\n');

// Check if we're in the right directory
if (!fs.existsSync('Pumpfun_Volume_Bot') || !fs.existsSync('pumpfun-bundler')) {
    console.error('❌ Error: Please run this script from the Tradees directory');
    console.error('   Make sure both Pumpfun_Volume_Bot and pumpfun-bundler folders exist');
    process.exit(1);
}

console.log('✅ Found both bot directories\n');

// Enhanced configuration summary
console.log('📊 Enhanced Configuration Summary:');
console.log('==================================');
console.log('🔧 Bundler Bot:');
console.log('   - Wallets: 8');
console.log('   - Randomized delays: 0-2 seconds between purchases');
console.log('   - Variable SOL amounts: 0.01-0.02 SOL');
console.log('   - Price bumps: 0.1-0.5%');
console.log('');
console.log('📈 Volume Bot:');
console.log('   - Wallets: 8');
console.log('   - Cycles per wallet: 50');
console.log('   - Total trades: 400 (200 buys + 200 sells)');
console.log('   - Duration: 30 minutes');
console.log('   - Randomized intervals: 20-60 seconds');
console.log('   - Variable SOL amounts: 0.01-0.02 SOL');
console.log('   - Price bumps: 0.1-0.5%');
console.log('');

// Step 1: Generate enhanced wallets
console.log('📝 Step 1: Generating enhanced wallets...');
try {
    // Generate 8 wallets for bundler bot
    console.log('   Generating 8 wallets for Bundler Bot...');
    execSync('node wallet-generator.js --count 8 --output bundler-wallets.json', { stdio: 'inherit' });
    
    // Generate 8 wallets for volume bot
    console.log('   Generating 8 wallets for Volume Bot...');
    execSync('node wallet-generator.js --count 8 --output volume-wallets.json', { stdio: 'inherit' });
    
    console.log('✅ Enhanced wallets generated successfully!\n');
} catch (error) {
    console.error('❌ Error generating wallets:', error.message);
    process.exit(1);
}

// Step 2: Copy enhanced configuration templates
console.log('📝 Step 2: Setting up enhanced configuration files...');
try {
    // Copy enhanced volume bot config
    if (fs.existsSync('volume-bot-config.env')) {
        fs.copyFileSync('volume-bot-config.env', 'Pumpfun_Volume_Bot/.env');
        console.log('   ✅ Enhanced Volume Bot config template copied');
    }
    
    // Copy enhanced bundler bot config
    if (fs.existsSync('bundler-bot-config.env')) {
        fs.copyFileSync('bundler-bot-config.env', 'pumpfun-bundler/.env');
        console.log('   ✅ Enhanced Bundler Bot config template copied');
    }
    
    console.log('✅ Enhanced configuration files set up!\n');
} catch (error) {
    console.error('❌ Error setting up config files:', error.message);
    process.exit(1);
}

// Step 3: Install dependencies
console.log('📝 Step 3: Installing dependencies...');
try {
    console.log('   Installing Volume Bot dependencies...');
    execSync('cd Pumpfun_Volume_Bot && npm install', { stdio: 'inherit' });
    
    console.log('   Installing Bundler Bot dependencies...');
    execSync('cd pumpfun-bundler && npm install', { stdio: 'inherit' });
    
    console.log('✅ Dependencies installed!\n');
} catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
}

// Step 4: Display enhanced setup instructions
console.log('🎉 Enhanced Setup Complete! Next Steps:');
console.log('=======================================\n');

console.log('1. 📝 Configure your enhanced environment files:');
console.log('   - Edit Pumpfun_Volume_Bot/.env with your RPC URL, private key, and Telegram bot details');
console.log('   - Edit pumpfun-bundler/.env with your RPC URL');
console.log('   - All enhanced parameters are pre-configured!\n');

console.log('2. 💰 Fund your wallets:');
console.log('   - Fund bundler-wallets.json wallets with SOL (recommended: 0.02 SOL each = 0.16 SOL total)');
console.log('   - Fund volume-wallets.json wallets with SOL (recommended: 0.02 SOL each = 0.16 SOL total)');
console.log('   - Fund your main wallet with SOL (recommended: 0.5-1 SOL for distribution)\n');

console.log('3. 🚀 Launch your token with enhanced bundling:');
console.log('   cd pumpfun-bundler');
console.log('   # Edit metadata.ts with your token details');
console.log('   npx ts-node example/basic/enhanced-bundler.ts');
console.log('   # This will create your token and execute 8 bundled purchases with randomized delays\n');

console.log('4. 📈 Start enhanced volume generation:');
console.log('   cd Pumpfun_Volume_Bot');
console.log('   npm run bot');
console.log('   # Use Telegram commands to configure and start the enhanced volume bot');
console.log('   # The bot will execute 400 trades (200 buys + 200 sells) over 30 minutes\n');

console.log('📊 Enhanced Features Summary:');
console.log('=============================');
console.log('🔧 Bundler Bot Enhancements:');
console.log('   ✅ 8 wallets instead of 20');
console.log('   ✅ Randomized delays (0-2s) between purchases');
console.log('   ✅ Variable SOL amounts (0.01-0.02 SOL)');
console.log('   ✅ Price bumps (0.1-0.5%)');
console.log('');
console.log('📈 Volume Bot Enhancements:');
console.log('   ✅ 8 wallets for volume generation');
console.log('   ✅ 50 cycles per wallet (400 total trades)');
console.log('   ✅ 30-minute duration');
console.log('   ✅ Randomized intervals (20-60s)');
console.log('   ✅ Variable SOL amounts (0.01-0.02 SOL)');
console.log('   ✅ Price bumps (0.1-0.5%)');
console.log('   ✅ Unpredictable chart movement');
console.log('');

console.log('📖 For detailed instructions, see: PUMPFUN_BOTS_SETUP_GUIDE.md');
console.log('🔧 Generated files:');
console.log('   - bundler-wallets.json (8 wallets for bundling)');
console.log('   - volume-wallets.json (8 wallets for volume)');
console.log('   - Pumpfun_Volume_Bot/.env (Enhanced Volume Bot config)');
console.log('   - pumpfun-bundler/.env (Enhanced Bundler Bot config)');
console.log('   - pumpfun-bundler/example/basic/enhanced-bundler.ts (Enhanced bundler script)');
console.log('   - Pumpfun_Volume_Bot/enhanced-volume-bot.ts (Enhanced volume bot script)');
console.log('');

console.log('⚠️  Security Reminders:');
console.log('   - Keep your private keys secure and never share them');
console.log('   - Consider encrypting the output files');
console.log('   - Store backups in secure, offline locations');
console.log('   - Test with small amounts first');
console.log('');

console.log('🎯 Pro Tips:');
console.log('   - The randomized delays make transactions appear more natural');
console.log('   - Variable SOL amounts avoid uniform spikes on the chart');
console.log('   - Price bumps mimic small market reactions');
console.log('   - 30-minute duration spreads activity naturally');
console.log('   - Monitor your bots during initial runs');
console.log('');

console.log('🚀 Ready to launch with enhanced features!');
