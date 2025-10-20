# SkillBridge - User Registration Guide

Complete guide to user registration and role management in SkillBridge.

---

## 🎯 User Roles Overview

SkillBridge has 4 different user roles, each with specific permissions and access:

### 1. 🟢 Learner
**Who:** Students, professionals looking to upskill
**Can do:**
- Browse and enroll in courses
- View course content and modules
- Apply for company tasks
- Track learning progress
- Build portfolio

**Registration:** ✅ Public (anyone can register)

---

### 2. 🔵 Company
**Who:** Businesses looking to hire talent
**Can do:**
- Post real-world tasks/projects
- Review learner applications
- Manage task listings
- Hire learners for projects

**Registration:** ✅ Public (anyone can register)

---

### 3. 🟣 Supervisor
**Who:** Instructors, educators, course creators
**Can do:**
- Create and manage courses
- Add modules and learning content
- Upload course materials (videos, documents)
- Evaluate learner progress
- Manage course enrollments

**Registration:** ✅ Public (anyone can register)

---

### 4. 🔴 Admin
**Who:** Platform administrators
**Can do:**
- Manage all users (view, edit, suspend, delete)
- View platform analytics
- Impersonate any user
- Create other admin accounts
- Monitor platform activity

**Registration:** ❌ RESTRICTED (only existing admins can create)

---

## 📝 How to Register as User

### Step 1: Go to Registration Page

Navigate to: **http://localhost:3000/register**

### Step 2: Choose Your Role

You'll see 3 options (Admin is NOT available):

**Option 1: Learner**
- Best for: Students, job seekers, professionals
- Description: "Learn new skills, enroll in courses, and apply for real-world tasks"

**Option 2: Company**
- Best for: Employers, businesses, recruiters
- Description: "Post tasks and hire talented learners for your projects"

**Option 3: Supervisor**
- Best for: Teachers, instructors, course creators
- Description: "Create and manage courses, add learning content and modules"

### Step 3: Fill in Your Details

**For Learner/Supervisor:**
- Full Name
- Email Address
- Password (min 6 characters)
- Confirm Password

**For Company (Additional Field):**
- Contact Name
- **Company Name** (additional field for companies)
- Email Address
- Password (min 6 characters)
- Confirm Password

### Step 4: Submit

Click "Create Account" button

### Step 5: Automatic Login

Upon successful registration:
- ✅ Account is created
- ✅ Welcome email is sent
- ✅ Automatically logged in
- ✅ Redirected to role-specific dashboard

---

## 🔒 Admin Registration (Restricted)

Admin accounts **CANNOT** be created through public registration.

### Why?
- Security: Prevents unauthorized admin access
- Control: Only trusted users should have admin privileges
- Audit: Admin creation is tracked and controlled

### How to Create Admin Accounts

Only existing admins can create new admin accounts:

#### Method 1: Via Admin Panel (Future Feature)
1. Login as admin
2. Go to User Management
3. Click "Create Admin User"
4. Fill in details
5. Submit

#### Method 2: Via API (Current Method)

**Endpoint:** `POST /api/admin/create-admin`

**Headers:**
```
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "New Admin Name",
  "email": "newadmin@example.com",
  "password": "secure_password"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:5001/api/admin/create-admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Admin",
    "email": "john.admin@example.com",
    "password": "securepass123"
  }'
```

---

## ⚠️ What Happens if Someone Tries to Register as Admin?

If someone modifies the frontend to send `role: "admin"` in the registration request:

**Backend Response:**
```json
{
  "message": "Admin accounts cannot be created through public registration. Please contact an administrator.",
  "status": 403
}
```

The registration will be **blocked** and the user will see an error message.

---

## 🎨 Registration Page Features

### Visual Role Selection
- **Radio buttons** with descriptions
- **Highlighted** when selected (blue border + light blue background)
- **Hover effect** for better UX
- **Clear descriptions** of what each role can do

### Dynamic Form Fields
- Company role shows **additional field** for "Company Name"
- Label changes from "Full Name" to "Contact Name" for companies
- All fields have proper validation

### Password Requirements
- Minimum 6 characters
- Must match confirmation
- Clear error messages if validation fails

### Error Handling
- Email already registered: Clear message
- Password mismatch: Validation error
- Server errors: User-friendly messages
- Network errors: Graceful handling

---

## 📋 Registration Validation

### Frontend Validation
- ✅ All required fields filled
- ✅ Valid email format
- ✅ Password minimum 6 characters
- ✅ Passwords match
- ✅ Company name required if role is "company"

