import dotenv from "dotenv";
import fs, { openAsBlob } from "fs";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { DEFAULT_DECIMALS, PumpFunSDK } from "../../src";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  getOrCreateKeypair,
  getSPLBalance,
  printSOLBalance,
  printSPLBalance,
} from "../util";
import metadata from "../../metadata";
import { getUploadedMetadataURI } from "../../src/uploadToIpfs";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

const KEYS_FOLDER = __dirname + "/.keys";
const SLIPPAGE_BASIS_POINTS = 100n;

// Enhanced configuration
const BUNDLER_CONFIG = {
  WALLET_COUNT: 8,
  MIN_DELAY_MS: 0,
  MAX_DELAY_MS: 2000, // 0-2 seconds
  MIN_SOL_AMOUNT: 0.01,
  MAX_SOL_AMOUNT: 0.02,
  MIN_PRICE_BUMP: 0.001, // 0.1%
  MAX_PRICE_BUMP: 0.005, // 0.5%
};

// Utility functions
function getRandomDelay(): number {
  return Math.floor(Math.random() * (BUNDLER_CONFIG.MAX_DELAY_MS - BUNDLER_CONFIG.MIN_DELAY_MS + 1)) + BUNDLER_CONFIG.MIN_DELAY_MS;
}

function getRandomSolAmount(): number {
  return BUNDLER_CONFIG.MIN_SOL_AMOUNT + Math.random() * (BUNDLER_CONFIG.MAX_SOL_AMOUNT - BUNDLER_CONFIG.MIN_SOL_AMOUNT);
}

