#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 PumpFun Bots Setup Assistant');
console.log('================================\n');

// Check if we're in the right directory
if (!fs.existsSync('Pumpfun_Volume_Bot') || !fs.existsSync('pumpfun-bundler')) {
    console.error('❌ Error: Please run this script from the Tradees directory');
    console.error('   Make sure both Pumpfun_Volume_Bot and pumpfun-bundler folders exist');
    process.exit(1);
}

console.log('✅ Found both bot directories\n');

// Step 1: Generate wallets
console.log('📝 Step 1: Generating wallets...');
try {
    // Generate main wallet for volume bot
    console.log('   Generating main wallet for Volume Bot...');
    execSync('node wallet-generator.js --count 1 --output main-wallet.json', { stdio: 'inherit' });
    
    // Generate bundler wallets
    console.log('   Generating 20 wallets for Bundler Bot...');
    execSync('node wallet-generator.js --count 20 --output bundler-wallets.json', { stdio: 'inherit' });
    
    console.log('✅ Wallets generated successfully!\n');
} catch (error) {
    console.error('❌ Error generating wallets:', error.message);
    process.exit(1);
}

// Step 2: Copy configuration templates
console.log('📝 Step 2: Setting up configuration files...');
try {
    // Copy volume bot config
    if (fs.existsSync('volume-bot-config.env')) {
        fs.copyFileSync('volume-bot-config.env', 'Pumpfun_Volume_Bot/.env');
        console.log('   ✅ Volume Bot config template copied');
    }
    
    // Copy bundler bot config
    if (fs.existsSync('bundler-bot-config.env')) {
        fs.copyFileSync('bundler-bot-config.env', 'pumpfun-bundler/.env');
        console.log('   ✅ Bundler Bot config template copied');
    }
    
    console.log('✅ Configuration files set up!\n');
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

// Step 4: Display next steps
console.log('🎉 Setup Complete! Next Steps:');
console.log('===============================\n');

console.log('1. 📝 Configure your environment files:');
console.log('   - Edit Pumpfun_Volume_Bot/.env with your RPC URL, private key, and Telegram bot details');
console.log('   - Edit pumpfun-bundler/.env with your RPC URL\n');

console.log('2. 💰 Fund your wallets:');
console.log('   - Fund main-wallet.json with SOL (recommended: 0.5-1 SOL)');
console.log('   - Fund bundler-wallets.json wallets with SOL (recommended: 0.01 SOL each)\n');

console.log('3. 🚀 Launch your token (Bundler Bot):');
console.log('   cd pumpfun-bundler');
console.log('   # Edit metadata.ts with your token details');
console.log('   npx ts-node example/basic/index.ts\n');

console.log('4. 📈 Start volume generation (Volume Bot):');
console.log('   cd Pumpfun_Volume_Bot');
console.log('   npm run bot');
console.log('   # Use Telegram commands to configure and start the bot\n');

console.log('📖 For detailed instructions, see: PUMPFUN_BOTS_SETUP_GUIDE.md');
console.log('🔧 Generated files:');
console.log('   - main-wallet.json (for Volume Bot)');
console.log('   - bundler-wallets.json (for Bundler Bot)');
console.log('   - Pumpfun_Volume_Bot/.env (Volume Bot config)');
console.log('   - pumpfun-bundler/.env (Bundler Bot config)\n');

console.log('⚠️  Remember to keep your private keys secure!');
