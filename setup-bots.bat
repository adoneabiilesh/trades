@echo off
echo 🚀 PumpFun Bots Setup Assistant
echo ================================
echo.

REM Check if we're in the right directory
if not exist "Pumpfun_Volume_Bot" (
    echo ❌ Error: Pumpfun_Volume_Bot directory not found
    echo    Please run this script from the Tradees directory
    pause
    exit /b 1
)

if not exist "pumpfun-bundler" (
    echo ❌ Error: pumpfun-bundler directory not found
    echo    Please run this script from the Tradees directory
    pause
    exit /b 1
)

echo ✅ Found both bot directories
echo.

REM Step 1: Generate wallets
echo 📝 Step 1: Generating wallets...
echo    Generating main wallet for Volume Bot...
node wallet-generator.js --count 1 --output main-wallet.json
if %errorlevel% neq 0 (
    echo ❌ Error generating main wallet
    pause
    exit /b 1
)

echo    Generating 20 wallets for Bundler Bot...
node wallet-generator.js --count 20 --output bundler-wallets.json
if %errorlevel% neq 0 (
    echo ❌ Error generating bundler wallets
    pause
    exit /b 1
)

echo ✅ Wallets generated successfully!
echo.

REM Step 2: Copy configuration templates
echo 📝 Step 2: Setting up configuration files...
if exist "volume-bot-config.env" (
    copy "volume-bot-config.env" "Pumpfun_Volume_Bot\.env" >nul
    echo    ✅ Volume Bot config template copied
)

if exist "bundler-bot-config.env" (
    copy "bundler-bot-config.env" "pumpfun-bundler\.env" >nul
    echo    ✅ Bundler Bot config template copied
)

echo ✅ Configuration files set up!
echo.

REM Step 3: Install dependencies
echo 📝 Step 3: Installing dependencies...
echo    Installing Volume Bot dependencies...
cd Pumpfun_Volume_Bot
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error installing Volume Bot dependencies
    pause
    exit /b 1
)

cd ..
echo    Installing Bundler Bot dependencies...
cd pumpfun-bundler
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error installing Bundler Bot dependencies
    pause
    exit /b 1
)

cd ..
echo ✅ Dependencies installed!
echo.

REM Step 4: Display next steps
echo 🎉 Setup Complete! Next Steps:
echo ===============================
echo.
echo 1. 📝 Configure your environment files:
echo    - Edit Pumpfun_Volume_Bot\.env with your RPC URL, private key, and Telegram bot details
echo    - Edit pumpfun-bundler\.env with your RPC URL
echo.
echo 2. 💰 Fund your wallets:
echo    - Fund main-wallet.json with SOL (recommended: 0.5-1 SOL)
echo    - Fund bundler-wallets.json wallets with SOL (recommended: 0.01 SOL each)
echo.
echo 3. 🚀 Launch your token (Bundler Bot):
echo    cd pumpfun-bundler
echo    REM Edit metadata.ts with your token details
echo    npx ts-node example/basic/index.ts
echo.
echo 4. 📈 Start volume generation (Volume Bot):
echo    cd Pumpfun_Volume_Bot
echo    npm run bot
echo    REM Use Telegram commands to configure and start the bot
echo.
echo 📖 For detailed instructions, see: PUMPFUN_BOTS_SETUP_GUIDE.md
echo 🔧 Generated files:
echo    - main-wallet.json (for Volume Bot)
echo    - bundler-wallets.json (for Bundler Bot)
echo    - Pumpfun_Volume_Bot\.env (Volume Bot config)
echo    - pumpfun-bundler\.env (Bundler Bot config)
echo.
echo ⚠️  Remember to keep your private keys secure!
echo.
pause
