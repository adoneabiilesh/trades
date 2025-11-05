#!/usr/bin/env node

const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58').default || require('bs58');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    count: 1,
    output: 'wallets.json'
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--count':
        options.count = parseInt(args[i + 1]) || 1;
        i++;
        break;
      case '--output':
        options.output = args[i + 1] || 'wallets.json';
        i++;
        break;
      case '--help':
        console.log(`
Usage: node wallet-generator.js [options]

Options:
  --count <number>    Number of wallets to generate (default: 1)
  --output <file>     Output file name (default: wallets.json)
  --help              Show this help message

Examples:
  node wallet-generator.js --count 10 --output wallets.json
  node wallet-generator.js --count 5 --output my-wallets.json
        `);
        process.exit(0);
        break;
    }
  }

  return options;
}

// Generate a single wallet
function generateWallet() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  
  // Convert secret key to base58 string
  let secretKey;
  try {
    secretKey = bs58.encode(keypair.secretKey);
  } catch (error) {
    // Fallback: convert to base64 and then encode
    secretKey = Buffer.from(keypair.secretKey).toString('base64');
  }
  
  return {
    publicKey,
    secretKey,
    address: publicKey // Alias for compatibility
  };
}

// Generate multiple wallets
function generateWallets(count) {
  const wallets = [];
  
  console.log(`Generating ${count} Solana wallet(s)...`);
  
  for (let i = 0; i < count; i++) {
    const wallet = generateWallet();
    wallets.push({
      id: i + 1,
      ...wallet
    });
    
    // Show progress
    process.stdout.write(`\rProgress: ${i + 1}/${count} wallets generated`);
  }
  
  console.log('\n✅ Wallet generation completed!');
  return wallets;
}

// Save wallets to file
function saveWallets(wallets, outputFile) {
  const outputPath = path.resolve(outputFile);
  const data = {
    generated: new Date().toISOString(),
    count: wallets.length,
    wallets: wallets
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`📁 Wallets saved to: ${outputPath}`);
  
  // Display summary
  console.log('\n📊 Summary:');
  console.log(`   Total wallets: ${wallets.length}`);
  console.log(`   Output file: ${outputFile}`);
  console.log(`   File size: ${fs.statSync(outputPath).size} bytes`);
  
  // Show first wallet as example
  if (wallets.length > 0) {
    console.log('\n🔑 Example wallet (first one):');
    console.log(`   Public Key: ${wallets[0].publicKey}`);
    console.log(`   Secret Key: ${wallets[0].secretKey.substring(0, 20)}...`);
  }
}

// Main function
function main() {
  try {
    const options = parseArgs();
    
    console.log('🚀 Solana Wallet Generator');
    console.log('==========================');
    
    const wallets = generateWallets(options.count);
    saveWallets(wallets, options.output);
    
    console.log('\n⚠️  Security Warning:');
    console.log('   - Keep your private keys secure and never share them');
    console.log('   - Consider encrypting the output file');
    console.log('   - Store backups in secure, offline locations');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateWallet, generateWallets };
