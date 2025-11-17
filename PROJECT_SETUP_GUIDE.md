# 🚀 SkillBridge - Project Setup Guide

A simple guide covering what you need, what we use, and how to set up SkillBridge.

---

## 📋 What You Need (Prerequisites)

Before running this project, install these on your computer:

### 1. Python (Version 3.8 or higher)
**What it is:** Programming language for the backend
**Why we need it:** Runs the server and handles all database operations

**Download:**
- Windows/Mac: [python.org/downloads](https://www.python.org/downloads/)
- Linux: `sudo apt install python3 python3-pip`

**Verify:**
```bash
python --version
# Should show: Python 3.8.x or higher
```

### 2. Node.js (Version 16 or higher)
**What it is:** JavaScript runtime for the frontend
**Why we need it:** Runs React and builds the user interface

**Download:**
- All platforms: [nodejs.org](https://nodejs.org/) (Download LTS version)

**Verify:**
```bash
node --version
npm --version
# Should show: v16.x.x or higher
```

### 3. Git (Latest version)
**What it is:** Version control system
**Why we need it:** Downloads the project code

**Download:**
- All platforms: [git-scm.com](https://git-scm.com/)

**Verify:**
```bash
git --version
# Should show: git version 2.x.x
```

---

## 🛠️ What We're Using (Technologies)

### Backend (Server Side)

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Flask** | Web framework | Handles API requests, routing |
| **SQLAlchemy** | Database ORM | Manages database operations |
| **SQLite** | Database | Stores all data (users, courses, tasks) |
| **JWT** | Authentication | Secure user login/sessions |
| **Flask-Mail** | Email service | Sends notifications |
| **Bcrypt** | Password hashing | Encrypts passwords securely |

### Frontend (User Interface)

| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **React 18** | UI framework | Builds interactive user interface |
| **Vite** | Build tool | Fast development and building |
| **Tailwind CSS** | Styling | Beautiful, responsive design |
| **React Router** | Navigation | Multi-page navigation |
| **Axios** | HTTP client | Communicates with backend API |
| **Lucide Icons** | Icons | Professional icon library |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Virtual Environment (venv)** | Isolates Python dependencies |
| **npm** | Manages JavaScript packages |
| **Git** | Version control |

---

## ⚙️ How to Set Up

### Step 1: Download the Project

```bash
# Clone from GitHub
git clone https://github.com/Umer9538/SkillBridge.git

# Enter project folder
cd SkillBridge
```

### Step 2: Set Up the Backend

```bash
# Go to backend folder
cd backend

# Create isolated Python environment
python -m venv venv

# Activate the environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install all Python packages
pip install -r requirements.txt

# Go back to project root
cd ..
```

**What this does:**
- Creates a clean Python environment (venv)
- Installs Flask, SQLAlchemy, JWT, and all other Python packages
- Keeps project dependencies separate from your system

### Step 3: Set Up the Frontend

```bash
# Go to frontend folder
cd frontend

# Install all JavaScript packages
npm install

# Go back to project root
cd ..
```

**What this does:**
- Installs React, Vite, Tailwind CSS, and all other JavaScript packages
- Downloads dependencies into `node_modules` folder
- Prepares the frontend for development

### Step 4: Run the Project

**Easy Way (One Command):**

```bash
# On Windows:
start_all.bat

# On macOS/Linux:
./start_all.sh
```

**What this does:**
- Starts backend server on port 5001
- Starts frontend server on port 3000
- Creates database and test users automatically
- Opens browser to http://localhost:3000

**Manual Way (Two Terminals):**

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python run.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

1. Open browser: **http://localhost:3000**
2. Login with test account:
   - Email: `admin@test.com`
   - Password: `admin123`

---

## 📂 Project Structure

```
SkillBridge/
│
├── backend/                    # Server-side code
│   ├── app/
│   │   ├── models/            # Database tables (User, Course, Task, etc.)
│   │   ├── routes/            # API endpoints (/api/auth, /api/courses, etc.)
│   │   ├── utils/             # Helper functions (email, file upload, AI)
│   │   └── __init__.py        # App initialization
│   ├── instance/
│   │   └── skillbridge.db     # SQLite database (created automatically)
│   ├── venv/                  # Python virtual environment
│   ├── requirements.txt       # Python dependencies
│   └── run.py                 # Backend entry point
│
├── frontend/                   # User interface code
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components (Login, Dashboard, etc.)
│   │   ├── contexts/          # React state management
│   │   ├── utils/             # API calls and helpers
│   │   └── App.jsx            # Main application component
│   ├── package.json           # JavaScript dependencies
│   └── vite.config.js         # Build configuration
│
├── logs/                       # Application logs
├── start_all.sh               # Quick start script (macOS/Linux)
├── start_all.bat              # Quick start script (Windows)
└── README.md                  # Project overview
```

---

## 🔍 How It Works

### The Flow:

1. **User opens browser** → Goes to http://localhost:3000
2. **Frontend (React)** → Shows login page
3. **User logs in** → React sends credentials to backend
4. **Backend (Flask)** → Checks database, creates JWT token
5. **Frontend gets token** → Stores it, redirects to dashboard
6. **User browses courses** → React requests data from backend
7. **Backend queries database** → Returns course data as JSON
8. **Frontend displays data** → Shows courses with nice UI

### The Architecture:

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│   Browser   │  HTTP    │   Backend   │  SQL     │  Database   │
│   (React)   │ ←──────→ │   (Flask)   │ ←──────→ │  (SQLite)   │
│  Port 3000  │   API    │  Port 5001  │  Query   │   .db file  │
└─────────────┘          └─────────────┘          └─────────────┘
```

---

## 🎓 Understanding the Components

### Backend Components:

**1. Models (Database Tables)**
- `User` - All users (learners, companies, supervisors, admins)
- `Course` - Course information
- `Module` - Course content (videos, documents)
- `Task` - Company job postings
- `Application` - Task applications
- `Message` - User messages
- `Review` - Course reviews

**2. Routes (API Endpoints)**
- `/api/auth` - Login, register, password reset
- `/api/courses` - Browse and enroll in courses
- `/api/tasks` - Browse and apply for tasks
- `/api/messages` - Send and receive messages
- `/api/supervisors` - Create and manage courses
- `/api/companies` - Post and manage tasks
- `/api/admin` - Platform administration

**3. Utils (Helper Functions)**
- `email_service.py` - Sends emails
- `file_upload.py` - Handles file uploads
- `ai_service.py` - AI recommendations

### Frontend Components:

**1. Pages**
- Login/Register pages
- Dashboards (for each role)
- Course browser and player
- Task listings
- Profile pages
- Admin panel

**2. Components**
- Navigation bar
- Sidebar menu
- Course cards
- Task cards
- Message bubbles
- Forms and buttons

**3. Contexts**
- Authentication context (manages login state)

---

## 🔐 Test Accounts

After setup, you can login with these test accounts:

| Role | Email | Password | What You Can Do |
|------|-------|----------|-----------------|
| **Admin** | admin@test.com | admin123 | Manage users, view analytics |
| **Learner** | learner@test.com | learner123 | Take courses, apply for tasks |
| **Company** | company@test.com | company123 | Post tasks, review applications |
| **Supervisor** | supervisor@test.com | supervisor123 | Create courses, manage modules |

---

## ❗ Common Issues

### Issue 1: "Python command not found"
**Solution:** Install Python from python.org or use `python3` instead of `python`

### Issue 2: "npm command not found"
**Solution:** Install Node.js from nodejs.org (npm comes with it)

### Issue 3: "Port 5001 already in use"
**Solution:**
```bash
# Find and kill the process
# macOS/Linux:
lsof -ti:5001 | xargs kill -9

# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Issue 4: "Module not found" errors
**Solution:**
```bash
# Reinstall backend dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Reinstall frontend dependencies
cd frontend
npm install
```

### Issue 5: Can't activate virtual environment on Windows
**Solution:**
Run this in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy RemoteSigned
```

---

## 🛑 How to Stop

Press **Ctrl + C** in the terminal window(s) where the servers are running.

---

## 📚 What's Next?

After successful setup:

1. **Explore the platform** - Login with different test accounts
2. **Try features** - Create courses, post tasks, send messages
3. **Read documentation** - Check FEATURES.md for all capabilities
4. **Learn the code** - Explore backend and frontend folders
5. **Customize** - Modify to fit your needs

---

## 🆘 Need More Help?

- **Quick Setup:** See QUICK_SETUP.md
- **Detailed Installation:** See INSTALLATION_GUIDE.md
- **All Features:** See FEATURES.md
- **Production Deployment:** See DEPLOYMENT_GUIDE.md
- **All Documentation:** See DOCUMENTATION_INDEX.md

---

## ✅ Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Git installed
- [ ] Project cloned
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend running (port 5001)
- [ ] Frontend running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can login with test account

---

## 🎉 You're Ready!

Once all checkboxes are checked, you're ready to use SkillBridge!

**Start the app:**
```bash
./start_all.sh  # macOS/Linux
start_all.bat   # Windows
```

**Access:** http://localhost:3000

**Happy Learning! 🚀**
