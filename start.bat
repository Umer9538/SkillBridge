@echo off
REM SkillBridge - Quick Start Script for Windows
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo   Starting SkillBridge Platform...
echo ========================================
echo.

REM Check if Python is installed
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)

echo [OK] Python:
python --version
echo [OK] Node.js:
node --version
echo.

REM Check if virtual environment exists
if not exist "backend\venv" (
    echo [SETUP] Creating virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    echo [OK] Virtual environment created
    cd ..
    echo.
)

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo [SETUP] Installing Node.js dependencies...
    cd frontend
    call npm install
    echo [OK] Node dependencies installed
    cd ..
    echo.
)

REM Check if database exists
if not exist "backend\skillbridge.db" (
    echo [SETUP] Initializing database...
    cd backend
    call venv\Scripts\activate

    if not exist "migrations" (
        flask db init
    )

    flask db migrate -m "Initial migration"
    flask db upgrade
    python seed_test_users.py
    echo [OK] Database initialized
    cd ..
    echo.
)

REM Create backend .env if it doesn't exist
if not exist "backend\.env" (
    echo [SETUP] Creating backend .env file...
    (
        echo FLASK_APP=run.py
        echo FLASK_ENV=development
        echo SECRET_KEY=dev-secret-key-change-in-production
        echo JWT_SECRET_KEY=jwt-secret-key-change-in-production
        echo DATABASE_URL=sqlite:///skillbridge.db
        echo FRONTEND_URL=http://localhost:3000
        echo UPLOAD_FOLDER=uploads
        echo MAX_CONTENT_LENGTH=16777216
    ) > backend\.env
    echo [OK] Backend .env created
)

REM Create frontend .env if it doesn't exist
if not exist "frontend\.env" (
    echo [SETUP] Creating frontend .env file...
    (
        echo VITE_API_URL=http://localhost:5000/api
    ) > frontend\.env
    echo [OK] Frontend .env created
)

echo.
echo ========================================
echo   SkillBridge Platform Starting...
echo ========================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo   Test Credentials:
echo   Admin:      admin@test.com / admin123
echo   Learner:    learner@test.com / learner123
echo   Company:    company@test.com / company123
echo   Supervisor: supervisor@test.com / supervisor123
echo.
echo ========================================
echo.
echo   Press Ctrl+C to stop both servers
echo.

REM Start backend in new window
echo [START] Starting backend server...
start "SkillBridge Backend" cmd /k "cd backend && venv\Scripts\activate && python run.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo [START] Starting frontend server...
start "SkillBridge Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers are starting...
echo   Check the new terminal windows
echo ========================================
echo.
pause
