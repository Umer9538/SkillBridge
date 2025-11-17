# 🎓 SkillBridge - AI-Powered Learning Management Platform

Bridge the Gap Between Learning and Practice with Intelligent Matching

---

## 🚀 Quick Start (One Command!)

### macOS/Linux:
```bash
./start_all.sh
```

### Windows:
```bash
start_all.bat
```

**That's it!** Open http://localhost:3000 and login with:
- **Admin:** admin@test.com / admin123
- **Learner:** learner@test.com / learner123
- **Company:** company@test.com / company123
- **Supervisor:** supervisor@test.com / supervisor123

---

## 📖 What is SkillBridge?

SkillBridge is a comprehensive AI-powered learning management platform that connects:
- 🎓 **Learners** - People who want to learn new skills and find opportunities
- 🏢 **Companies** - Businesses looking for talented individuals
- 👨‍🏫 **Supervisors** - Course creators and educators
- 🛡️ **Admins** - Platform administrators with full oversight

The platform uses **AI-powered recommendations** to match learners with relevant courses and companies with qualified candidates based on skills, interests, and performance.

---

## ✨ Key Features

### For Learners 🎓
- 📚 **Course Enrollment** - Browse and enroll in courses with AI recommendations
- 🎯 **Task Applications** - Apply for real-world tasks and projects from companies
- 📊 **Progress Tracking** - Monitor course completion and learning progress
- 🏆 **Portfolio Management** - Build and showcase professional portfolio
- ⭐ **Course Reviews** - Rate and review completed courses
- 💬 **Messaging** - Communicate with supervisors and companies
- 🤖 **AI Recommendations** - Get personalized course suggestions based on skills and interests
- 📧 **Notifications** - Receive email updates on applications and enrollments

### For Companies 🏢
- 📝 **Task Management** - Create, edit, and delete task postings with rich details
- 👥 **Application Review** - Review, accept, or reject learner applications
- 🎯 **Talent Discovery** - Find qualified learners with skill matching
- 📈 **Analytics Dashboard** - Track tasks, applications, and acceptance rates
- 💬 **Direct Messaging** - Communicate with applicants
- 📧 **Email Notifications** - Get notified when learners apply to your tasks
- 🤖 **AI Matching** - Get AI-recommended learners based on your task requirements
- 📊 **Company Profile** - Manage company information and settings

### For Supervisors 👨‍🏫
- 🎓 **Course Creation** - Create comprehensive courses with metadata
- 📹 **Module Management** - Add modules with videos, documents, links, and text content
- 📊 **Student Evaluations** - Track student progress and completion rates
- ⭐ **Course Analytics** - View enrollments, ratings, and performance metrics
- 💬 **Student Communication** - Message enrolled students
- 📧 **Notifications** - Get updates on course enrollments and reviews
- 👤 **Profile Management** - Manage instructor profile and expertise areas
- 🎯 **Content Organization** - Order and structure course modules effectively

### For Admins 🛡️
- 👥 **User Management** - Full CRUD operations on all users (view, edit, suspend, delete)
- 🔄 **User Impersonation** - Switch to any user account for testing and support
- 📊 **Platform Analytics** - Comprehensive dashboard with growth metrics and statistics
- 📚 **Content Management** - Moderate and manage all courses and tasks
- ⚙️ **System Settings** - Configure platform settings and maintenance mode
- 📧 **Email Configuration** - Manage SMTP settings
- 🛡️ **Security Settings** - Control user registration and email verification
- 👤 **Admin Profile** - Manage admin account and security settings

---

## 🛠️ Tech Stack

### Backend
- **Flask** 3.0.0 - Python web framework
- **SQLAlchemy** - ORM for database
- **SQLite** - Database (development)
- **Flask-JWT-Extended** - Authentication
- **Flask-Mail** - Email notifications
- **Flask-Bcrypt** - Password hashing

### Frontend
- **React** 18 - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** v6 - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

---

## 🔑 Test Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Admin** | admin@test.com | admin123 | /admin/home |
| **Learner** | learner@test.com | learner123 | /learner/home |
| **Company** | company@test.com | company123 | /company/home |
| **Supervisor** | supervisor@test.com | supervisor123 | /supervisor/home |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### Run

**macOS/Linux:**
```bash
./start_all.sh
```

**Windows:**
```bash
start_all.bat
```

**Open browser:** http://localhost:3000

---

## 📚 Documentation

### 🚀 Getting Started
- **[PROJECT_SETUP_GUIDE.md](PROJECT_SETUP_GUIDE.md)** - What you need, what we use, how to setup ⭐
- **[QUICK_SETUP.md](QUICK_SETUP.md)** - 5-minute quick setup guide
- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Complete installation instructions
- **[START_HERE.md](START_HERE.md)** - Beginner's guide
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference

### 👥 User Guides
- **[USER_REGISTRATION_GUIDE.md](USER_REGISTRATION_GUIDE.md)** - Registration flow
- **[AUTHENTICATION_TESTING_GUIDE.md](AUTHENTICATION_TESTING_GUIDE.md)** - Testing guide
- **[TEST_CREDENTIALS.md](TEST_CREDENTIALS.md)** - All test accounts

### 🚢 Deployment
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment guide

### 📖 Additional Documentation
- **[FEATURES.md](FEATURES.md)** - Complete features documentation
- **[SETUP_AND_RUN.md](SETUP_AND_RUN.md)** - Detailed setup instructions
- **[RUN_COMMANDS.md](RUN_COMMANDS.md)** - Manual run commands

---

## 🎯 What's Implemented

