import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

// --- Essential Configurations - Bot will not run without these ---
if (!process.env.RPC_URL) {
    console.error("FATAL: RPC_URL not set in .env file. Please provide a Solana RPC endpoint.");
    process.exit(1);
}
export const RPC_URL = process.env.RPC_URL;
export const connection = new Connection(RPC_URL!, "confirmed");

if (!process.env.PRIVATE_KEY) {
    console.error("FATAL: PRIVATE_KEY not set in .env file. Please add your main wallet's secret key.");
    process.exit(1);
}
export const userKeypair = Keypair.fromSecretKey(base58.decode(process.env.PRIVATE_KEY!));

if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("FATAL: TELEGRAM_BOT_TOKEN not set in .env file.");
    process.exit(1);
}
export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const rawAllowedUserIds = process.env.TELEGRAM_ALLOWED_USER_IDS || "";
export const TELEGRAM_ALLOWED_USER_IDS = rawAllowedUserIds
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id) && id > 0);

if (TELEGRAM_ALLOWED_USER_IDS.length === 0 && process.env.NODE_ENV !== 'development_open') {
    console.error("CRITICAL SECURITY WARNING: TELEGRAM_ALLOWED_USER_IDS is not set or is invalid in .env. The Telegram bot will be open to anyone. THIS IS A HUGE SECURITY RISK. Set TELEGRAM_ALLOWED_USER_IDS or run with NODE_ENV=development_open if this is intentional for local testing ONLY.");
} else if (TELEGRAM_ALLOWED_USER_IDS.length > 0) {
    console.log("Telegram bot access restricted to user IDs:", TELEGRAM_ALLOWED_USER_IDS);
} else if (process.env.NODE_ENV === 'development_open') {
    console.warn("WARNING: Bot is running in open mode due to NODE_ENV=development_open. Ensure this is for local development only.");
}

// --- Enhanced Operational Parameters ---
export const VOLUME_BOT_CONFIG = {
    // Wallet configuration - OPTIMIZED FOR 2 SOL BUDGET
    WALLET_COUNT: 6,
    
    // Cycle configuration - OPTIMIZED FOR 1 SOL DISTRIBUTION
    CYCLES_PER_WALLET: 11,
    TOTAL_CYCLES: 66, // 6 wallets × 11 cycles = 66 total trades
    
    // Timing configuration (optimized for 1 SOL target)
    MIN_INTERVAL_MS: 10000, // 10 seconds
    MAX_INTERVAL_MS: 20000, // 20 seconds
    TOTAL_DURATION_MS: 15 * 60 * 1000, // 15 minutes
    
    // Volume limit configuration
    MAX_VOLUME_SOL: 1, // Stop when reaching 1 SOL volume
    VOLUME_CHECK_INTERVAL: 5, // Check volume every 5 trades
    
    // SOL amount configuration (optimized for 1 SOL distribution with front-loading)
    MIN_SOL_AMOUNT: 0.005, // Reduced minimum for more trades
    MAX_SOL_AMOUNT: 0.025, // Optimized range for better distribution
    
    // Price bump configuration
    MIN_PRICE_BUMP: 0.001, // 0.1%
    MAX_PRICE_BUMP: 0.005, // 0.5%
    
    // Delay configuration for bundling
    MIN_BUNDLE_DELAY_MS: 0,
    MAX_BUNDLE_DELAY_MS: 2000, // 0-2 seconds
};

// --- Default Operational Parameters (can be overridden by Telegram bot settings) ---
export const DefaultDistributeAmountLamports = VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT * LAMPORTS_PER_SOL;
export const DefaultJitoTipAmountLamports = parseInt(process.env.JITO_TIP_AMOUNT_LAMPORTS || "1000000");
export const DefaultCA = 'So11111111111111111111111111111111111111112'; // WSOL token address as default
export const DefaultSlippage = 0.1; // Reduced slippage for better execution

