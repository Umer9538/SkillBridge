# 📦 SkillBridge - Complete Installation Guide

This guide will help you install and set up SkillBridge from scratch, including all required dependencies.

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Installing Prerequisites](#installing-prerequisites)
3. [Cloning the Repository](#cloning-the-repository)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Database Setup](#database-setup)
7. [Running the Application](#running-the-application)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## 🖥️ System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Internet**: Required for downloading dependencies

### Software Requirements
- **Python**: 3.8 or higher
- **Node.js**: 16.x or higher
- **npm**: 8.x or higher (comes with Node.js)
- **Git**: 2.x or higher

---

## 🔧 Installing Prerequisites

### 1. Install Python

#### Windows:
1. Download Python from [python.org](https://www.python.org/downloads/)
2. Run the installer
3. **Important**: Check "Add Python to PATH" during installation
4. Verify installation:
   ```cmd
   python --version
   ```
   Should show: `Python 3.8.x` or higher

#### macOS:
```bash
# Using Homebrew (recommended)
brew install python@3.10

# Verify installation
python3 --version
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Verify installation
python3 --version
```

---

### 2. Install Node.js and npm

#### Windows:
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer (choose LTS version)
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### macOS:
```bash
# Using Homebrew (recommended)
brew install node

# Verify installation
node --version
npm --version
```

#### Linux (Ubuntu/Debian):
```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

---

### 3. Install Git

#### Windows:
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with default settings
3. Verify installation:
   ```cmd
   git --version
   ```

#### macOS:
```bash
# Git comes with Xcode Command Line Tools
xcode-select --install

# Or use Homebrew
brew install git

# Verify installation
git --version
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install git

# Verify installation
git --version
```

---

## 📥 Cloning the Repository

Open your terminal/command prompt and run:

```bash
# Clone the repository
git clone https://github.com/Umer9538/SkillBridge.git

# Navigate to the project directory
cd SkillBridge
```

If you don't have access to the repository, download it as a ZIP file and extract it.

---

## 🐍 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Create Virtual Environment

#### Windows:
```cmd
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate
```

#### macOS/Linux:
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal prompt.

### Step 3: Upgrade pip

```bash
# Windows
python -m pip install --upgrade pip

# macOS/Linux
python3 -m pip install --upgrade pip
```

### Step 4: Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- SQLAlchemy (database ORM)
- Flask-JWT-Extended (authentication)
- Flask-Mail (email service)
- Flask-CORS (cross-origin support)
- Flask-Bcrypt (password hashing)
- And other dependencies

**Note**: This may take 2-5 minutes depending on your internet speed.

### Step 5: Set Up Environment Variables (Optional)

Create a `.env` file in the backend directory:

```bash
# Windows
type nul > .env

# macOS/Linux
touch .env
```

Add the following configuration (optional for development):

```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///instance/skillbridge.db

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-here

# Email Configuration (optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Note**: Email configuration is optional. The app will work without it, but email notifications won't be sent.

---

## ⚛️ Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **new terminal window** and run:

```bash
# From the project root
cd frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

This will install:
- React (UI framework)
- Vite (build tool)
- React Router (navigation)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Lucide React (icons)
- And other dependencies

**Note**: This may take 3-7 minutes depending on your internet speed.

### Step 3: Set Up Environment Variables (Optional)

Create a `.env` file in the frontend directory:

```bash
# Windows
type nul > .env

# macOS/Linux
touch .env
```

Add the following:

```env
VITE_API_URL=http://localhost:5001/api
```

**Note**: This is optional. The default configuration already points to `http://localhost:5001/api`.

---

## 🗄️ Database Setup

The database will be created automatically when you first run the application.

### Option 1: Automatic Setup (Recommended)

The start scripts will automatically:
1. Create the database
2. Run migrations
3. Seed test data (4 test users)

### Option 2: Manual Setup

If you want to set up the database manually:

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment (if not already activated)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Initialize database
python run.py

# Seed test users (in another terminal)
python seed_test_users.py
```

---

## 🚀 Running the Application

You have two options: **One-Command Start** (Easy) or **Manual Start** (Advanced).

### ✅ Option 1: One-Command Start (Recommended)

This is the easiest way to start both backend and frontend together.

#### Windows:
```cmd
# From project root directory
start_all.bat
```

#### macOS/Linux:
```bash
# From project root directory
chmod +x start_all.sh
./start_all.sh
```

The script will:
1. Install/update backend dependencies
2. Install/update frontend dependencies
3. Initialize database (if needed)
4. Create test users
5. Start backend server (port 5001)
6. Start frontend server (port 3000)
7. Open browser automatically

**Logs** are saved in:
- `logs/backend.log`
- `logs/frontend.log`

### ✅ Option 2: Manual Start

If you prefer to start services separately:

#### Terminal 1 - Backend:
```bash
# Navigate to backend
cd backend

# Activate virtual environment
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run backend
python run.py
```

Backend will run on: http://localhost:5001

#### Terminal 2 - Frontend:
```bash
# Navigate to frontend
cd frontend

# Run frontend
npm run dev
```

Frontend will run on: http://localhost:3000

---

## 🌐 Accessing the Application

Once both servers are running:

1. **Open Browser**: Go to http://localhost:3000
2. **Login** with test credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | admin123 |
| **Learner** | learner@test.com | learner123 |
| **Company** | company@test.com | company123 |
| **Supervisor** | supervisor@test.com | supervisor123 |

---

## 🛑 Stopping the Application

### If using start scripts:
Press `Ctrl + C` in the terminal window

### If running manually:
Press `Ctrl + C` in both terminal windows (backend and frontend)

---

## 🔧 Troubleshooting

### Issue: "Python command not found"

**Solution**:
- Windows: Use `python` instead of `python3`
- macOS/Linux: Use `python3` instead of `python`
- Make sure Python is added to PATH

### Issue: "pip command not found"

**Solution**:
```bash
# Windows
python -m pip install --upgrade pip

# macOS/Linux
python3 -m pip install --upgrade pip
```

### Issue: "Port 5001 already in use"

**Solution**:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5001 | xargs kill -9
```

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: "Module not found" errors

**Solution**:
```bash
# Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Issue: "Permission denied" on macOS/Linux

**Solution**:
```bash
chmod +x start_all.sh
chmod +x start.sh
```

### Issue: Database locked error

**Solution**:
```bash
# Stop all running servers
# Delete database
rm backend/instance/skillbridge.db

# Restart application - database will be recreated
./start_all.sh
```

### Issue: Frontend can't connect to backend

**Solution**:
1. Check if backend is running on port 5001
2. Check browser console for errors
3. Verify `VITE_API_URL` in frontend/.env points to http://localhost:5001/api
4. Disable browser extensions (especially ad blockers)

### Issue: Email notifications not working

**Solution**:
- Email configuration is optional
- The app works fine without email
- To enable emails, configure SMTP in backend/.env
- For Gmail, use an "App Password" not your regular password

---

## 🎯 Verifying Installation

After installation, verify everything works:

### 1. Check Backend
```bash
curl http://localhost:5001/api/health
```
Should return: `{"message": "SkillBridge API is running", "status": "ok"}`

### 2. Check Frontend
Open http://localhost:3000 in browser - should see login page

### 3. Test Login
Login with: `admin@test.com` / `admin123`

### 4. Check Database
```bash
# Windows
dir backend\instance\skillbridge.db

# macOS/Linux
ls -lh backend/instance/skillbridge.db
```
Should show database file exists

---

## 📚 Next Steps

After successful installation:

1. **Explore the Platform**
   - Login as different user roles
   - Create courses (as Supervisor)
   - Post tasks (as Company)
   - Apply for tasks (as Learner)
   - Try the messaging system

2. **Read Documentation**
   - `START_HERE.md` - Quick start guide
   - `TEST_CREDENTIALS.md` - All test accounts
   - `README.md` - Feature overview
   - `QUICKSTART.md` - Quick reference

3. **Test Features**
   - User registration
   - Course enrollment
   - Task applications
   - Messaging between users
   - Analytics dashboards

4. **Customize**
   - Update email configuration
   - Modify user roles
   - Add more test data
   - Customize UI theme

---

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. **Check Logs**:
   - `logs/backend.log` - Backend errors
   - `logs/frontend.log` - Frontend errors
   - Browser console (F12) - Frontend errors

2. **Common Issues**:
   - Make sure all prerequisites are installed
   - Verify ports 3000 and 5001 are available
   - Check Python virtual environment is activated
   - Ensure you're in the correct directory

3. **Contact Support**:
   - Create an issue on GitHub
   - Check existing issues for solutions
   - Contact the development team

---

## ✅ Installation Checklist

Use this checklist to track your installation progress:

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend starts successfully (port 5001)
- [ ] Frontend starts successfully (port 3000)
- [ ] Can access login page
- [ ] Can login with test credentials
- [ ] Database created successfully
- [ ] Test users exist

---

## 🎉 Success!

If you've completed all steps, congratulations! Your SkillBridge installation is complete.

**Start the platform**:
```bash
./start_all.sh  # macOS/Linux
start_all.bat   # Windows
```

**Access the app**: http://localhost:3000

**Happy Learning! 🚀**
