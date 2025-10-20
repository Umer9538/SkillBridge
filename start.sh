#!/bin/bash

# SkillBridge - Quick Start Script
# This script starts both backend and frontend servers

echo "🚀 Starting SkillBridge Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Python 3: $(python3 --version)"
echo "✅ Node.js: $(node --version)"
echo ""

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "${YELLOW}⚠️  Virtual environment not found. Creating...${NC}"
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    echo "✅ Virtual environment created and dependencies installed"
    cd ..
    echo ""
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "${YELLOW}⚠️  Node modules not found. Installing...${NC}"
    cd frontend
    npm install
    echo "✅ Node dependencies installed"
    cd ..
    echo ""
fi

# Check if database exists
if [ ! -f "backend/skillbridge.db" ]; then
    echo "${YELLOW}⚠️  Database not found. Initializing...${NC}"
    cd backend
    source venv/bin/activate

    # Check if migrations folder exists
    if [ ! -d "migrations" ]; then
        flask db init
    fi

    flask db migrate -m "Initial migration"
    flask db upgrade
    python seed_test_users.py
    echo "✅ Database initialized and test users created"
    cd ..
    echo ""
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "${YELLOW}⚠️  Backend .env not found. Creating default...${NC}"
    cat > backend/.env << EOF
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production
DATABASE_URL=sqlite:///skillbridge.db
FRONTEND_URL=http://localhost:3000
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
EOF
    echo "✅ Backend .env created"
fi

if [ ! -f "frontend/.env" ]; then
    echo "${YELLOW}⚠️  Frontend .env not found. Creating default...${NC}"
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
    echo "✅ Frontend .env created"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}✨ SkillBridge Platform Starting...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ${BLUE}Backend:${NC}  http://localhost:5000"
echo "  ${BLUE}Frontend:${NC} http://localhost:3000"
echo ""
echo "  ${GREEN}Test Credentials:${NC}"
echo "  Admin:      admin@test.com / admin123"
echo "  Learner:    learner@test.com / learner123"
echo "  Company:    company@test.com / company123"
echo "  Supervisor: supervisor@test.com / supervisor123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
source venv/bin/activate
python run.py &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend in background
echo "⚛️  Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
