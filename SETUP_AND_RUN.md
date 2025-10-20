# SkillBridge - Setup and Run Guide

Complete guide to set up and run the SkillBridge platform on your local machine.

---

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, but recommended)

### Check if you have them installed:

```bash
python --version  # or python3 --version
node --version
npm --version
```

---

## 🚀 First Time Setup

### Step 1: Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd /Users/mac/Documents/Project/skillBridge/backend
```

#### 1.1 Create Python Virtual Environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` appear in your terminal prompt.

#### 1.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

If this fails, try:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 1.3 Create Environment File

Create a file named `.env` in the `backend` folder:

```bash
touch .env  # On macOS/Linux
# Or manually create .env file on Windows
```

Add the following content to `.env`:

```env
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-change-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production

# Database
DATABASE_URL=sqlite:///skillbridge.db

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional for development)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Upload Configuration
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
```

**Note:** Email configuration is optional for testing. Emails will be printed to console in development mode.

#### 1.4 Initialize Database

```bash
# Initialize Flask migrations
flask db init

# Create initial migration
flask db migrate -m "Initial migration"

# Apply migration to create tables
flask db upgrade
```

#### 1.5 Seed Test Users

```bash
python seed_test_users.py
```

You should see output with test credentials:
```
✅ Created admin: admin@test.com (password: admin123)
✅ Created learner: learner@test.com (password: learner123)
✅ Created company: company@test.com (password: company123)
✅ Created supervisor: supervisor@test.com (password: supervisor123)
```

---

### Step 2: Frontend Setup

Open a **NEW terminal** (keep the backend terminal open) and navigate to frontend:

```bash
cd /Users/mac/Documents/Project/skillBridge/frontend
```

#### 2.1 Install Node Dependencies

```bash
npm install
```

This will take a few minutes to install all dependencies.

#### 2.2 Create Environment File

Create a file named `.env` in the `frontend` folder:

```bash
touch .env  # On macOS/Linux
# Or manually create .env file on Windows
```

Add the following content to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ Running the Application

You need **TWO terminals** - one for backend, one for frontend.

### Terminal 1: Run Backend

```bash
cd /Users/mac/Documents/Project/skillBridge/backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Run the backend server
python run.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Running on http://localhost:5000
```

**Keep this terminal running!**

---

### Terminal 2: Run Frontend

```bash
cd /Users/mac/Documents/Project/skillBridge/frontend

# Run the development server
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal running too!**

---

## 🌐 Access the Application

Open your web browser and go to:

**Frontend:** http://localhost:3000

You should see the SkillBridge login page!

**Backend API:** http://localhost:5000 (used by frontend automatically)

---

## 🔑 Login with Test Accounts

Use these credentials to test different roles:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@test.com | admin123 |
| **Learner** | learner@test.com | learner123 |
| **Company** | company@test.com | company123 |
| **Supervisor** | supervisor@test.com | supervisor123 |

---

## 🛑 Stopping the Application

### Stop Backend:
- Go to the backend terminal
- Press `Ctrl + C`

### Stop Frontend:
- Go to the frontend terminal
- Press `Ctrl + C`

---

## 🔄 Running Again (After First Setup)

After the first setup, you only need to:

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # macOS/Linux
# OR venv\Scripts\activate for Windows
python run.py
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

---

## 🐛 Troubleshooting

### Problem: "Port 5000 already in use"

**Solution:**
```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill  # macOS/Linux
# OR
netstat -ano | findstr :5000  # Windows (find PID, then kill it)
```

Or change the port in `backend/run.py`:
```python
app.run(debug=True, port=5001)  # Use port 5001 instead
```

---

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill  # macOS/Linux
```

Or use a different port:
```bash
npm run dev -- --port 3001
```

---

### Problem: "Module not found" or "Command not found"

**Backend Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Frontend Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: "Database is locked" or "No such table"

