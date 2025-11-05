import dotenv from "dotenv";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

dotenv.config();

const main = async () => {
  console.log("🧪 Testing Phantom Wallet Connection");
  console.log("====================================\n");

  if (!process.env.HELIUS_RPC_URL) {
    console.error("❌ Please set HELIUS_RPC_URL in .env file");
    return;
  }

  if (!process.env.PHANTOM_PRIVATE_KEY) {
    console.error("❌ Please set PHANTOM_PRIVATE_KEY in .env file");
    console.error("Get this from Phantom wallet: Settings → Export Private Key");
    return;
  }

  try {
    // Create connection
    const connection = new Connection(process.env.HELIUS_RPC_URL, "confirmed");
    console.log("✅ Connected to Solana RPC");

    // Create keypair from Phantom wallet private key
    const phantomKeypair = Keypair.fromSecretKey(bs58.decode(process.env.PHANTOM_PRIVATE_KEY));
    console.log("✅ Phantom wallet loaded");
    console.log(`   Address: ${phantomKeypair.publicKey.toBase58()}`);

    // Check balance
    const balance = await connection.getBalance(phantomKeypair.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log(`   Balance: ${solBalance.toFixed(6)} SOL ($${(solBalance * 245).toFixed(2)})`);

    if (solBalance < 0.001) {
      console.log("⚠️ Warning: Low balance! You need at least 0.001 SOL for transactions");
    }

    // Test transaction capability
    console.log("\n🔍 Testing transaction capability...");
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    console.log("✅ Can get latest blockhash");

    // Check if account exists
    const accountInfo = await connection.getAccountInfo(phantomKeypair.publicKey);
    if (accountInfo) {
      console.log("✅ Account exists on Solana");
    } else {
      console.log("⚠️ Account not found (this is normal for new wallets)");
    }

    console.log("\n🎉 Phantom wallet test completed successfully!");
    console.log("\n📋 Next steps:");
    console.log("1. Your wallet is ready for PumpFun");
    console.log("2. You can create tokens directly on PumpFun website");
    console.log("3. Or use the Volume Bot to generate volume for existing tokens");
    console.log(`4. Your wallet address: ${phantomKeypair.publicKey.toBase58()}`);

  } catch (error) {
    console.error("❌ Error testing Phantom wallet:", error);
  }
};

main();
