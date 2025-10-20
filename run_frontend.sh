#!/bin/bash

# Simple script to run the frontend server

echo "🚀 Starting SkillBridge Frontend..."
echo ""
echo "📍 Running on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd /Users/mac/Documents/Project/skillBridge/frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

npm run dev
