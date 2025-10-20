# SkillBridge - Authentication & User Testing Guide

This guide explains how to manage and test authentication for all user roles in the SkillBridge platform.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Test User Accounts](#test-user-accounts)
3. [User Impersonation (Admin Feature)](#user-impersonation)
4. [Testing Different User Roles](#testing-different-roles)
5. [Database Migration](#database-migration)

---

## Quick Start

### Step 1: Create Test Users

Run the seeding script to create test accounts for all roles:

```bash
cd backend
python seed_test_users.py
```

This will create the following test accounts:

| Role       | Email                | Password      |
|------------|----------------------|---------------|
| Admin      | admin@test.com       | admin123      |
| Learner    | learner@test.com     | learner123    |
| Company    | company@test.com     | company123    |
| Supervisor | supervisor@test.com  | supervisor123 |

### Step 2: Run Database Migration

Before testing, make sure your database has the latest schema (includes password reset fields):

```bash
cd backend
flask db migrate -m "Add password reset fields to user model"
flask db upgrade
```

### Step 3: Start the Application

**Backend:**
```bash
cd backend
python run.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## Test User Accounts

### Manual Login Method

1. Navigate to `http://localhost:3000/login`
2. Use any of the test credentials above
3. You'll be redirected to the appropriate dashboard based on role

### What Each Role Can Do

#### 🔴 Admin (`admin@test.com`)
- View platform analytics dashboard
- Manage all users (view, edit, suspend, delete)
- Impersonate any user account
- View user sessions
- Access: `/admin/home`, `/admin/users`, `/admin/sessions`

#### 🟢 Learner (`learner@test.com`)
- Browse and enroll in courses
- View course content and modules
- Apply for tasks posted by companies
- Track application status
- Build and manage portfolio
- Access: `/learner/home`, `/learner/courses`, `/learner/tasks`, `/learner/applications`, `/learner/portfolio`

#### 🔵 Company (`company@test.com`)
- Post real-world tasks/projects
- View and manage applicants
- Review learner applications
- Manage task listings
- Access: `/company/home`, `/company/tasks`, `/company/applicants`

#### 🟣 Supervisor (`supervisor@test.com`)
- Create and manage courses
- Add modules and learning content
- Upload course materials (documents, videos)
- Evaluate learner progress
- Access: `/supervisor/home`, `/supervisor/courses`, `/supervisor/evaluations`

---

## User Impersonation

The **Admin User Impersonation** feature allows admins to instantly switch to any user account without logging out. This is perfect for testing and debugging.

### How to Use Impersonation

1. **Login as Admin**
   ```
   Email: admin@test.com
   Password: admin123
   ```

2. **Navigate to User Sessions**
   - Click "User Sessions" in the admin sidebar
   - Or visit: `http://localhost:3000/admin/sessions`

3. **View All Users**
   - See complete list of all registered users
   - View user details: name, email, role, status

4. **Impersonate Any User**
   - Click the "Impersonate" button next to any user
   - You'll instantly switch to that user's account
   - You'll be redirected to their dashboard
   - All features will work as if you're logged in as them

5. **Switch Back**
   - Logout from the current impersonated account
   - Login as admin again
   - Or impersonate another user directly

### Quick Copy Credentials

The User Sessions page includes a "Quick Test Credentials" section with copy buttons:
- Click "Copy" next to any email or password
- Paste into login form
- Quick switching between different role accounts

---

## Testing Different Roles

### Scenario 1: Test Course Enrollment Flow

1. **As Supervisor** - Create a course
   - Login: `supervisor@test.com` / `supervisor123`
   - Go to: Courses → Create Course
   - Add course details and modules
   - Publish the course

2. **As Learner** - Enroll in course
   - Login: `learner@test.com` / `learner123`
   - Go to: Courses → Browse
   - Find the course and enroll
   - View course content

3. **As Admin** - Monitor activity
   - Login: `admin@test.com` / `admin123`
   - View analytics dashboard
   - See enrollment metrics

### Scenario 2: Test Task Application Flow

1. **As Company** - Post a task
   - Login: `company@test.com` / `company123`
   - Go to: Tasks → Create Task
   - Add task details and requirements

2. **As Learner** - Apply to task
   - Login: `learner@test.com` / `learner123`
   - Go to: Tasks → Browse
   - Find task and submit application

3. **As Company** - Review applications
   - View applicants
   - Accept/Reject applications

4. **As Learner** - Check application status
   - Go to: My Applications
   - See status updates

### Scenario 3: Test Admin Features

1. **User Management**
   - Login as admin
   - Go to: Users
   - Edit user information
   - Suspend/Activate accounts
   - Delete test users

2. **Analytics Dashboard**
   - View platform statistics
   - See user distribution charts
   - Check engagement metrics
   - View top courses and companies
   - Monitor recent activity

3. **User Impersonation**
   - Go to: User Sessions
   - Impersonate different roles
   - Test features from each perspective
   - Switch between accounts instantly

---

## Database Migration

### If You Need to Reset the Database

```bash
cd backend

# Remove existing database
rm skillbridge.db

# Remove migration files (optional, only if you want clean migrations)
rm -rf migrations

# Initialize migrations
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade

# Seed test users
python seed_test_users.py
```

### If You Only Need New Fields

```bash
cd backend

# Create migration for new changes
flask db migrate -m "Add password reset fields"

# Apply migration
flask db upgrade
```

---

## Testing Password Reset Flow

### Step 1: Request Password Reset

1. Go to login page: `http://localhost:3000/login`
2. Click "Forgot password?" link
3. Enter email: `learner@test.com`
4. Click "Send Reset Link"

### Step 2: Check Email (Development Mode)

In development, password reset emails are printed to the backend console. Look for:
```
Password Reset Link: http://localhost:3000/reset-password?token=xxxxx
```

### Step 3: Reset Password

1. Copy the reset link from console
2. Paste in browser
3. Enter new password (min 6 characters)
4. Confirm password
5. Click "Reset Password"

### Step 4: Login with New Password

1. Go to login page
2. Use the new password you just set
3. Should login successfully

---

## Email Notifications (Configured)

The platform sends emails for the following events:

✅ **Welcome Email** - When user registers
✅ **Password Reset** - When user requests password reset
✅ **Course Enrollment** - When learner enrolls in course
✅ **Task Application** - To learner and company when application submitted
✅ **Application Status** - When company updates application status
✅ **Account Status** - When admin activates/suspends account

### Email Configuration

Update `.env` file in backend:

```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Note:** For Gmail, you need to use an App Password, not your regular password.

---

## API Endpoints for Authentication

### Public Endpoints (No Auth Required)

```
POST /api/auth/register          - Register new user
POST /api/auth/login             - Login user
POST /api/auth/forgot-password   - Request password reset
POST /api/auth/reset-password    - Reset password with token
POST /api/auth/verify-reset-token - Verify if reset token is valid
```

### Protected Endpoints (Auth Required)

```
GET  /api/auth/me                - Get current user info
POST /api/auth/refresh           - Refresh access token
PUT  /api/auth/change-password   - Change password (requires old password)
```

### Admin Only Endpoints

```
GET  /api/admin/users            - Get all users
GET  /api/admin/users/:id        - Get specific user
PUT  /api/admin/users/:id        - Update user
DELETE /api/admin/users/:id      - Delete user
PUT  /api/admin/users/:id/toggle-active - Suspend/Activate user
POST /api/admin/impersonate/:id  - Impersonate user (returns new token)
```

---

## Troubleshooting

### Issue: "Invalid or expired reset token"

**Solution:** Reset tokens expire after 1 hour. Request a new password reset link.

### Issue: "Cannot impersonate inactive user"

**Solution:** Activate the user first from User Management page, then try impersonating.

### Issue: Test users already exist

**Solution:** This is fine. The seed script skips if test users exist. You can still use the existing accounts.

### Issue: Database schema out of date

**Solution:** Run migrations:
```bash
cd backend
flask db upgrade
```

### Issue: Emails not sending

**Solution:**
1. Check `.env` file has correct MAIL_* settings
2. For Gmail, use App Password (not regular password)
3. In development, emails are logged to console anyway

---

## Security Notes

⚠️ **Important:** These test accounts are for DEVELOPMENT ONLY!

- Never use these credentials in production
- Change all passwords in production
- Disable impersonation feature in production (or add additional security)
- Use environment variables for sensitive data
- Never commit `.env` file to version control

---

## Quick Reference Commands

```bash
# Seed test users
python backend/seed_test_users.py

# Run migrations
cd backend
flask db upgrade

# Start backend
cd backend
python run.py

# Start frontend
cd frontend
npm run dev

# Access admin panel
# Login: admin@test.com / admin123
# URL: http://localhost:3000/admin/sessions
```

---

## Need Help?

- Check backend console for error messages
- Check browser console for frontend errors
- Verify database migrations are up to date
- Ensure both backend and frontend are running
- Check that ports 5000 (backend) and 3000 (frontend) are not in use

---

**Last Updated:** 2025
**Platform:** SkillBridge Learning Management System