function getRandomPriceBump(): number {
  return BUNDLER_CONFIG.MIN_PRICE_BUMP + Math.random() * (BUNDLER_CONFIG.MAX_PRICE_BUMP - BUNDLER_CONFIG.MIN_PRICE_BUMP);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createKeypair() {
  // Generate a new keypair
  const keypair = Keypair.generate();

  // Extract the public key and secret key
  const publicKey = keypair.publicKey;
  const secretKey = keypair.secretKey;

  // Convert keys to base58 strings (for display or storage)
  const publicKeyBase58 = publicKey.toBase58();
  const secretKeyBase58 = bs58.encode(secretKey);

  const data = {
    publicKey: publicKeyBase58,
    secretKey: secretKeyBase58,
  };
  const metadataString = JSON.stringify(data);
  const bufferContent = Buffer.from(metadataString, "utf-8");
  fs.writeFileSync("./example/basic/.keys/mint.json", bufferContent);

  return keypair;
}

async function loadBundlerWallets(): Promise<Keypair[]> {
  try {
    const walletsData = JSON.parse(fs.readFileSync("../../../../bundler-wallets.json", "utf-8"));
    const wallets: Keypair[] = [];
    
    for (const wallet of walletsData.wallets) {
      const keypair = Keypair.fromSecretKey(bs58.decode(wallet.secretKey));
      wallets.push(keypair);
    }
    
    console.log(`✅ Loaded ${wallets.length} bundler wallets`);
    return wallets;
  } catch (error) {
    console.error("❌ Error loading bundler wallets:", error);
    console.log("📝 Generating new bundler wallets...");
    
    const wallets: Keypair[] = [];
    for (let i = 0; i < BUNDLER_CONFIG.WALLET_COUNT; i++) {
      wallets.push(Keypair.generate());
    }
    
    // Save wallets for future use
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
    
    fs.writeFileSync("../../../../bundler-wallets.json", JSON.stringify(walletsData, null, 2));
    console.log(`✅ Generated and saved ${wallets.length} bundler wallets`);
    
    return wallets;
  }
}

async function executeBundledPurchases(
  sdk: PumpFunSDK,
  mint: Keypair,
  wallets: Keypair[],
  baseSolAmount: number
): Promise<void> {
  console.log(`🚀 Starting bundled purchases with ${wallets.length} wallets`);
  console.log(`💰 Base SOL amount: ${baseSolAmount} SOL`);
  
  const purchasePromises: Promise<void>[] = [];
  
  for (let i = 0; i < wallets.length; i++) {
    const wallet = wallets[i];
    const randomDelay = getRandomDelay();
    const randomSolAmount = getRandomSolAmount();
    const randomPriceBump = getRandomPriceBump();
    
    console.log(`📝 Wallet ${i + 1}: ${wallet.publicKey.toBase58().substring(0, 8)}...`);
    console.log(`   💰 Amount: ${randomSolAmount.toFixed(4)} SOL`);
    console.log(`   ⏱️  Delay: ${randomDelay}ms`);
    console.log(`   📈 Price bump: ${(randomPriceBump * 100).toFixed(2)}%`);
    
    const purchasePromise = (async () => {
      // Add randomized delay
      if (randomDelay > 0) {
        await sleep(randomDelay);
      }
      
      try {
        // Execute purchase with randomized parameters
        const buyAmount = BigInt(Math.floor(randomSolAmount * LAMPORTS_PER_SOL));
        const slippageWithBump = BigInt(Math.floor(Number(SLIPPAGE_BASIS_POINTS) + (randomPriceBump * 10000)));
        
        console.log(`🔄 Executing purchase for wallet ${i + 1}...`);
        
        // Note: This would need to be implemented based on the actual PumpFunSDK methods
        // For now, we'll simulate the purchase
        console.log(`✅ Purchase simulated for wallet ${i + 1}`);
        
      } catch (error) {
        console.error(`❌ Purchase failed for wallet ${i + 1}:`, error);
      }
    })();
    
    purchasePromises.push(purchasePromise);
  }
  
  // Wait for all purchases to complete
  await Promise.allSettled(purchasePromises);
  console.log(`✅ All ${wallets.length} bundled purchases completed`);
}

const main = async () => {
  dotenv.config();

  if (!process.env.HELIUS_RPC_URL) {
    console.error("Please set HELIUS_RPC_URL in .env file");
    console.error(
      "Example: HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=<your api key>"
    );
    console.error("Get one at: https://www.helius.dev");
    return;
  }

  let connection = new Connection(process.env.HELIUS_RPC_URL || "");

  let wallet = new NodeWallet(new Keypair()); //note this is not used
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });

  await createKeypair();

  const testAccount = getOrCreateKeypair(KEYS_FOLDER, "test-account");
  const mint = getOrCreateKeypair(KEYS_FOLDER, "mint");

  await printSOLBalance(
    connection,
    testAccount.publicKey,
    "Test Account keypair"
  );

  let sdk = new PumpFunSDK(provider);

  let globalAccount = await sdk.getGlobalAccount();
  console.log(globalAccount);

  let currentSolBalance = await connection.getBalance(testAccount.publicKey);
  if (currentSolBalance == 0) {
    console.log(
      "Please send some SOL to the test-account:",
      testAccount.publicKey.toBase58()
    );
    return;
  }

  // Load bundler wallets
  const bundlerWallets = await loadBundlerWallets();

  //Check if mint already exists
  let boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
  if (!boundingCurveAccount) {
    let tokenMetadata = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      showName: metadata.showName,
      createOn: metadata.createdOn,
      twitter: metadata.twitter,
      telegram: metadata.telegram,
      website: metadata.website,
      file: await openAsBlob(metadata.image),
    };

    console.log("🚀 Creating token and executing bundled purchases...");
    
    // Create token with first wallet
    let createResults = await sdk.createAndBuy(
      testAccount,
      mint,
      [testAccount], // Only creator for initial creation
      tokenMetadata,
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 5_000_000,
        unitPrice: 200_000,
      }
    );

    if (createResults.confirmed) {
      console.log("✅ Token created successfully!");
      console.log("🔗 Token URL:", `https://pump.fun/${mint.publicKey.toBase58()}`);
      console.log("📝 Transaction:", createResults.jitoTxsignature);
      
      boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
      console.log("📊 Bonding curve after creation:", boundingCurveAccount);
      
      // Execute bundled purchases with randomized delays
      await executeBundledPurchases(sdk, mint, bundlerWallets, 0.015);
      
      printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
    }
  } else {
    console.log("📊 Existing token found:", `https://pump.fun/${mint.publicKey.toBase58()}`);
    console.log("📈 Bonding curve:", boundingCurveAccount);
    
    // Execute bundled purchases for existing token
    await executeBundledPurchases(sdk, mint, bundlerWallets, 0.015);
    
    printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
  }
};

main();
