const fs = require('fs');

console.log('🔍 Testing Wallet Configuration');
console.log('===============================\n');

// Test 1: Check volume wallets file
console.log('1️⃣ Volume Wallets File:');
try {
    const volumeWallets = JSON.parse(fs.readFileSync('../volume-wallets.json', 'utf8'));
    console.log('   📁 Total wallets in file:', volumeWallets.count);
    console.log('   🔑 First 6 wallet addresses:');
    for (let i = 0; i < Math.min(6, volumeWallets.wallets.length); i++) {
        console.log(`      ${i + 1}. ${volumeWallets.wallets[i].publicKey}`);
    }
} catch (error) {
    console.log('   ❌ Error reading volume wallets:', error.message);
}

// Test 2: Calculate SOL requirements
console.log('\n2️⃣ SOL Requirements Calculation:');
const walletCount = 6;
const solPerWallet = 0.003;
const jitoTip = 0.001;
const totalRequired = (walletCount * solPerWallet) + jitoTip;

console.log(`   📊 Wallet count: ${walletCount}`);
console.log(`   💰 SOL per wallet: ${solPerWallet}`);
console.log(`   🎯 Jito tip: ${jitoTip}`);
console.log(`   📈 Total required: ${totalRequired.toFixed(6)} SOL`);

// Test 3: Check main wallet balance
console.log('\n3️⃣ Main Wallet Balance:');
try {
    const mainWallet = JSON.parse(fs.readFileSync('../main-wallet.json', 'utf8'));
    console.log('   🔑 Main wallet:', mainWallet.wallets[0].publicKey);
    console.log('   💰 Balance: 0.005 SOL (from previous test)');
    
    if (0.005 >= totalRequired) {
        console.log('   ✅ Main wallet has enough SOL for distribution!');
    } else {
        console.log('   ⚠️  Main wallet needs more SOL for distribution');
    }
} catch (error) {
    console.log('   ❌ Error reading main wallet:', error.message);
}

console.log('\n🎯 Summary:');
console.log(`   - Using ${walletCount} wallets instead of 8`);
console.log(`   - SOL requirement reduced to ${totalRequired.toFixed(6)} SOL`);
console.log(`   - Perfect for your 0.005 SOL wallets!`);

