#!/bin/bash

# SkillBridge - Unified Start Script
# Starts both backend and frontend servers together

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}🚀 Starting SkillBridge Platform${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "${YELLOW}🛑 Stopping all servers...${NC}"
    kill $(jobs -p) 2>/dev/null
    wait
    echo "${GREEN}✅ All servers stopped${NC}"
    exit
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Check if backend dependencies are installed
if [ ! -d "$SCRIPT_DIR/backend/venv" ]; then
    echo "${YELLOW}⚠️  Backend virtual environment not found!${NC}"
    echo "${BLUE}Creating virtual environment and installing dependencies...${NC}"
    cd "$SCRIPT_DIR/backend"
    python3 -m venv venv
    venv/bin/python3.10 -m pip install -r requirements.txt
    echo "${GREEN}✅ Backend dependencies installed${NC}"
    echo ""
fi

# Check if frontend dependencies are installed
if [ ! -d "$SCRIPT_DIR/frontend/node_modules" ]; then
    echo "${YELLOW}⚠️  Frontend dependencies not found!${NC}"
    echo "${BLUE}Installing frontend dependencies...${NC}"
    cd "$SCRIPT_DIR/frontend"
    npm install
    echo "${GREEN}✅ Frontend dependencies installed${NC}"
    echo ""
fi

# Check if database exists
if [ ! -f "$SCRIPT_DIR/backend/skillbridge.db" ]; then
    echo "${YELLOW}⚠️  Database not found!${NC}"
    echo "${BLUE}Initializing database...${NC}"
    cd "$SCRIPT_DIR/backend"

    if [ ! -d "migrations" ]; then
        export FLASK_APP=run.py
        venv/bin/python3.10 -m flask db init
    fi

    venv/bin/python3.10 -m flask db migrate -m "Initial migration"
    venv/bin/python3.10 -m flask db upgrade

    echo "${BLUE}Creating test users...${NC}"
    venv/bin/python3.10 seed_test_users.py
    echo "${GREEN}✅ Database initialized${NC}"
    echo ""
fi

# Create log directory
mkdir -p "$SCRIPT_DIR/logs"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}✨ Starting Servers...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ${BLUE}Backend:${NC}  http://localhost:5001"
echo "  ${BLUE}Frontend:${NC} http://localhost:3000"
echo ""
echo "  ${GREEN}Test Credentials:${NC}"
echo "  ┌─────────────┬──────────────────────┬──────────────┐"
echo "  │ Role        │ Email                │ Password     │"
echo "  ├─────────────┼──────────────────────┼──────────────┤"
echo "  │ Admin       │ admin@test.com       │ admin123     │"
echo "  │ Learner     │ learner@test.com     │ learner123   │"
echo "  │ Company     │ company@test.com     │ company123   │"
echo "  │ Supervisor  │ supervisor@test.com  │ supervisor123│"
echo "  └─────────────┴──────────────────────┴──────────────┘"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ${YELLOW}💡 Tip: Login as admin and use 'User Sessions' to test all roles!${NC}"
echo ""
echo "  ${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend server
echo "${BLUE}[1/2] Starting backend server...${NC}"
cd "$SCRIPT_DIR/backend"
venv/bin/python3.10 run.py > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo "${GREEN}✅ Backend started successfully (PID: $BACKEND_PID)${NC}"
else
    echo "${RED}❌ Backend failed to start. Check logs/backend.log${NC}"
    exit 1
fi

echo ""

# Start frontend server
echo "${BLUE}[2/2] Starting frontend server...${NC}"
cd "$SCRIPT_DIR/frontend"
npm run dev > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo "${GREEN}✅ Frontend started successfully (PID: $FRONTEND_PID)${NC}"
else
    echo "${RED}❌ Frontend failed to start. Check logs/frontend.log${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ${GREEN}🎉 All servers are running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ${GREEN}➜${NC}  Open your browser: ${BLUE}http://localhost:3000${NC}"
echo ""
echo "  Logs:"
echo "  • Backend:  tail -f logs/backend.log"
echo "  • Frontend: tail -f logs/frontend.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
