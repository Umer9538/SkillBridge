#!/bin/bash

# Simple script to run the backend server

echo "🚀 Starting SkillBridge Backend..."
echo ""
echo "📍 Running on: http://localhost:5001"
echo "📍 API Endpoint: http://localhost:5001/api"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd /Users/mac/Documents/Project/skillBridge/backend
venv/bin/python3.10 run.py