// Utility functions for randomization
export function getRandomInterval(): number {
    return Math.floor(Math.random() * (VOLUME_BOT_CONFIG.MAX_INTERVAL_MS - VOLUME_BOT_CONFIG.MIN_INTERVAL_MS + 1)) + VOLUME_BOT_CONFIG.MIN_INTERVAL_MS;
}

export function getRandomSolAmount(): number {
    return VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT + Math.random() * (VOLUME_BOT_CONFIG.MAX_SOL_AMOUNT - VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT);
}

export function getTimeWeightedSolAmount(elapsedMinutes: number, totalMinutes: number = 5): number {
    // Front-load big trades in first 5 minutes
    const frontLoadFactor = Math.max(0, 1 - (elapsedMinutes / 5)); // 1.0 at start, 0.0 after 5 minutes
    
    // Calculate weighted range - prioritize larger amounts in first 5 minutes
    const baseRange = VOLUME_BOT_CONFIG.MAX_SOL_AMOUNT - VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT;
    
    // Front-loading: Use 70-100% of max range in first 5 minutes
    const weightedMax = VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT + (baseRange * (0.7 + 0.3 * frontLoadFactor));
    
    return VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT + Math.random() * (weightedMax - VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT);
}

export function getRandomPriceBump(): number {
    return VOLUME_BOT_CONFIG.MIN_PRICE_BUMP + Math.random() * (VOLUME_BOT_CONFIG.MAX_PRICE_BUMP - VOLUME_BOT_CONFIG.MIN_PRICE_BUMP);
}

export function getRandomBundleDelay(): number {
    return Math.floor(Math.random() * (VOLUME_BOT_CONFIG.MAX_BUNDLE_DELAY_MS - VOLUME_BOT_CONFIG.MIN_BUNDLE_DELAY_MS + 1)) + VOLUME_BOT_CONFIG.MIN_BUNDLE_DELAY_MS;
}

export function checkVolumeLimit(currentVolume: number): boolean {
    return currentVolume >= VOLUME_BOT_CONFIG.MAX_VOLUME_SOL;
}

export function getVolumeProgress(currentVolume: number): { percentage: number, remaining: number } {
    const percentage = (currentVolume / VOLUME_BOT_CONFIG.MAX_VOLUME_SOL) * 100;
    const remaining = VOLUME_BOT_CONFIG.MAX_VOLUME_SOL - currentVolume;
    return { percentage: Math.min(percentage, 100), remaining: Math.max(remaining, 0) };
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log(`Enhanced Volume Bot Configuration:`);
console.log(`- Wallet Count: ${VOLUME_BOT_CONFIG.WALLET_COUNT}`);
console.log(`- Cycles per Wallet: ${VOLUME_BOT_CONFIG.CYCLES_PER_WALLET}`);
console.log(`- Total Cycles: ${VOLUME_BOT_CONFIG.TOTAL_CYCLES}`);
console.log(`- Interval Range: ${VOLUME_BOT_CONFIG.MIN_INTERVAL_MS/1000}-${VOLUME_BOT_CONFIG.MAX_INTERVAL_MS/1000}s`);
console.log(`- SOL Range: ${VOLUME_BOT_CONFIG.MIN_SOL_AMOUNT}-${VOLUME_BOT_CONFIG.MAX_SOL_AMOUNT} SOL`);
console.log(`- Price Bump Range: ${VOLUME_BOT_CONFIG.MIN_PRICE_BUMP*100}-${VOLUME_BOT_CONFIG.MAX_PRICE_BUMP*100}%`);
console.log(`- Bundle Delay Range: ${VOLUME_BOT_CONFIG.MIN_BUNDLE_DELAY_MS}-${VOLUME_BOT_CONFIG.MAX_BUNDLE_DELAY_MS}ms`);
console.log(`Default Jito Tip Amount: ${DefaultJitoTipAmountLamports} lamports`);

if (DefaultCA.includes('YOUR_DEFAULT') || DefaultCA.length < 32) {
    console.warn(`Warning: DefaultCA in src/enhanced-config.ts is a placeholder ("${DefaultCA}"). The Telegram bot will require you to set a token address via /settings.`);
}
