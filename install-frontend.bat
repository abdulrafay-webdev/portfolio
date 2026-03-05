@echo off
echo ========================================
echo   Installing Frontend Dependencies
echo ========================================
echo.

cd /d "%~dp0frontend"

echo Installing npm packages...
echo This may take a few minutes...
echo.

npm install --legacy-peer-deps

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Installation Complete!
    echo ========================================
    echo.
    echo Next step: Run 'npm run dev' to start the frontend
) else (
    echo.
    echo ========================================
    echo   Installation Failed
    echo ========================================
    echo.
    echo Try running: npm install --legacy-peer-deps --force
)

pause
