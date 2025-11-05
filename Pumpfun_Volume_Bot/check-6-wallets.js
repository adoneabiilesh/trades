#!/usr/bin/env node

const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58').default;
const fs = require('fs');
require('dotenv').config();

// Load configuration
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!RPC_URL || !PRIVATE_KEY) {
    console.error('❌ Missing RPC_URL or PRIVATE_KEY in .env file');
    process.exit(1);
}

const connection = new Connection(RPC_URL, 'confirmed');
const userKeypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

async function checkWallets() {
    console.log('=== YOUR 6 WALLETS FOR THE BOT ===');
    console.log('');
    
    const mainBalance = await connection.getBalance(userKeypair.publicKey);
    console.log(`Main wallet: ${userKeypair.publicKey.toBase58()}`);
    console.log(`Main wallet balance: ${(mainBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
    console.log('');
    
    if (fs.existsSync('wallets.json')) {
        const walletsData = JSON.parse(fs.readFileSync('wallets.json', 'utf8'));
        console.log(`Sub-wallets (${walletsData.length}):`);
        
        for (let i = 0; i < walletsData.length; i++) {
            const wallet = Keypair.fromSecretKey(bs58.decode(walletsData[i]));
            const balance = await connection.getBalance(wallet.publicKey);
            console.log(`${i + 1}. ${wallet.publicKey.toBase58()} - ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
        }
    } else {
        console.log('No wallets.json found');
    }
    
    console.log('');
    console.log('=== READY TO START ===');
    console.log('1. Fund main wallet with 2 SOL');
    console.log('2. Run: npm run bot');
    console.log('3. Configure via Telegram');
    console.log('4. Bot will distribute 1 SOL to these 6 wallets');
    console.log('5. Bot will generate 0.99 SOL volume');
}

async function main() {
    try {
        await checkWallets();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
