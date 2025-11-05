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

async function createKeypair() {
  // Generate a new keypair for the mint
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

  // Check if user provided Phantom wallet private key
  if (!process.env.PHANTOM_PRIVATE_KEY) {
    console.error("Please set PHANTOM_PRIVATE_KEY in .env file");
    console.error("Get this from Phantom wallet: Settings → Export Private Key");
    console.error("Add this line to your .env file:");
    console.error("PHANTOM_PRIVATE_KEY=your_phantom_private_key_here");
    return;
  }

  // Create keypair from Phantom wallet private key
  const phantomKeypair = Keypair.fromSecretKey(bs58.decode(process.env.PHANTOM_PRIVATE_KEY));
  
  let wallet = new NodeWallet(phantomKeypair);
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "finalized",
  });

  await createKeypair();

  // Use Phantom wallet as the main account
  const testAccount = phantomKeypair;
  const buyer = getOrCreateKeypair(KEYS_FOLDER, "buyer");
  const mint = getOrCreateKeypair(KEYS_FOLDER, "mint");

  console.log("🔗 Using Phantom Wallet:");
  console.log(`   Address: ${phantomKeypair.publicKey.toBase58()}`);
  
  await printSOLBalance(
    connection,
    testAccount.publicKey,
    "Phantom Wallet"
  );

  let sdk = new PumpFunSDK(provider);

  let globalAccount = await sdk.getGlobalAccount();
  console.log(globalAccount);

  let currentSolBalance = await connection.getBalance(testAccount.publicKey);
  if (currentSolBalance == 0) {
    console.log(
      "Please send some SOL to your Phantom wallet:",
      testAccount.publicKey.toBase58()
    );
    return;
  }

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

    console.log("🚀 Creating token with Phantom wallet...");
    
    let createResults = await sdk.createAndBuy(
      testAccount,
      mint,
      [testAccount, buyer], // buyers
      tokenMetadata,
      BigInt(0.0001 * LAMPORTS_PER_SOL),
      SLIPPAGE_BASIS_POINTS,
      {
        unitLimit: 5_000_000,
        unitPrice: 200_000,
      }
    );

    if (createResults && createResults.confirmed) {
      console.log("✅ Token created successfully!");
      console.log("🔗 Token URL:", `https://pump.fun/${mint.publicKey.toBase58()}`);
      console.log("📝 Transaction:", createResults.jitoTxsignature);
      boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
      console.log("📊 Bonding curve after create and buy", boundingCurveAccount);
      printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
    } else {
      console.log("⚠️ Token creation may have failed or returned unexpected result");
      console.log("📊 Create results:", createResults);
      
      // Check if token was created anyway
      boundingCurveAccount = await sdk.getBondingCurveAccount(mint.publicKey);
      if (boundingCurveAccount) {
        console.log("✅ Token was created successfully!");
        console.log("🔗 Token URL:", `https://pump.fun/${mint.publicKey.toBase58()}`);
        console.log("📊 Bonding curve:", boundingCurveAccount);
        printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
      }
    }
  } else {
    console.log("📊 Existing token found:", `https://pump.fun/${mint.publicKey.toBase58()}`);
    console.log("📈 Bonding curve:", boundingCurveAccount);
    printSPLBalance(connection, mint.publicKey, testAccount.publicKey);
  }
};

main();
