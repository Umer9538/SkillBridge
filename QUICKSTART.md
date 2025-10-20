# 🚀 SkillBridge - Quick Start Guide

The **fastest** way to get SkillBridge running on your computer!

---

## ⚡ Super Quick Start (ONE COMMAND!)

### ✨ NEW: Unified Start Script (EASIEST WAY)

**macOS/Linux:**
```bash
cd /Users/mac/Documents/Project/skillBridge
./start_all.sh
```

**Windows:**
Double-click `start_all.bat` in the skillBridge folder

**This single script starts BOTH frontend and backend together!** 🎉

The script will:
- ✅ Check if Python and Node.js are installed
- ✅ Install all dependencies automatically
- ✅ Create database and test users
- ✅ Start backend server (port 5001)
- ✅ Start frontend server (port 3000)
- ✅ Show test credentials
- ✅ Save logs to logs/ folder
- ✅ Keep everything running until you press Ctrl+C

---

## 📝 Manual Start (Step-by-Step)

If you prefer to run manually or the script doesn't work:

### 1️⃣ Install Prerequisites

Make sure you have:
- Python 3.8+ installed
- Node.js 16+ installed

Check with:
```bash
python3 --version
node --version
```

### 2️⃣ First Time Setup

**Backend Setup:**
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Setup database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Create test users
python seed_test_users.py
```

**Frontend Setup:**
```bash
cd frontend

# Install dependencies
npm install
```

### 3️⃣ Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 4️⃣ Access the Application

Open browser and go to: **http://localhost:3000**

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | admin123 |
| **Learner** | learner@test.com | learner123 |
| **Company** | company@test.com | company123 |
| **Supervisor** | supervisor@test.com | supervisor123 |

---

## 💡 Pro Tip: Use Admin Impersonation

Instead of logging in/out for each role:

1. Login as **admin@test.com** / **admin123**
2. Go to **User Sessions** (in sidebar)
3. Click **Impersonate** on any user
4. Instantly switch to that user's account! 🎉

---

## 🛑 Stopping the Application

**If using start.sh/start.bat:**
- Press `Ctrl + C` in the terminal (macOS/Linux)
- Close the terminal windows (Windows)

**If running manually:**
- Press `Ctrl + C` in each terminal window

---

## 🔄 Running Again Later

### Using the script:
```bash
./start.sh  # macOS/Linux
# OR double-click start.bat (Windows)
```

### Manually:
```bash
# Terminal 1
cd backend
source venv/bin/activate
python run.py

# Terminal 2
cd frontend
npm run dev
```

---

## ❓ Troubleshooting

### "Command not found" or "Module not found"

**Solution:** Make sure virtual environment is activated:
```bash
cd backend
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows
```

### "Port already in use"

**Solution:** Kill the process or use different port:
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill  # macOS/Linux

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill  # macOS/Linux
```

### "Database error"

**Solution:** Reset the database:
```bash
cd backend
rm skillbridge.db
rm -rf migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
python seed_test_users.py
```

### Still having issues?

See the detailed guide: **SETUP_AND_RUN.md**

---

## 📚 Additional Resources

- **SETUP_AND_RUN.md** - Detailed setup guide with troubleshooting
- **TEST_CREDENTIALS.md** - Quick reference for test accounts
- **AUTHENTICATION_TESTING_GUIDE.md** - How to test all features
- **DATABASE_DICTIONARY.md** - Database schema reference

---

## ✅ Success Checklist

After starting, you should have:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can access login page
- [ ] Can login with admin@test.com
- [ ] Can see admin dashboard
- [ ] No errors in terminal or browser console

---

## 🎯 What to Test First

1. **Login as Admin**
   - Email: admin@test.com
   - Password: admin123

2. **Go to User Sessions**
   - Click "User Sessions" in sidebar
   - See all test accounts

3. **Try Impersonation**
   - Click "Impersonate" on Learner
   - See learner dashboard
   - Try different roles!

4. **Explore Features**
   - As Supervisor: Create a course
   - As Company: Post a task
   - As Learner: Enroll and apply
   - As Admin: View analytics

---

## 🚀 You're Ready!

Your SkillBridge platform is now running!

**Frontend:** http://localhost:3000
**Backend API:** http://localhost:5000

Happy coding! 🎉

---

**Need help?** Check the other documentation files or look for errors in the terminal output.
