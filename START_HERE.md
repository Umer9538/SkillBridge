# 🚀 SkillBridge - START HERE!

## ⚡ One-Command Start (EASIEST WAY)

### macOS/Linux:
```bash
./start_all.sh
```

### Windows:
Double-click `start_all.bat`

**That's it!** 🎉

---

## 📋 What the Script Does

The unified start script will automatically:

1. ✅ Check if Python and Node.js are installed
2. ✅ Create virtual environment (if needed)
3. ✅ Install backend dependencies (if needed)
4. ✅ Install frontend dependencies (if needed)
5. ✅ Initialize database (if needed)
6. ✅ Create test users (if needed)
7. ✅ Start backend server on port 5001
8. ✅ Start frontend server on port 3000
9. ✅ Show you the test credentials
10. ✅ Keep both servers running

**Everything happens automatically!**

---

## 🌐 Access the Application

Once started, open your browser:

**Frontend:** http://localhost:3000

**Backend API:** http://localhost:5001 (used by frontend)

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | admin123 |
| **Learner** | learner@test.com | learner123 |
| **Company** | company@test.com | company123 |
| **Supervisor** | supervisor@test.com | supervisor123 |

---

## 🛑 Stop the Servers

**macOS/Linux:**
Press `Ctrl + C` in the terminal

**Windows:**
Close the terminal windows or press `Ctrl + C`

---

## 📝 View Logs

Logs are saved in the `logs` folder:

**macOS/Linux:**
```bash
# View backend logs
tail -f logs/backend.log

# View frontend logs
tail -f logs/frontend.log
```

**Windows:**
```bash
# View backend logs
type logs\backend.log

# View frontend logs
type logs\frontend.log
```

---

## 🔄 Run Again

Just run the same command:

**macOS/Linux:**
```bash
./start_all.sh
```

**Windows:**
```bash
start_all.bat
```

No setup needed the second time - it remembers everything!

---

## ✨ Pro Tips

1. **Test All Roles:** Login as admin and go to "User Sessions" to impersonate any user
2. **View Logs:** Check `logs/` folder if something goes wrong
3. **Clean Start:** Delete `backend/skillbridge.db` to reset database
4. **Port Issues:** If ports 3000 or 5001 are busy, close other apps using them

---

## ❓ Troubleshooting

### Script won't run (macOS/Linux)

**Make it executable:**
```bash
chmod +x start_all.sh
```

### "Permission denied"

**Run with bash:**
```bash
bash start_all.sh
```

### "Port already in use"

**Kill existing processes:**
```bash
# Kill backend (port 5001)
lsof -ti:5001 | xargs kill

# Kill frontend (port 3000)
lsof -ti:3000 | xargs kill
```

### "Module not found" or "Command not found"

**Make sure you have:**
- Python 3.8+ installed
- Node.js 16+ installed

**Check with:**
```bash
python3 --version
node --version
```

---

## 📚 Other Documentation

- **QUICKSTART.md** - Quick start guide
- **RUN_COMMANDS.md** - Manual run commands
- **SETUP_AND_RUN.md** - Detailed setup guide
- **TEST_CREDENTIALS.md** - Test accounts reference
- **USER_REGISTRATION_GUIDE.md** - Registration guide

---

## 🎯 What's Next?

1. ✅ Run `./start_all.sh` (or `start_all.bat` on Windows)
2. ✅ Wait for both servers to start
3. ✅ Open http://localhost:3000 in your browser
4. ✅ Login with **admin@test.com** / **admin123**
5. ✅ Click "User Sessions" to test different roles
6. ✅ Explore the platform!

---

## 🎉 You're Ready!

The unified start script makes it super easy to run SkillBridge.

**Just one command and you're up and running!** 🚀

---

**Need help?** Check the logs or other documentation files.
