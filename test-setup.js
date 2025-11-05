const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');
require('dotenv').config();

console.log('🧪 Testing PumpFun Bot Setup');
console.log('============================\n');

// Test 1: Check main wallet
console.log('1️⃣ Testing Main Wallet...');
try {
    const mainWallet = JSON.parse(fs.readFileSync('../main-wallet.json', 'utf8'));
    const keypair = Keypair.fromSecretKey(bs58.decode(mainWallet.wallets[0].secretKey));
    console.log('   ✅ Main wallet loaded:', keypair.publicKey.toBase58());
} catch (error) {
    console.log('   ❌ Main wallet error:', error.message);
}

// Test 2: Check bundler wallets
console.log('\n2️⃣ Testing Bundler Wallets...');
try {
    const bundlerWallets = JSON.parse(fs.readFileSync('../bundler-wallets.json', 'utf8'));
    console.log('   ✅ Bundler wallets loaded:', bundlerWallets.count, 'wallets');
    console.log('   📋 First wallet:', bundlerWallets.wallets[0].publicKey);
} catch (error) {
    console.log('   ❌ Bundler wallets error:', error.message);
}

// Test 3: Check volume wallets
console.log('\n3️⃣ Testing Volume Wallets...');
try {
    const volumeWallets = JSON.parse(fs.readFileSync('../volume-wallets.json', 'utf8'));
    console.log('   ✅ Volume wallets loaded:', volumeWallets.count, 'wallets');
} catch (error) {
    console.log('   ❌ Volume wallets error:', error.message);
}

// Test 4: Check RPC connection
console.log('\n4️⃣ Testing RPC Connection...');
try {
    const connection = new Connection(process.env.RPC_URL, 'confirmed');
    console.log('   ✅ RPC URL configured');
    
    // Test with main wallet
    const mainWallet = JSON.parse(fs.readFileSync('../main-wallet.json', 'utf8'));
    const keypair = Keypair.fromSecretKey(bs58.decode(mainWallet.wallets[0].secretKey));
    
    connection.getBalance(keypair.publicKey).then(balance => {
        console.log('   💰 Main wallet balance:', (balance / LAMPORTS_PER_SOL).toFixed(6), 'SOL');
        
        if (balance > 0) {
            console.log('   ✅ Wallet has SOL - ready for testing!');
} else {
            console.log('   ⚠️  Wallet has no SOL - fund it first');
        }
    }).catch(error => {
        console.log('   ❌ Balance check failed:', error.message);
    });
    
} catch (error) {
    console.log('   ❌ RPC connection error:', error.message);
}

// Test 5: Check Telegram config
console.log('\n5️⃣ Testing Telegram Configuration...');
try {
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_ALLOWED_USER_IDS) {
        console.log('   ✅ Telegram bot token configured');
        console.log('   ✅ Allowed user IDs:', process.env.TELEGRAM_ALLOWED_USER_IDS);
} else {
        console.log('   ❌ Telegram configuration missing');
    }
} catch (error) {
    console.log('   ❌ Telegram config error:', error.message);
}

console.log('\n🎯 Test Summary:');
console.log('   - If all tests show ✅, your setup is ready!');
console.log('   - If any show ❌, fix those issues first');
console.log('   - With 0.005 SOL per wallet, you can test basic functionality');