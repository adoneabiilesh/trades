import bs58 from 'bs58';
import * as web3 from '@solana/web3.js';
import fs from "fs";
import { 
    VOLUME_BOT_CONFIG, 
    getRandomInterval, 
    getRandomSolAmount, 
    getTimeWeightedSolAmount,
    getRandomPriceBump, 
    getRandomBundleDelay,
    sleep,
    connection,
    userKeypair
} from './src/enhanced-config';

const FEE_ATA_LAMPORTS = 2039280;

export class EnhancedPumpfunVbot {
  slippage: number;
  mint: web3.PublicKey;
  creator!: web3.PublicKey;
  bondingCurve!: web3.PublicKey;
  associatedBondingCurve!: web3.PublicKey;
  virtualTokenReserves!: number;
  virtualSolReserves!: number;
  keypairs!: web3.Keypair[];
  distributeAmountLamports: number;
  jitoTipAmountLamports: number;
  
  // Enhanced tracking
  private cycleCount: number = 0;
  private totalTrades: number = 0;
  private startTime: number = 0;
  private isRunning: boolean = false;

  constructor(
    CA: string,
    customDistributeAmountLamports?: number,
    customSlippage?: number
  ) {
    this.slippage = customSlippage || 0.5;
    this.mint = new web3.PublicKey(CA);
    this.distributeAmountLamports = customDistributeAmountLamports || VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT * web3.LAMPORTS_PER_SOL;
    this.jitoTipAmountLamports = 1000000; // 0.001 SOL

    if (this.slippage <= 0 || this.slippage > 0.5) {
      console.warn(`Warning: Slippage is set to ${this.slippage * 100}%. Recommended range is 0.1% to 50%.`);
    }
  }

  async getPumpData() {
    console.log("\n- Getting pump data...");
    try {
      const bondingCurvePDA = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("bonding-curve"), this.mint.toBuffer()],
        new web3.PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P")
      )[0];

