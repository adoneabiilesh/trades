const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');

// Load configuration
const config = JSON.parse(fs.readFileSync('./config/bot.json', 'utf8'));
const wallets = JSON.parse(fs.readFileSync(`./${config.walletsFile}`, 'utf8'));

// Ensure exactly 8 wallets
if (wallets.length !== 8) {
  console.error('Error: wallets.json must contain exactly 8 wallets');
  process.exit(1);
}

// Validate wallet format
for (let i = 0; i < wallets.length; i++) {
  const wallet = wallets[i];
  if (!wallet.name || !wallet.secretKey) {
    console.error(`Error: Wallet ${i + 1} missing name or secretKey`);
    process.exit(1);
  }
  if (wallet.name !== `wallet${i + 1}`) {
    console.error(`Error: Wallet ${i + 1} should be named "wallet${i + 1}"`);
    process.exit(1);
  }
}

console.log('✅ Wallet validation passed - exactly 8 wallets found');

// Convert wallets to keypairs
const keypairs = wallets.map(wallet => {
  try {
    return Keypair.fromSecretKey(bs58.decode(wallet.secretKey));
  } catch (error) {
    console.error(`Error decoding secret key for ${wallet.name}:`, error.message);
    process.exit(1);
  }
});

console.log(`✅ Loaded ${keypairs.length} wallets`);

// Simulate bundle execution with random delays
async function executeBundle() {
  console.log('🚀 Starting bundle execution with randomized delays...');
  
  for (let i = 0; i < keypairs.length; i++) {
    const wallet = keypairs[i];
    const walletName = wallets[i].name;
    
    console.log(`📝 Processing ${walletName}: ${wallet.publicKey.toBase58().substring(0, 8)}...`);
    
    // Add random delay (0-2000ms) before each wallet's buy leg
    const delay = Math.floor(Math.random() * 2000);
    console.log(`   ⏱️  Random delay: ${delay}ms`);
    
    if (delay > 0) {
      await new Promise(r => setTimeout(r, delay));
    }
    
    // Simulate buy transaction
    console.log(`   🔄 Executing buy transaction for ${walletName}...`);
    
    // Simulate transaction time
    await new Promise(r => setTimeout(r, 100));
    
    console.log(`   ✅ Buy transaction completed for ${walletName}`);
  }
  
  console.log('🎉 Bundle execution completed with randomized delays');
}

// Run the bundle
executeBundle().catch(console.error);