**Solution:**
```bash
cd backend

# Reset database
rm skillbridge.db
rm -rf migrations

# Recreate database
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Reseed test users
python seed_test_users.py
```

---

### Problem: Frontend can't connect to Backend

**Check:**
1. Backend is running on port 5000
2. Frontend `.env` has: `VITE_API_URL=http://localhost:5000/api`
3. No CORS errors in browser console

**Solution:**
```bash
# Restart both servers
# Check backend terminal for errors
# Check browser console (F12) for errors
```

---

### Problem: "Cannot find module 'flask'"

**Solution:**
```bash
# Virtual environment not activated
cd backend
source venv/bin/activate  # macOS/Linux
# OR venv\Scripts\activate for Windows

# Then try running again
python run.py
```

---

## 📁 Project Structure

```
skillBridge/
├── backend/
│   ├── app/                    # Application code
│   │   ├── models/            # Database models
│   │   ├── routes/            # API endpoints
│   │   └── utils/             # Utility functions
│   ├── migrations/            # Database migrations
│   ├── uploads/               # Uploaded files
│   ├── venv/                  # Virtual environment (created by you)
│   ├── .env                   # Environment variables (create this)
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Python dependencies
│   ├── run.py                 # Application entry point
│   └── seed_test_users.py     # Test user seeding script
│
├── frontend/
│   ├── public/                # Static files
│   ├── src/                   # Source code
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main app component
│   ├── node_modules/          # Node dependencies (created by npm)
│   ├── .env                   # Environment variables (create this)
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
├── SETUP_AND_RUN.md           # This file
├── TEST_CREDENTIALS.md        # Test credentials reference
└── AUTHENTICATION_TESTING_GUIDE.md  # Testing guide
```

---

## 🎯 Quick Commands Reference

### Backend Commands (in backend folder)

```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Run backend
python run.py

# Database migrations
flask db migrate -m "Description"
flask db upgrade

# Seed test users
python seed_test_users.py

# Open SQLite database
sqlite3 skillbridge.db
```

### Frontend Commands (in frontend folder)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Using the Application

### 1. Admin Dashboard
- Login: `admin@test.com` / `admin123`
- Access admin features
- Use "User Sessions" to impersonate other users

### 2. Quick Testing
- Go to: Admin → User Sessions
- Click "Impersonate" to switch to any role instantly
- No need to logout/login manually!

### 3. Creating Content
- **As Supervisor:** Create courses and modules
- **As Company:** Post tasks for learners
- **As Learner:** Enroll in courses and apply for tasks

---

## 🔒 Important Notes

1. **Keep Both Terminals Running** - You need both backend and frontend running simultaneously
2. **Virtual Environment** - Always activate it before running backend
3. **Environment Files** - Don't commit `.env` files to Git (they're in `.gitignore`)
4. **Test Credentials** - Only for development, change before production
5. **Database** - SQLite is used for development (easy setup, no server needed)

---

## 🎉 Success Checklist

- [ ] Python and Node.js installed
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] `.env` files created in both folders
- [ ] Database initialized (`flask db upgrade`)
- [ ] Test users seeded (`python seed_test_users.py`)
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can login with test credentials
- [ ] No errors in terminals or browser console

---

## 📞 Need Help?

If you're stuck:

1. **Check Terminal Output** - Look for error messages
2. **Check Browser Console** - Press F12 to see frontend errors
3. **Verify Prerequisites** - Make sure Python and Node.js are installed
4. **Check Ports** - Make sure 5000 and 3000 are not in use
5. **Restart Everything** - Sometimes a fresh start helps!

---

## 🚀 Next Steps

Once running successfully:

1. Read `TEST_CREDENTIALS.md` for test account details
2. Read `AUTHENTICATION_TESTING_GUIDE.md` for testing scenarios
3. Explore the admin dashboard
4. Try the user impersonation feature
5. Test different user roles and features

---

**Happy Coding! 🎉**