### Backend Validation
- ✅ Role is valid (learner, company, supervisor only)
- ✅ Email not already registered
- ✅ All required fields present
- ✅ Password meets requirements
- ✅ Admin role blocked from public registration

---

## 🔄 Registration Flow

```
User visits /register
    ↓
Selects role (Learner/Company/Supervisor)
    ↓
Fills in form (name, email, password)
    ↓
[If Company] Also fills company name
    ↓
Clicks "Create Account"
    ↓
Frontend validates form
    ↓
Sends POST to /api/auth/register
    ↓
Backend validates (blocks admin role)
    ↓
Creates user in database
    ↓
Creates role-specific profile
    ↓
Sends welcome email
    ↓
Returns JWT token
    ↓
Frontend stores token
    ↓
Redirects to dashboard
    ↓
User is logged in!
```

---

## 🛡️ Security Features

### 1. Admin Role Protection
- ❌ Cannot select admin in UI
- ❌ Backend blocks admin registration attempts
- ✅ Only admins can create admins

### 2. Email Uniqueness
- Each email can only be used once
- Prevents duplicate accounts

### 3. Password Security
- Hashed with bcrypt
- Never stored in plain text
- Minimum length requirement

### 4. Role Isolation
- Each role has separate profile table
- Role-specific permissions enforced
- Cannot access other role features

---

## 📧 Welcome Email

After registration, users receive a welcome email:

**Subject:** "Welcome to SkillBridge!"

**Content:**
- Greeting with user name
- Confirmation of account creation
- Role-specific features list
- Next steps
- Platform branding

**Example:**
```
Hi John Doe,

Welcome to SkillBridge! We're excited to have you on board.

Your account has been successfully created as a learner.

As a learner, you can now:
- Browse and enroll in courses
- Apply for real-world tasks from companies
- Track your learning progress

Get started by logging in to your account!

Best regards,
The SkillBridge Team
```

---

## 🧪 Testing Registration

### Test Scenario 1: Register as Learner
1. Go to /register
2. Select "Learner"
3. Enter:
   - Name: Test Learner
   - Email: testlearner@example.com
   - Password: password123
   - Confirm: password123
4. Click "Create Account"
5. Should redirect to /learner/home

### Test Scenario 2: Register as Company
1. Go to /register
2. Select "Company"
3. Enter:
   - Contact Name: John Smith
   - Company Name: Test Corp Inc
   - Email: testcompany@example.com
   - Password: password123
   - Confirm: password123
4. Click "Create Account"
5. Should redirect to /company/home

### Test Scenario 3: Register as Supervisor
1. Go to /register
2. Select "Supervisor"
3. Enter:
   - Name: Jane Teacher
   - Email: testsupervisor@example.com
   - Password: password123
   - Confirm: password123
4. Click "Create Account"
5. Should redirect to /supervisor/home

### Test Scenario 4: Try to Register with Existing Email
1. Use email from existing account
2. Should show error: "Email already registered"

### Test Scenario 5: Password Mismatch
1. Enter different passwords
2. Should show error: "Passwords do not match"

---

## 🔍 Troubleshooting

### Problem: "Email already registered"
**Solution:** Use a different email or login with existing account

### Problem: "Passwords do not match"
**Solution:** Make sure both password fields are identical

### Problem: "Password must be at least 6 characters"
**Solution:** Use a longer password (minimum 6 characters)

### Problem: Registration button not working
**Solution:** Check all required fields are filled

### Problem: "Invalid role" error
**Solution:** Make sure you selected one of the three available roles

---

## 📊 Quick Reference

| Role | Public Registration | Create Via Admin | Dashboard URL |
|------|---------------------|------------------|---------------|
| Learner | ✅ Yes | ✅ Yes | /learner/home |
| Company | ✅ Yes | ✅ Yes | /company/home |
| Supervisor | ✅ Yes | ✅ Yes | /supervisor/home |
| Admin | ❌ No | ✅ Yes (admin only) | /admin/home |

---

## 🎯 Summary

- ✅ **3 public roles** available for registration
- ✅ **Clean, intuitive** registration interface
- ✅ **Role descriptions** help users choose correctly
- ✅ **Admin creation** is restricted and secure
- ✅ **Welcome emails** sent automatically
- ✅ **Automatic login** after registration
- ✅ **Proper validation** on frontend and backend

---

**Ready to register?** Go to http://localhost:3000/register