      this.bondingCurve = bondingCurvePDA;
      this.associatedBondingCurve = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("associated-bonding-curve"), this.bondingCurve.toBuffer()],
        new web3.PublicKey("6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P")
      )[0];

      const bondingCurveAccount = await connection.getAccountInfo(this.bondingCurve);
      if (!bondingCurveAccount) {
        throw new Error("Bonding curve account not found");
      }

      const data = bondingCurveAccount.data;
      this.virtualSolReserves = Number(data.readBigUInt64LE(40));
      this.virtualTokenReserves = Number(data.readBigUInt64LE(48));

      console.log(`✅ Bonding curve: ${this.bondingCurve.toBase58()}`);
      console.log(`✅ Virtual SOL reserves: ${this.virtualSolReserves / web3.LAMPORTS_PER_SOL}`);
      console.log(`✅ Virtual token reserves: ${this.virtualTokenReserves.toLocaleString()}`);
    } catch (error) {
      console.error("❌ Error getting pump data:", error);
      throw error;
    }
  }

  createWallets() {
    console.log(`\n- Creating ${VOLUME_BOT_CONFIG.WALLET_COUNT} wallets...`);
    const wallets: web3.Keypair[] = [];
    
    for (let i = 0; i < VOLUME_BOT_CONFIG.WALLET_COUNT; i++) {
      wallets.push(web3.Keypair.generate());
    }

    const walletsData = {
      generated: new Date().toISOString(),
      count: wallets.length,
      wallets: wallets.map((wallet, index) => ({
        id: index + 1,
        publicKey: wallet.publicKey.toBase58(),
        secretKey: bs58.encode(wallet.secretKey),
        address: wallet.publicKey.toBase58()
      }))
    };

    fs.writeFileSync('volume-wallets.json', JSON.stringify(walletsData, null, 2));
    console.log(`✅ Created ${wallets.length} wallets and saved to volume-wallets.json`);
  }

  loadWallets() {
    console.log("\n- Loading wallets...");
    try {
      const walletsData = JSON.parse(fs.readFileSync('volume-wallets.json', 'utf-8'));
      this.keypairs = walletsData.wallets.map((wallet: any) => 
        web3.Keypair.fromSecretKey(bs58.decode(wallet.secretKey))
      );
      console.log(`✅ Loaded ${this.keypairs.length} wallets`);
    } catch (error) {
      console.error("❌ Error loading wallets:", error);
      throw error;
    }
  }

  async distributeSOL() {
    console.log("\n- Distributing SOL to wallets...");
    const distributeAmount = this.distributeAmountLamports;
    
    for (let i = 0; i < this.keypairs.length; i++) {
      const wallet = this.keypairs[i];
      const randomAmount = getRandomSolAmount() * web3.LAMPORTS_PER_SOL;
      
      try {
        const transaction = new web3.Transaction().add(
          web3.SystemProgram.transfer({
            fromPubkey: userKeypair.publicKey,
            toPubkey: wallet.publicKey,
            lamports: Math.floor(randomAmount),
          })
        );

        const signature = await web3.sendAndConfirmTransaction(
          connection,
          transaction,
          [userKeypair]
        );

        console.log(`✅ Distributed ${(randomAmount / web3.LAMPORTS_PER_SOL).toFixed(4)} SOL to wallet ${i + 1}: ${signature}`);
        
        // Add random delay between distributions
        const delay = getRandomBundleDelay();
        if (delay > 0) {
          await sleep(delay);
        }
      } catch (error) {
        console.error(`❌ Error distributing SOL to wallet ${i + 1}:`, error);
      }
    }
  }

  async executeVolumeCycle() {
    if (!this.isRunning) return;
    
    this.cycleCount++;
    console.log(`\n🔄 Starting volume cycle ${this.cycleCount}/${VOLUME_BOT_CONFIG.TOTAL_CYCLES}`);
    
    const cycleStartTime = Date.now();
    const elapsedMinutes = (Date.now() - this.startTime) / (1000 * 60);
    
    for (let i = 0; i < this.keypairs.length; i++) {
      if (!this.isRunning) break;
      
      const wallet = this.keypairs[i];
      
      // Front-load larger trades in first 5 minutes
      let solAmount;
      if (elapsedMinutes <= 5) {
        // Front-loading: Use time-weighted SOL amount for bigger trades early
        solAmount = getTimeWeightedSolAmount(elapsedMinutes, 5);
        console.log(`🚀 FRONT-LOADING: Using larger trade amount for first 5 minutes`);
      } else {
        // Normal randomization after 5 minutes
        solAmount = getRandomSolAmount();
      }
      
      const randomPriceBump = getRandomPriceBump();
      
      console.log(`📝 Wallet ${i + 1}: ${wallet.publicKey.toBase58().substring(0, 8)}...`);
      console.log(`   💰 Amount: ${solAmount.toFixed(4)} SOL ${elapsedMinutes <= 5 ? '(FRONT-LOADED)' : ''}`);
      console.log(`   📈 Price bump: ${(randomPriceBump * 100).toFixed(2)}%`);
      console.log(`   ⏰ Elapsed: ${elapsedMinutes.toFixed(1)} minutes`);
      
      try {
        // Execute buy transaction
        await this.executeBuyTransaction(wallet, solAmount, randomPriceBump);
        this.totalTrades++;
        
        // Add random delay between wallets
        const delay = getRandomBundleDelay();
        if (delay > 0) {
          await sleep(delay);
        }
        
        // Execute sell transaction
        await this.executeSellTransaction(wallet, randomPriceBump);
        this.totalTrades++;
        
        console.log(`✅ Completed buy/sell cycle for wallet ${i + 1}`);
        
      } catch (error) {
        console.error(`❌ Error in volume cycle for wallet ${i + 1}:`, error);
      }
    }
    
    const cycleDuration = Date.now() - cycleStartTime;
    console.log(`✅ Volume cycle ${this.cycleCount} completed in ${(cycleDuration / 1000).toFixed(2)}s`);
    console.log(`📊 Total trades executed: ${this.totalTrades}`);
  }

  private async executeBuyTransaction(wallet: web3.Keypair, solAmount: number, priceBump: number) {
    // This would implement the actual buy transaction logic
    // For now, we'll simulate it
    console.log(`🔄 Executing buy transaction: ${solAmount} SOL`);
    await sleep(100); // Simulate transaction time
  }

  private async executeSellTransaction(wallet: web3.Keypair, priceBump: number) {
    // This would implement the actual sell transaction logic
    // For now, we'll simulate it
    console.log(`🔄 Executing sell transaction`);
    await sleep(100); // Simulate transaction time
  }

  async startVolumeGeneration() {
    console.log("\n🚀 Starting enhanced volume generation...");
    console.log(`📊 Configuration:`);
    console.log(`   - Wallets: ${VOLUME_BOT_CONFIG.WALLET_COUNT}`);
    console.log(`   - Cycles per wallet: ${VOLUME_BOT_CONFIG.CYCLES_PER_WALLET}`);
    console.log(`   - Total cycles: ${VOLUME_BOT_CONFIG.TOTAL_CYCLES}`);
    console.log(`   - Duration: ${VOLUME_BOT_CONFIG.TOTAL_DURATION_MS / 1000 / 60} minutes`);
    console.log(`   - SOL range: ${VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT}-${VOLUME_BOT_CONFIG.MAX_SOL_AMOUNT} SOL`);
    console.log(`   - Interval range: ${VOLUME_BOT_CONFIG.MIN_INTERVAL_MS/1000}-${VOLUME_BOT_CONFIG.MAX_INTERVAL_MS/1000} seconds`);
    
    this.isRunning = true;
    this.startTime = Date.now();
    
    // Execute cycles with randomized intervals
    for (let cycle = 0; cycle < VOLUME_BOT_CONFIG.TOTAL_CYCLES && this.isRunning; cycle++) {
      await this.executeVolumeCycle();
      
      if (cycle < VOLUME_BOT_CONFIG.TOTAL_CYCLES - 1) {
        const randomInterval = getRandomInterval();
        console.log(`⏱️  Waiting ${(randomInterval / 1000).toFixed(1)}s before next cycle...`);
        await sleep(randomInterval);
      }
    }
    
    this.isRunning = false;
    const totalDuration = Date.now() - this.startTime;
    console.log(`\n✅ Volume generation completed!`);
    console.log(`📊 Final Statistics:`);
    console.log(`   - Total cycles: ${this.cycleCount}`);
    console.log(`   - Total trades: ${this.totalTrades}`);
    console.log(`   - Duration: ${(totalDuration / 1000 / 60).toFixed(2)} minutes`);
    console.log(`   - Average trades per minute: ${(this.totalTrades / (totalDuration / 1000 / 60)).toFixed(2)}`);
  }

  stopVolumeGeneration() {
    console.log("\n⏹️  Stopping volume generation...");
    this.isRunning = false;
  }

  async collectSOL() {
    console.log("\n💰 Collecting SOL from all wallets...");
    
    for (let i = 0; i < this.keypairs.length; i++) {
      const wallet = this.keypairs[i];
      
      try {
        const balance = await connection.getBalance(wallet.publicKey);
        if (balance > 0) {
          const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
              fromPubkey: wallet.publicKey,
              toPubkey: userKeypair.publicKey,
              lamports: balance - 5000, // Leave some for fees
            })
          );

          const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [wallet]
          );

          console.log(`✅ Collected ${(balance / web3.LAMPORTS_PER_SOL).toFixed(4)} SOL from wallet ${i + 1}: ${signature}`);
        }
      } catch (error) {
        console.error(`❌ Error collecting SOL from wallet ${i + 1}:`, error);
      }
    }
  }
}

// Example usage
async function main() {
  try {
    const bot = new EnhancedPumpfunVbot('YOUR_TOKEN_CONTRACT_ADDRESS_HERE');
    
    await bot.getPumpData();
    
    if (!fs.existsSync('volume-wallets.json')) {
      bot.createWallets();
    }
    bot.loadWallets();
    
    await bot.distributeSOL();
    await bot.startVolumeGeneration();
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Uncomment to run directly
// main();
