@echo off
echo Solana Wallet Generator
echo =====================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Default values
set COUNT=10
set OUTPUT=wallets.json

REM Parse command line arguments
:parse_args
if "%1"=="--count" (
    set COUNT=%2
    shift
    shift
    goto parse_args
)
if "%1"=="--output" (
    set OUTPUT=%2
    shift
    shift
    goto parse_args
)
if "%1"=="--help" (
    echo Usage: generate-wallets.bat [options]
    echo.
    echo Options:
    echo   --count ^<number^>    Number of wallets to generate (default: 10)
    echo   --output ^<file^>     Output file name (default: wallets.json)
    echo   --help               Show this help message
    echo.
    echo Examples:
    echo   generate-wallets.bat --count 10 --output wallets.json
    echo   generate-wallets.bat --count 5 --output my-wallets.json
    pause
    exit /b 0
)
if not "%1"=="" (
    shift
    goto parse_args
)

echo Generating %COUNT% Solana wallet(s)...
echo Output file: %OUTPUT%
echo.

REM Run the wallet generator
node wallet-generator.js --count %COUNT% --output %OUTPUT%

if %errorlevel% equ 0 (
    echo.
    echo ✅ Wallet generation completed successfully!
    echo 📁 Check the %OUTPUT% file for your wallets
) else (
    echo.
    echo ❌ Wallet generation failed!
)

echo.
pause