### ✅ Core Features (100% Complete)
- **Authentication System**
  - User registration with role selection (Learner, Company, Supervisor)
  - Secure login with JWT tokens
  - Password reset flow with email tokens
  - Role-based access control (RBAC)
  - Admin-only registration restriction

- **User Management**
  - Full CRUD operations (Create, Read, Update, Delete)
  - User profile management for all roles
  - Account activation/suspension
  - User impersonation for admins

- **Course Management**
  - Create, edit, delete courses
  - Course thumbnails and metadata
  - Prerequisites and learning objectives
  - Course status (draft/published/archived)
  - Course reviews and ratings

- **Module Management**
  - Multiple content types (text, video, document, link)
  - Module ordering and organization
  - Module preview functionality
  - CRUD operations on modules

- **Task Management**
  - Create, edit, delete task postings
  - Skills required and deliverables
  - Application deadline management
  - Task difficulty levels

- **Application System**
  - Apply for tasks with cover letters
  - Application status tracking
  - Accept/reject with email notifications
  - Application history

- **Messaging System**
  - One-on-one messaging between users
  - Conversation threads
  - Unread message tracking
  - User search for new conversations
  - Read receipts

- **AI Features**
  - Course recommendations based on skills and interests
  - Learner-to-task matching with skill scoring
  - Company-to-learner recommendations
  - Code evaluation (simulated)

- **Analytics & Reporting**
  - Platform-wide analytics for admins
  - Company task and application metrics
  - Supervisor course performance tracking
  - Learner progress monitoring

- **Notifications**
  - Email notifications for all major events
  - Welcome emails on registration
  - Password reset emails
  - Application status updates
  - Enrollment confirmations

- **File Management**
  - File upload with validation
  - Support for images, documents, videos
  - File size limits and type checking
  - Profile pictures and course thumbnails

- **Portfolio System**
  - Learner portfolio showcase
  - Certificate generation
  - Completed courses and tasks display

### 🔧 Technical Features
- RESTful API architecture
- JWT-based authentication
- CORS support
- Database migrations
- One-command startup scripts
- Comprehensive error handling
- Responsive UI design
- Dark mode support

---

## 📊 Platform Statistics

### API Endpoints
- **Total Endpoints:** 80+
- **Auth Endpoints:** 6 (login, register, password reset, etc.)
- **Learner Endpoints:** 12 (courses, tasks, portfolio, etc.)
- **Company Endpoints:** 10 (tasks, applications, analytics)
- **Supervisor Endpoints:** 15 (courses, modules, evaluations)
- **Admin Endpoints:** 12 (users, analytics, content, settings)
- **Common Endpoints:** 10 (messages, notifications, reviews)
- **AI Endpoints:** 5 (recommendations, matching, evaluation)

### Database Models
- **Core Models:** 15+ (User, Learner, Company, Supervisor, Course, Module, Task, Application, etc.)
- **Supporting Models:** Message, Notification, Review, Enrollment, Certificate, Portfolio

### UI Pages
- **Total Pages:** 40+
- **Authentication:** 4 pages (Login, Register, Forgot/Reset Password)
- **Learner Pages:** 7 pages (Dashboard, Courses, Tasks, Portfolio, etc.)
- **Company Pages:** 6 pages (Dashboard, Tasks, Applicants, Analytics, Profile)
- **Supervisor Pages:** 6 pages (Dashboard, Courses, Modules, Evaluations, Analytics, Profile)
- **Admin Pages:** 7 pages (Dashboard, Users, Sessions, Analytics, Content, Settings, Profile)
- **Common Pages:** 3 pages (Messages, Notifications, Settings)

---

## 🚦 Project Status

**Current Status:** ✅ **Production Ready**

All critical features have been implemented and tested:
- ✅ User authentication and authorization
- ✅ Course and module management
- ✅ Task posting and applications
- ✅ Messaging system
- ✅ AI-powered recommendations
- ✅ Analytics dashboards
- ✅ Email notifications
- ✅ File uploads
- ✅ Admin panel with full control
- ✅ Responsive design

**Recent Updates:**
- ✅ Fixed messaging system with "New Message" feature
- ✅ Fixed module navigation routing
- ✅ Added GET endpoint for fetching course modules
- ✅ Enhanced AI recommendation system
- ✅ Improved user experience across all roles

---

## 🛑 Stop Servers

Press `Ctrl + C` in terminal where servers are running

---

## 📂 Project Structure

```
skillBridge/
├── backend/                 # Flask backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   │   └── __init__.py     # App initialization
│   ├── instance/           # SQLite database
│   ├── venv/              # Python virtual environment
│   └── run.py             # Backend entry point
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # API and helpers
│   │   └── App.jsx        # Main app component
│   └── package.json       # Node dependencies
│
├── logs/                  # Application logs
├── start_all.sh           # One-command start (macOS/Linux)
├── start_all.bat          # One-command start (Windows)
└── README.md             # This file
```

---

## 🤝 Contributing

This is a complete learning management platform. Key areas for potential enhancements:
- Real-time chat with WebSockets
- Video conferencing integration
- Advanced AI with OpenAI/Claude integration
- Payment processing for premium courses
- Mobile app development
- Advanced analytics with charts
- Social features (forums, groups)

---

## 📄 License

This project is for educational purposes.

---

## 🎉 Start Now!

```bash
# macOS/Linux
./start_all.sh

# Windows
start_all.bat
```

**Happy Learning! 🚀**

---

## 💡 Need Help?

- Check **START_HERE.md** for detailed setup guide
- Review **TEST_CREDENTIALS.md** for all test accounts
- See **QUICKSTART.md** for quick reference
- Contact admin for platform support
