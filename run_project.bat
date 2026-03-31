@echo off
echo ====================================================
echo    URBANDIARY - STARTING FULLSTACK PROJECT
echo ====================================================

:: Go into backend and start server
cd /d "%~dp0backend"

:: Start the server in a new window
echo [Step 1] Initializing Server on http://localhost:5000...
start "URBANDIARY_SERVER" cmd /k "node server.js"

:: Wait for server to be ready
timeout /t 4 /nobreak > NUL1

:: Open the website via the server URL, NOT the file path
echo [Step 2] Opening UrbanDiary Website...
start "" "http://localhost:5000"

echo.
echo ====================================================
echo    SUCCESS: Use the browser window that just opened.
echo    Login/Signup will now work perfectly.
echo ====================================================
pause
