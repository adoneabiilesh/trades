# Solana Wallet Generator

This tool generates multiple Solana wallets and saves them to a JSON file, providing the same functionality as the `slerf batch-gen` command.

## Features

- ✅ Generate multiple Solana wallets at once
- ✅ Save wallets to JSON file with metadata
- ✅ Cross-platform support (Windows, macOS, Linux)
- ✅ Command-line interface with options
- ✅ Security warnings and best practices
- ✅ Progress tracking during generation

## Installation

The required dependencies are already installed in your project:
- `@solana/web3.js` - Solana Web3 library
- `bs58` - Base58 encoding library

## Usage

### Method 1: Direct Node.js Command

```bash
# Generate 10 wallets and save to wallets.json
node wallet-generator.js --count 10 --output wallets.json

# Generate 5 wallets and save to my-wallets.json
node wallet-generator.js --count 5 --output my-wallets.json

# Show help
node wallet-generator.js --help
```

### Method 2: Windows Batch Script

```cmd
# Generate 10 wallets (default)
generate-wallets.bat

# Generate custom number of wallets
generate-wallets.bat --count 20 --output my-wallets.json

# Show help
generate-wallets.bat --help
```

### Method 3: PowerShell Script

```powershell
# Generate wallets using PowerShell
node wallet-generator.js --count 10 --output wallets.json
```

## Command Options

| Option | Description | Default |
|--------|-------------|---------|
| `--count <number>` | Number of wallets to generate | 1 |
| `--output <file>` | Output file name | wallets.json |
| `--help` | Show help message | - |

## Output Format

The generated JSON file contains:

```json
{
  "generated": "2025-09-17T11:40:27.798Z",
  "count": 10,
  "wallets": [
    {
      "id": 1,
      "publicKey": "99JM127YWeydbYLw7fEXQXD7hFkLi7m8MNZ6Bx75edrd",
      "secretKey": "2w32uEwafGnTNa9bDXNLHXJJZkuQNDyrygq188v2dFHXNQnH9yRNrg5q76AycNrckCdb4eRPfvRJ6RDyzLDY8mNV",
      "address": "99JM127YWeydbYLw7fEXQXD7hFkLi7m8MNZ6Bx75edrd"
    }
  ]
}
```

## Security Considerations

⚠️ **IMPORTANT SECURITY WARNINGS:**

1. **Private Keys**: The generated private keys are sensitive information. Never share them or commit them to version control.

2. **File Storage**: Store the `wallets.json` file securely:
   - Use encrypted storage
   - Keep backups in offline locations
   - Consider encrypting the file

3. **Network Security**: All wallet generation happens locally - no data is sent over the internet.

4. **Access Control**: Limit access to the generated wallet files.

## Examples

### Generate 10 wallets for testing
```bash
node wallet-generator.js --count 10 --output test-wallets.json
```

### Generate 100 wallets for airdrop
```bash
node wallet-generator.js --count 100 --output airdrop-wallets.json
```

### Generate wallets with custom naming
```bash
node wallet-generator.js --count 5 --output my-project-wallets.json
```

## Integration with Existing Code

You can also use the wallet generator programmatically:

```javascript
const { generateWallet, generateWallets } = require('./wallet-generator.js');

// Generate a single wallet
const wallet = generateWallet();
console.log('Public Key:', wallet.publicKey);

// Generate multiple wallets
const wallets = generateWallets(5);
console.log('Generated', wallets.length, 'wallets');
```

## Troubleshooting

### Common Issues

1. **"bs58.encode is not a function"**
   - The script includes fallback encoding methods
   - Try updating Node.js to version 20.18.0 or higher

2. **"Cannot find module '@solana/web3.js'"**
   - Run: `npm install @solana/web3.js bs58`

3. **Permission errors on Windows**
   - Run PowerShell or Command Prompt as Administrator
   - Or use the batch script: `generate-wallets.bat`

### File Permissions

If you encounter permission errors when writing files:
- Ensure you have write permissions in the current directory
- Try running the command from a different directory
- On Windows, run as Administrator if needed

## Alternative Tools

If you prefer other wallet generation methods:

1. **SlerfTools Online Generator**: https://slerf.tools/en-us/wallet-creator/solana
2. **Solana CLI**: `solana-keygen new --outfile wallet.json`
3. **Custom scripts**: Use the existing code in `pumpfun-bundler/example/basic/gen-keypair.ts`

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify Node.js and npm are properly installed
3. Ensure all dependencies are installed: `npm install`

---

**Note**: This tool replaces the `slerf batch-gen` command functionality with a custom implementation using standard Solana libraries.
