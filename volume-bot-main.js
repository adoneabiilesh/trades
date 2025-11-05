const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');

// Load configuration
const config = JSON.parse(fs.readFileSync('./config/bot.json', 'utf8'));
const wallets = JSON.parse(fs.readFileSync(`./${config.walletsFile}`, 'utf8'));

// Convert wallets to keypairs
const keypairs = wallets.map(wallet => {
  return Keypair.fromSecretKey(bs58.decode(wallet.secretKey));
});

console.log('🚀 Enhanced Volume Bot Starting...');
console.log(`📊 Configuration:`);
console.log(`   - Wallets: ${keypairs.length}`);
console.log(`   - Cycle Count: ${config.cycleCount}`);
console.log(`   - SOL Range: ${config.minCycleSizeSOL}-${config.maxCycleSizeSOL}`);
console.log(`   - Interval Range: ${config.minIntervalSec}-${config.maxIntervalSec}s`);
console.log(`   - Price Bump Range: ${config.priceBumpMinPct}-${config.priceBumpMaxPct}%`);

// Generate random silent pause indices
const totalCycles = config.cycleCount * keypairs.length;
const pauseIndices = [
  Math.floor(Math.random() * totalCycles),
  Math.floor(Math.random() * totalCycles)
].sort((a, b) => a - b);

console.log(`🔇 Silent pauses will occur at cycles: ${pauseIndices.join(', ')}`);

// Utility functions
function getRandomTradeSize() {
  return config.minCycleSizeSOL + Math.random() * (config.maxCycleSizeSOL - config.minCycleSizeSOL);
}

function getRandomInterval() {
  return config.minIntervalSec + Math.random() * (config.maxIntervalSec - config.minIntervalSec);
}

function getRandomPriceBump() {
  return config.priceBumpMinPct + Math.random() * (config.priceBumpMaxPct - config.priceBumpMinPct);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main volume generation loop
async function generateVolume() {
  let cycleIndex = 0;
  const startTime = Date.now();
  
  console.log('\n🔄 Starting volume generation...');
  
  for (let walletIndex = 0; walletIndex < keypairs.length; walletIndex++) {
    const wallet = keypairs[walletIndex];
    const walletName = wallets[walletIndex].name;
    
    console.log(`\n📝 Processing ${walletName}: ${wallet.publicKey.toBase58().substring(0, 8)}...`);
    
    for (let cycle = 0; cycle < config.cycleCount; cycle++) {
      cycleIndex++;
      
      // Check if this is a silent pause cycle
      if (pauseIndices.includes(cycleIndex)) {
        const pauseDuration = 120 + Math.random() * 60; // 120-180 seconds
        console.log(`🔇 Silent pause at cycle ${cycleIndex} for ${pauseDuration.toFixed(1)}s`);
        await sleep(pauseDuration * 1000);
        continue;
      }
      
      // Generate random trade parameters
      const tradeSize = getRandomTradeSize();
      const priceBump = getRandomPriceBump();
      
      console.log(`   Cycle ${cycle + 1}/${config.cycleCount}: ${tradeSize.toFixed(4)} SOL, ${priceBump.toFixed(2)}% bump`);
      
      // Simulate buy transaction
      console.log(`     🔄 Executing buy transaction...`);
      await sleep(100); // Simulate transaction time
      console.log(`     ✅ Buy completed`);
      
      // Simulate sell transaction
      console.log(`     🔄 Executing sell transaction...`);
      await sleep(100); // Simulate transaction time
      console.log(`     ✅ Sell completed`);
      
      // Random interval before next trade (except for last cycle of last wallet)
      if (!(walletIndex === keypairs.length - 1 && cycle === config.cycleCount - 1)) {
        const interval = getRandomInterval();
        console.log(`     ⏱️  Waiting ${interval.toFixed(1)}s before next trade...`);
        await sleep(interval * 1000);
      }
    }
  }
  
  const totalDuration = (Date.now() - startTime) / 1000 / 60;
  console.log(`\n🎉 Volume generation completed!`);
  console.log(`📊 Total cycles: ${cycleIndex}`);
  console.log(`⏱️  Duration: ${totalDuration.toFixed(2)} minutes`);
  console.log(`🔇 Silent pauses: ${pauseIndices.length}`);
}

// Start the volume generation
generateVolume().catch(console.error);
