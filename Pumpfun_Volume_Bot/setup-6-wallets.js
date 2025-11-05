#!/usr/bin/env node

const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
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

async function checkBalances() {
    console.log('=== CURRENT BALANCE CHECK ===');
    
    const mainBalance = await connection.getBalance(userKeypair.publicKey);
    console.log(`Main wallet balance: ${(mainBalance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
    console.log(`Main wallet address: ${userKeypair.publicKey.toBase58()}`);
    
    if (fs.existsSync('wallets.json')) {
        const walletsData = JSON.parse(fs.readFileSync('wallets.json', 'utf8'));
        console.log(`\nSub-wallets found: ${walletsData.length}`);
        
        for (let i = 0; i < Math.min(6, walletsData.length); i++) {
            const wallet = Keypair.fromSecretKey(bs58.decode(walletsData[i]));
            const balance = await connection.getBalance(wallet.publicKey);
            console.log(`Wallet ${i + 1}: ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL`);
        }
    } else {
        console.log('\nNo wallets.json found. Bot will create 6 wallets when started.');
    }
    
    console.log('\n=== RECOMMENDED SETUP ===');
    console.log('1. Fund main wallet with 2 SOL total');
    console.log('2. Bot will distribute 1 SOL to 6 sub-wallets');
    console.log('3. Bot will keep 1 SOL in main wallet for fees');
    console.log('4. Expected volume: ~0.99 SOL');
    console.log('5. Expected cost: ~0.0575 SOL');
    console.log('6. Expected recovery: ~1.9425 SOL');
}

async function main() {
    try {
        await checkBalances();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
