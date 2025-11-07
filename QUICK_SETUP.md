# ⚡ SkillBridge - Quick Setup Guide

Get SkillBridge running in 5 minutes!

---

## 📋 Prerequisites

Make sure you have these installed:
- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
python --version  # or python3 --version
node --version
git --version
```

---

## 🚀 Installation (3 Steps)

### Step 1: Clone Repository
```bash
git clone https://github.com/Umer9538/SkillBridge.git
cd SkillBridge
```

### Step 2: Install Dependencies

#### Backend:
```bash
cd backend
python -m venv venv                    # Create virtual environment

# Activate virtual environment:
source venv/bin/activate               # macOS/Linux
# OR
venv\Scripts\activate                  # Windows

pip install -r requirements.txt        # Install dependencies
cd ..
```

#### Frontend:
```bash
cd frontend
npm install                            # Install dependencies
cd ..
```

### Step 3: Run Application

#### One Command (Recommended):
```bash
# macOS/Linux
chmod +x start_all.sh
./start_all.sh

# Windows
start_all.bat
```

#### Or Manually (2 Terminals):

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate               # Windows: venv\Scripts\activate
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Access Application

Open browser: **http://localhost:3000**

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Learner | learner@test.com | learner123 |
| Company | company@test.com | company123 |
| Supervisor | supervisor@test.com | supervisor123 |

---

## 🛑 Stop Servers

Press `Ctrl + C` in the terminal(s)

---

## ❓ Common Issues

### Port Already in Use
```bash
# Kill process on port 5001 (backend)
# macOS/Linux:
lsof -ti:5001 | xargs kill -9

# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Reinstall backend dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Reinstall frontend dependencies
cd frontend
npm install
```

### Permission Denied (macOS/Linux)
```bash
chmod +x start_all.sh
```

---

## 📚 Full Documentation

For detailed installation guide, see [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)

---

## ✅ Quick Checklist

- [ ] Python, Node.js, Git installed
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Can login with test credentials

---

## 🎉 Success!

You're all set! Start exploring SkillBridge.

**Need help?** Check [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for detailed troubleshooting.

**Happy Learning! 🚀**
