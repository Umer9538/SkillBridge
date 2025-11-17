# 📦 SkillBridge - Complete Prerequisites Guide

Everything you need to install to run SkillBridge - no exceptions, no confusion.

---

## 📋 Table of Contents

1. [Prerequisites Overview](#prerequisites-overview)
2. [Install Python](#1-install-python)
3. [Install Node.js & npm](#2-install-nodejs--npm)
4. [Install Git](#3-install-git)
5. [Python Packages](#4-python-packages-backend)
6. [Node.js Packages](#5-nodejs-packages-frontend)
7. [Verification](#6-verification)
8. [Complete Installation Commands](#complete-installation-commands)

---

## 📊 Prerequisites Overview

SkillBridge needs **3 main tools** and **50+ packages**:

### What You Must Install:

| Tool | Version Required | Purpose | Size |
|------|-----------------|---------|------|
| **Python** | 3.8 or higher | Backend server | ~100 MB |
| **Node.js** | 16 or higher | Frontend UI | ~50 MB |
| **Git** | Any recent version | Version control | ~30 MB |

### What Gets Installed Automatically:

| Category | Count | Installed By |
|----------|-------|--------------|
| **Python Packages** | 12 packages | pip (Python's package manager) |
| **Node.js Packages** | 40+ packages | npm (Node's package manager) |

**Total Download Size:** ~500 MB - 1 GB (depending on platform)

---

## 1. Install Python

Python runs the backend server (Flask API).

### Windows Installation

1. **Download:**
   - Go to: [python.org/downloads](https://www.python.org/downloads/)
   - Click: "Download Python 3.x.x" (latest version)

2. **Install:**
   - Run the downloaded `.exe` file
   - ⚠️ **CRITICAL:** Check ✅ "Add Python to PATH"
   - Click "Install Now"
   - Wait 2-3 minutes
   - Click "Close"

3. **Verify:**
   ```cmd
   python --version
   pip --version
   ```
   Should show Python 3.x.x and pip version.

### macOS Installation

**Option 1: Homebrew (Recommended)**
```bash
# Install Homebrew first if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Python
brew install python@3.10

# Verify
python3 --version
pip3 --version
```

**Option 2: Direct Download**
1. Go to: [python.org/downloads](https://www.python.org/downloads/)
2. Download macOS installer
3. Run `.pkg` file
4. Follow installation wizard

### Linux Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv -y

# Verify
python3 --version
pip3 --version
```

**CentOS/RHEL:**
```bash
sudo yum install python3 python3-pip -y

# Verify
python3 --version
pip3 --version
```

---

## 2. Install Node.js & npm

Node.js runs the frontend development server and builds the React app.

### Windows Installation

1. **Download:**
   - Go to: [nodejs.org](https://nodejs.org/)
   - Download "LTS" version (Long Term Support)

2. **Install:**
   - Run the downloaded `.msi` file
   - Click "Next" through wizard
   - Accept defaults
   - Click "Install"
   - Wait 2-3 minutes
   - Click "Finish"

3. **Verify:**
   ```cmd
   node --version
   npm --version
   ```
   Should show v16.x.x or higher for Node, and v8.x.x or higher for npm.

### macOS Installation

**Using Homebrew:**
```bash
# Install Node.js (includes npm)
brew install node

# Verify
node --version
npm --version
```

**Direct Download:**
1. Go to: [nodejs.org](https://nodejs.org/)
2. Download macOS installer (LTS)
3. Run `.pkg` file
4. Follow installation wizard

### Linux Installation

**Ubuntu/Debian:**
```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

**CentOS/RHEL:**
```bash
# Install Node.js 18.x LTS
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify
node --version
npm --version
```

---

## 3. Install Git

Git downloads the project from GitHub.

### Windows Installation

1. **Download:**
   - Go to: [git-scm.com/download/win](https://git-scm.com/download/win)
   - Download automatically starts

2. **Install:**
   - Run the downloaded `.exe` file
   - Accept all defaults (just keep clicking "Next")
   - Click "Install"
   - Click "Finish"

3. **Verify:**
   ```cmd
   git --version
   ```
   Should show git version 2.x.x

### macOS Installation

**Using Homebrew:**
```bash
brew install git

# Verify
git --version
```

**Or install Xcode Command Line Tools:**
```bash
xcode-select --install

# Verify
git --version
```

### Linux Installation

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install git -y

# Verify
git --version
```

**CentOS/RHEL:**
```bash
sudo yum install git -y

# Verify
git --version
```

---

## 4. Python Packages (Backend)

These packages run the backend server.

### Required Python Packages (12 total)

| Package | Version | Purpose |
|---------|---------|---------|
| Flask | 3.0.0 | Web framework - handles HTTP requests |
| Flask-SQLAlchemy | 3.1.1 | Database integration |
| SQLAlchemy | 2.0.23 | ORM - database operations |
| Flask-JWT-Extended | 4.5.3 | Authentication with JWT tokens |
| Flask-Bcrypt | 1.0.1 | Password hashing |
| Flask-Mail | 0.9.1 | Email notifications |
| Flask-CORS | 4.0.0 | Cross-origin requests |
| python-dotenv | 1.0.0 | Environment variables |
| python-dateutil | 2.8.2 | Date/time utilities |
| requests | 2.31.0 | HTTP requests |
| email-validator | 2.1.0 | Email validation |
| Werkzeug | 3.0.1 | WSGI utilities |

### How to Install Python Packages

```bash
# 1. Navigate to backend folder
cd SkillBridge/backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

# 4. Install all packages at once
pip install -r requirements.txt
```

### What Gets Installed:
- 12 main packages listed above
- 20+ dependency packages automatically
- Total: ~30-40 packages, ~200 MB

### Verify Python Packages:
```bash
pip list
```
Should show all 12 packages above.

---

## 5. Node.js Packages (Frontend)

These packages run the React frontend.

### Required Node.js Packages (40+ total)

#### Core Packages:

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React DOM rendering |
| react-router-dom | ^6.20.1 | Navigation/routing |
| vite | ^5.0.8 | Build tool and dev server |

#### UI & Styling:

| Package | Version | Purpose |
|---------|---------|---------|
| tailwindcss | ^3.4.0 | CSS framework |
| autoprefixer | ^10.4.16 | CSS vendor prefixes |
| postcss | ^8.4.32 | CSS processing |
| lucide-react | ^0.303.0 | Icon library |

#### HTTP & API:

| Package | Version | Purpose |
|---------|---------|---------|
| axios | ^1.6.5 | HTTP client for API calls |

#### Development Tools:

| Package | Version | Purpose |
|---------|---------|---------|
| @vitejs/plugin-react | ^4.2.1 | Vite React plugin |
| eslint | ^8.55.0 | Code linting |
| eslint-plugin-react | ^7.33.2 | React ESLint rules |
| @types/react | ^18.2.43 | TypeScript types |
| @types/react-dom | ^18.2.17 | TypeScript types |

**Plus 30+ dependency packages** that install automatically.

### How to Install Node.js Packages

```bash
# 1. Navigate to frontend folder
cd SkillBridge/frontend

# 2. Install all packages at once
npm install
```

### What Gets Installed:
- All packages listed above
- All dependencies
- Total: 200+ packages (in node_modules), ~300 MB

### Verify Node.js Packages:
```bash
npm list --depth=0
```
Should show all main packages.

---

## 6. Verification

After installing everything, verify it works.

### Quick Verification

```bash
# Check Python
python --version        # Should show 3.8+
pip --version          # Should show pip version

# Check Node.js
node --version         # Should show 16+
npm --version          # Should show 8+

# Check Git
git --version          # Should show git version
```

### Full Verification Checklist

#### Main Tools:
- [ ] Python 3.8+ installed
- [ ] pip working
- [ ] Node.js 16+ installed
- [ ] npm working
- [ ] Git installed

#### Backend Setup:
- [ ] Virtual environment created (`backend/venv` folder exists)
- [ ] Virtual environment activated (see `(venv)` in terminal)
- [ ] Python packages installed (12 packages in `pip list`)

#### Frontend Setup:
- [ ] Node modules installed (`frontend/node_modules` folder exists)
- [ ] Main packages visible in `npm list --depth=0`

#### Test Run:
- [ ] Backend starts: `cd backend && python run.py`
- [ ] Frontend starts: `cd frontend && npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Can login with test account

---

## 📋 Complete Installation Commands

Copy-paste these commands in order:

### Windows (Command Prompt)

```cmd
# Install Python from python.org (manual)
# Install Node.js from nodejs.org (manual)
# Install Git from git-scm.com (manual)

# After manual installations, run:

# Clone project
git clone https://github.com/Umer9538/SkillBridge.git
cd SkillBridge

# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Frontend setup
cd frontend
npm install
cd ..

# Verify
python --version
node --version
git --version
```

### macOS/Linux (Terminal)

```bash
# Install prerequisites (using package manager)
# macOS with Homebrew:
brew install python@3.10 node git

# Ubuntu/Debian:
sudo apt update
sudo apt install python3 python3-pip python3-venv nodejs git -y

# Clone project
git clone https://github.com/Umer9538/SkillBridge.git
cd SkillBridge

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Frontend setup
cd frontend
npm install
cd ..

# Verify
python3 --version
node --version
git --version
```

---

## 🎯 What Each Tool Does

### Python (Backend)
- **Runs:** Flask web server on port 5001
- **Handles:** API requests, database operations, authentication
- **Packages:** Flask, SQLAlchemy, JWT, etc.
- **Files:** Everything in `backend/` folder

### Node.js (Frontend)
- **Runs:** Vite development server on port 3000
- **Handles:** React UI, user interface, navigation
- **Packages:** React, Vite, Tailwind CSS, etc.
- **Files:** Everything in `frontend/` folder

### Git (Version Control)
- **Downloads:** Project code from GitHub
- **Manages:** Code versions and updates
- **Commands:** clone, pull, push, commit

---

## 💾 Disk Space Requirements

| Item | Space Required |
|------|---------------|
| Python installation | ~100 MB |
| Node.js installation | ~50 MB |
| Git installation | ~30 MB |
| Python packages (venv) | ~200 MB |
| Node modules | ~300 MB |
| Project files | ~50 MB |
| Database (when created) | ~10 MB |
| **Total** | **~740 MB** |

Recommended free space: **2 GB**

---

## ⏱️ Installation Time Estimates

| Step | Time Required |
|------|--------------|
| Download Python | 2-5 minutes |
| Install Python | 2-3 minutes |
| Download Node.js | 2-5 minutes |
| Install Node.js | 2-3 minutes |
| Install Git | 2-3 minutes |
| Clone project | 1-2 minutes |
| Install Python packages | 3-5 minutes |
| Install Node packages | 5-10 minutes |
| **Total** | **20-40 minutes** |

*Time varies based on internet speed*

---

## ❗ Common Issues & Solutions

### Issue 1: "Command not found" after installation

**Solution:** Restart terminal/command prompt after installation.

### Issue 2: Python or Node commands don't work

**Windows:**
- Reinstall and check "Add to PATH" option
- Or restart computer

**macOS/Linux:**
- Use `python3` instead of `python`
- Use `pip3` instead of `pip`

### Issue 3: pip install fails with permission error

**Solution:**
```bash
# Don't use sudo! Use virtual environment:
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Issue 4: npm install fails

**Solution:**
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Issue 5: Git clone fails

**Solution:**
```bash
# Download ZIP instead
# Go to: https://github.com/Umer9538/SkillBridge
# Click "Code" → "Download ZIP"
# Extract and continue with setup
```

---

## 🔄 Update Prerequisites

Keep your tools updated:

### Update Python Packages
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install --upgrade -r requirements.txt
```

### Update Node.js Packages
```bash
cd frontend
npm update
```

### Update Python
- Download latest from python.org
- Reinstall

### Update Node.js
```bash
# macOS:
brew upgrade node

# Linux:
# Download latest installer from nodejs.org
```

---

## 📚 Next Steps

After installing all prerequisites:

1. ✅ All 3 main tools installed (Python, Node.js, Git)
2. ✅ All Python packages installed (12 packages)
3. ✅ All Node.js packages installed (40+ packages)
4. ✅ Everything verified

**Now you can:**
- Run the backend: `cd backend && python run.py`
- Run the frontend: `cd frontend && npm run dev`
- Access app: http://localhost:3000
- Start developing!

---

## 🆘 Need Help?

- **Python specific:** See PYTHON_SETUP_GUIDE.md
- **Quick setup:** See QUICK_SETUP.md
- **Full installation:** See INSTALLATION_GUIDE.md
- **Project overview:** See PROJECT_SETUP_GUIDE.md
- **All documentation:** See DOCUMENTATION_INDEX.md

---

## ✅ Final Checklist

Before running the project, ensure:

### Software Installed:
- [ ] Python 3.8+ installed and in PATH
- [ ] pip installed and working
- [ ] Node.js 16+ installed
- [ ] npm installed and working
- [ ] Git installed

### Backend Ready:
- [ ] Virtual environment created
- [ ] Virtual environment activated
- [ ] All Python packages installed (check with `pip list`)
- [ ] No installation errors

### Frontend Ready:
- [ ] node_modules folder exists
- [ ] All packages installed (check with `npm list`)
- [ ] No installation errors

### Can Run:
- [ ] Backend command works: `python run.py`
- [ ] Frontend command works: `npm run dev`
- [ ] Both servers start without errors

---

## 🎉 All Set!

If all checkboxes are checked, you have successfully installed everything!

**Quick Start:**
```bash
# One command to run everything:
./start_all.sh  # macOS/Linux
start_all.bat   # Windows
```

**Manual Start:**
```bash
# Terminal 1 - Backend:
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python run.py

# Terminal 2 - Frontend:
cd frontend
npm run dev
```

**Access:** http://localhost:3000

**Login:** admin@test.com / admin123

**Happy Coding! 🚀**
