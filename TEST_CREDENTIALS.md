# SkillBridge - Test Credentials Quick Reference

## 🚀 Quick Start

1. **Seed test users:**
   ```bash
   cd backend
   python seed_test_users.py
   ```

2. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python run.py

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

---

## 🔑 Test User Credentials

### Admin Account
```
Email:    admin@test.com
Password: admin123
Access:   /admin/home
```
**Can do:**
- View analytics dashboard
- Manage all users
- Impersonate any user
- View all platform data

---

### Learner Account
```
Email:    learner@test.com
Password: learner123
Access:   /learner/home
```
**Can do:**
- Browse and enroll in courses
- Apply for company tasks
- Track learning progress
- Manage portfolio

---

### Company Account
```
Email:    company@test.com
Password: company123
Access:   /company/home
```
**Can do:**
- Post real-world tasks
- Review applicants
- Manage task listings
- Hire learners

---

### Supervisor Account
```
Email:    supervisor@test.com
Password: supervisor123
Access:   /supervisor/home
```
**Can do:**
- Create and manage courses
- Add modules and content
- Upload learning materials
- Evaluate learner progress

---

## ⚡ Admin Impersonation (Fastest Way to Test)

1. Login as admin: `admin@test.com` / `admin123`
2. Go to: **User Sessions** (in sidebar)
3. Click **Impersonate** on any user
4. Instantly switch to that user's account!

**No need to logout/login between different roles!**

---

## 📋 Testing Checklist

### ✅ Authentication Features
- [ ] Register new user
- [ ] Login with test credentials
- [ ] Forgot password flow
- [ ] Reset password with email link
- [ ] Change password (logged in)
- [ ] Logout

### ✅ Admin Features
- [ ] View analytics dashboard
- [ ] User management (edit/suspend/delete)
- [ ] Impersonate different roles
- [ ] View platform statistics

### ✅ Supervisor Features
- [ ] Create new course
- [ ] Add modules to course
- [ ] Upload course materials
- [ ] Manage course content

### ✅ Learner Features
- [ ] Browse available courses
- [ ] Enroll in course
- [ ] View course content
- [ ] Apply for tasks
- [ ] Track application status

### ✅ Company Features
- [ ] Post new task
- [ ] View applicants
- [ ] Accept/reject applications
- [ ] Manage task listings

---

## 🛠️ Useful Commands

```bash
# Reset database completely
cd backend
rm skillbridge.db
flask db upgrade
python seed_test_users.py

# Apply new migrations
cd backend
flask db migrate -m "Description"
flask db upgrade

# Check current user in database
cd backend
sqlite3 skillbridge.db
SELECT id, email, role, is_active FROM users;
.quit
```

---

## 🌐 Important URLs

| Page | URL | Access |
|------|-----|--------|
| Login | `http://localhost:3000/login` | Public |
| Register | `http://localhost:3000/register` | Public |
| Forgot Password | `http://localhost:3000/forgot-password` | Public |
| Admin Dashboard | `http://localhost:3000/admin/home` | Admin only |
| User Sessions | `http://localhost:3000/admin/sessions` | Admin only |
| Learner Home | `http://localhost:3000/learner/home` | Learner only |
| Company Home | `http://localhost:3000/company/home` | Company only |
| Supervisor Home | `http://localhost:3000/supervisor/home` | Supervisor only |

---

## 💡 Pro Tips

1. **Use Admin Impersonation** - Fastest way to test all roles without logging out
2. **Keep Terminal Visible** - Password reset links appear in backend console
3. **Check Browser Console** - For frontend errors and debugging
4. **Check Backend Console** - For API errors and email notifications
5. **Use Copy Buttons** - In User Sessions page for quick credential copying

---

## ⚠️ Remember

- These are **DEVELOPMENT ONLY** credentials
- **Never use in production**
- Passwords are intentionally simple for testing
- Change all credentials before deploying

---

**Need detailed guide?** See `AUTHENTICATION_TESTING_GUIDE.md`
