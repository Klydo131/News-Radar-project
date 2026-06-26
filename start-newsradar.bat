@echo off
echo ========================================================
echo NewsRadar - Local Open Core Startup (Anti-Locking Mode)
echo ========================================================
echo.
echo Detected running from Google Drive. Windows file locking
echo prevents local databases and npm from running smoothly here.
echo.
echo Copying workspace to a safe, high-speed temporary directory...

set "TARGET_DIR=%TEMP%\NewsRadarLocal"
if exist "%TARGET_DIR%" rmdir /s /q "%TARGET_DIR%"
mkdir "%TARGET_DIR%"
xcopy /E /I /H /Y "%~dp0*" "%TARGET_DIR%"

echo.
echo Environment secured.
echo To run the full local stack, open 3 terminals in %TARGET_DIR%:
echo.
echo 1. Start Rust Core:
echo    cd core ^&^& cargo run
echo.
echo 2. Start Python API:
echo    cd api ^&^& pip install -r requirements.txt ^&^& python index.py
echo.
echo 3. Start Interface:
echo    npm install ^&^& npm run dev
echo.
echo NOTE: Next.js 'npm run dev' does not proxy to Python automatically 
echo without next.config.js rewrites. For local testing, we recommend 
echo testing the UI by accessing http://localhost:5000 directly or 
echo letting Vercel handle the routing.
echo.
pause
