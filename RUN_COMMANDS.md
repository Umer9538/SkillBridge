# 🚀 How to Run SkillBridge - WORKING COMMANDS

## ✅ Backend is Currently Running!

Your backend is already running on: **http://localhost:5001**

---

## 📝 Commands That Work on Your Mac

### Backend (Terminal 1)

```bash
cd /Users/mac/Documents/Project/skillBridge/backend

# Run the backend (choose ONE of these):
venv/bin/python3.10 run.py

# OR if you want to activate venv first:
source venv/bin/activate
python run.py
```

**Backend will run on:** http://localhost:5001

---

### Frontend (Terminal 2)

Open a **NEW terminal** and run:

```bash
cd /Users/mac/Documents/Project/skillBridge/frontend

# First time only - install dependencies:
npm install

# Run the frontend:
npm run dev
```

**Frontend will run on:** http://localhost:3000

---

## 🔑 Login Credentials (Already Created!)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | admin123 |
| **Learner** | learner@test.com | learner123 |
| **Company** | company@test.com | company123 |
| **Supervisor** | supervisor@test.com | supervisor123 |

---

## ⚡ Quick Start (What You Need to Do Now)

Since backend is already running, you just need to:

1. **Open a NEW terminal**
2. **Run frontend:**
   ```bash
   cd /Users/mac/Documents/Project/skillBridge/frontend
   npm run dev
   ```
3. **Open browser:** http://localhost:3000
4. **Login:** admin@test.com / admin123

---

## 🛑 Stop the Servers

**Backend:**
- Press `Ctrl + C` in the backend terminal

**Frontend:**
- Press `Ctrl + C` in the frontend terminal

---

## 🔄 Run Again Later

### Terminal 1 - Backend:
```bash
cd /Users/mac/Documents/Project/skillBridge/backend
venv/bin/python3.10 run.py
```

### Terminal 2 - Frontend:
```bash
cd /Users/mac/Documents/Project/skillBridge/frontend
npm run dev
```

---

## ⚠️ Important Notes

1. **Backend Port:** Your backend runs on port **5001** (not 5000)
2. **Virtual Environment:** Use `venv/bin/python3.10` to run Python scripts
3. **Two Terminals:** You need both backend AND frontend running
4. **Frontend .env:** Make sure it points to the correct backend URL

---

## 🔧 Frontend .env File

Make sure `/Users/mac/Documents/Project/skillBridge/frontend/.env` contains:

```env
VITE_API_URL=http://localhost:5001/api
```

**Note:** Port is **5001** not 5000!

---

## ✅ What's Working Now

- ✅ Backend dependencies installed
- ✅ Database created
- ✅ Migrations applied
- ✅ Test users created
- ✅ Backend running on port 5001

**Next step:** Start the frontend!

---

## 🎯 Test the Backend (Optional)

Open a browser and visit:
- http://localhost:5001 - Should see Flask running
- Test API: http://localhost:5001/api/auth/me (will get 401 unauthorized - that's correct!)

---

## 📱 Access the Application

Once frontend is running:

1. **Go to:** http://localhost:3000
2. **Login as Admin:** admin@test.com / admin123
3. **Try User Sessions:** Click "User Sessions" in sidebar
4. **Impersonate:** Click "Impersonate" to switch to any user

---

**Backend Status:** ✅ Running on port 5001
**Frontend Status:** ⏳ Need to start it

Run the frontend now! 🚀
