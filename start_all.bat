@echo off
REM SkillBridge - Unified Start Script for Windows
REM Starts both backend and frontend servers together

title SkillBridge Platform

echo.
echo ================================================================
echo   Starting SkillBridge Platform
echo ================================================================
echo.

REM Get the directory where the script is located
set SCRIPT_DIR=%~dp0

REM Check if backend dependencies are installed
if not exist "%SCRIPT_DIR%backend\venv" (
    echo [SETUP] Backend virtual environment not found!
    echo [SETUP] Creating virtual environment...
    cd "%SCRIPT_DIR%backend"
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    echo [OK] Backend dependencies installed
    echo.
)

REM Check if frontend dependencies are installed
if not exist "%SCRIPT_DIR%frontend\node_modules" (
    echo [SETUP] Frontend dependencies not found!
    echo [SETUP] Installing frontend dependencies...
    cd "%SCRIPT_DIR%frontend"
    npm install
    echo [OK] Frontend dependencies installed
    echo.
)

REM Check if database exists
if not exist "%SCRIPT_DIR%backend\skillbridge.db" (
    echo [SETUP] Database not found!
    echo [SETUP] Initializing database...
    cd "%SCRIPT_DIR%backend"

    if not exist "migrations" (
        set FLASK_APP=run.py
        call venv\Scripts\activate
        flask db init
    )

    call venv\Scripts\activate
    flask db migrate -m "Initial migration"
    flask db upgrade

    echo [SETUP] Creating test users...
    venv\Scripts\python seed_test_users.py
    echo [OK] Database initialized
    echo.
)

REM Create logs directory
if not exist "%SCRIPT_DIR%logs" mkdir "%SCRIPT_DIR%logs"

echo ================================================================
echo   Starting Servers...
echo ================================================================
echo.
echo   Backend:  http://localhost:5001
echo   Frontend: http://localhost:3000
echo.
echo   Test Credentials:
echo   +-------------+----------------------+--------------+
echo   ^| Role        ^| Email                ^| Password     ^|
echo   +-------------+----------------------+--------------+
echo   ^| Admin       ^| admin@test.com       ^| admin123     ^|
echo   ^| Learner     ^| learner@test.com     ^| learner123   ^|
echo   ^| Company     ^| company@test.com     ^| company123   ^|
echo   ^| Supervisor  ^| supervisor@test.com  ^| supervisor123^|
echo   +-------------+----------------------+--------------+
echo.
echo ================================================================
echo.
echo   Tip: Login as admin and use 'User Sessions' to test all roles!
echo.
echo   Close this window or press Ctrl+C to stop all servers
echo.
echo ================================================================
echo.

REM Start backend in new window
echo [START] Starting backend server...
start "SkillBridge Backend" /MIN cmd /k "cd /d %SCRIPT_DIR%backend && venv\Scripts\python run.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo [OK] Backend started

REM Start frontend in new window
echo [START] Starting frontend server...
start "SkillBridge Frontend" /MIN cmd /k "cd /d %SCRIPT_DIR%frontend && npm run dev"

REM Wait for frontend to start
timeout /t 3 /nobreak >nul

echo [OK] Frontend started
echo.
echo ================================================================
echo   All servers are running!
echo ================================================================
echo.
echo   Open your browser: http://localhost:3000
echo.
echo   Server windows are minimized in taskbar
echo   Close them to stop the servers
echo.
echo ================================================================
echo.
echo Press any key to open browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo Browser opened. Keep this window open.
echo Press any key to exit (servers will keep running)...
pause >nul
