@echo off
echo ========================================
echo   Installing Backend Dependencies
echo ========================================
echo.

cd /d "%~dp0backend"

echo Installing Python packages...
echo This may take a few minutes...
echo.

pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Installation Complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Run: alembic upgrade head
    echo 2. Run: uvicorn src.main:app --reload
) else (
    echo.
    echo ========================================
    echo   Installation Failed
    echo ========================================
    echo.
    echo Try upgrading pip: python -m pip install --upgrade pip
    echo Then retry: pip install -r requirements.txt
)

pause
