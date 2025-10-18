# SkillBridge Database Dictionary

## Database Overview
- **Database Type**: SQLite
- **Database File**: `instance/skillbridge.db`
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Generated Date**: October 12, 2025

---

## Tables Overview

| Table Name | Description | Row Count |
|-----------|-------------|-----------|
| users | User accounts (learners, companies, supervisors, admins) | ~7 |
| courses | Available courses for learners | ~5 |
| enrollments | Course enrollment tracking | ~3 |
| tasks | Real-world tasks posted by companies | ~5 |
| applications | Task applications from learners | ~5 |
| notifications | System notifications for users | Variable |
| certificates | Generated certificates upon course completion | Variable |

---

## Detailed Table Schemas

### 1. users
**Description**: Stores all user accounts across different roles

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | Auto | Primary key |
| email | VARCHAR(120) | NO | - | Unique email address |
| password | VARCHAR(255) | NO | - | Bcrypt hashed password |
| name | VARCHAR(100) | NO | - | User's full name |
| role | VARCHAR(20) | NO | - | User role: learner, company, supervisor, admin |
| phone | VARCHAR(20) | YES | NULL | Contact phone number |
| bio | TEXT | YES | NULL | User biography |
| profile_image | VARCHAR(255) | YES | NULL | Profile image URL/path |
| company_name | VARCHAR(100) | YES | NULL | Company name (for company role) |
| company_description | TEXT | YES | NULL | Company description |
| industry | VARCHAR(100) | YES | NULL | Company industry |
| website | VARCHAR(255) | YES | NULL | Company website |
| location | VARCHAR(100) | YES | NULL | User/company location |
| linkedin_url | VARCHAR(255) | YES | NULL | LinkedIn profile URL |
| github_url | VARCHAR(255) | YES | NULL | GitHub profile URL |
| portfolio_url | VARCHAR(255) | YES | NULL | Portfolio website URL |
| skills | TEXT | YES | NULL | JSON array of skills |
| interests | TEXT | YES | NULL | JSON array of interests |
| education | TEXT | YES | NULL | Education background |
| experience | TEXT | YES | NULL | Work experience |
| is_active | BOOLEAN | NO | true | Account active status |
| email_verified | BOOLEAN | NO | false | Email verification status |
| created_at | DATETIME | NO | NOW | Account creation timestamp |
| updated_at | DATETIME | NO | NOW | Last update timestamp |

**Indexes**:
- PRIMARY KEY: id
- UNIQUE: email
- INDEX: role

**Sample Data**:
```json
{
  "email": "company@techcorp.com",
  "name": "TechCorp",
  "role": "company",
  "company_name": "TechCorp Solutions",
  "industry": "Technology"
}
```

---

### 2. courses
**Description**: Educational courses available for learners

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | Auto | Primary key |
| title | VARCHAR(200) | NO | - | Course title |
| description | TEXT | NO | - | Course description |
| instructor_id | INTEGER | NO | - | Foreign key to users (instructor) |
| category | VARCHAR(100) | NO | - | Course category |
| level | VARCHAR(50) | NO | - | Difficulty: Beginner, Intermediate, Advanced |
| thumbnail | VARCHAR(255) | YES | NULL | Course thumbnail image |
| duration_hours | INTEGER | YES | NULL | Estimated duration in hours |
| skills_covered | TEXT | YES | NULL | JSON array of skills |
| prerequisites | TEXT | YES | NULL | Course prerequisites |
| learning_outcomes | TEXT | YES | NULL | Expected learning outcomes |
| content | TEXT | YES | NULL | JSON array of course modules/lessons |
| video_url | VARCHAR(255) | YES | NULL | Video content URL |
| is_active | BOOLEAN | NO | true | Course availability status |
| enrollment_count | INTEGER | NO | 0 | Total enrollments |
| rating | FLOAT | YES | NULL | Average rating |
| created_at | DATETIME | NO | NOW | Course creation timestamp |
| updated_at | DATETIME | NO | NOW | Last update timestamp |

**Relationships**:
- instructor_id → users.id (Many-to-One)

**Sample Data**:
```json
{
  "title": "Introduction to Python Programming",
  "category": "Programming",
  "level": "Beginner",
  "duration_hours": 40,
  "skills_covered": ["Python", "Programming Basics", "Data Structures"]
}
```

---

### 3. enrollments
**Description**: Tracks learner course enrollments and progress

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | Auto | Primary key |
| learner_id | INTEGER | NO | - | Foreign key to users (learner) |
| course_id | INTEGER | NO | - | Foreign key to courses |
| enrolled_at | DATETIME | NO | NOW | Enrollment timestamp |
| progress | INTEGER | NO | 0 | Progress percentage (0-100) |
| status | VARCHAR(20) | NO | active | Status: active, completed, dropped |
| completed_at | DATETIME | YES | NULL | Completion timestamp |
| certificate_id | INTEGER | YES | NULL | Foreign key to certificates |
| last_accessed | DATETIME | YES | NULL | Last access timestamp |

**Relationships**:
- learner_id → users.id (Many-to-One)
- course_id → courses.id (Many-to-One)
- certificate_id → certificates.id (One-to-One)

**Unique Constraint**: (learner_id, course_id)

**Sample Data**:
```json
{
  "learner_id": 1,
  "course_id": 1,
  "progress": 75,
  "status": "active"
}
```

---

### 4. tasks
**Description**: Real-world tasks posted by companies

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | Auto | Primary key |
| company_id | INTEGER | NO | - | Foreign key to users (company) |
| title | VARCHAR(200) | NO | - | Task title |
| description | TEXT | NO | - | Task description |
| category | VARCHAR(100) | NO | - | Task category |
| difficulty | VARCHAR(50) | NO | - | Difficulty: Beginner, Intermediate, Advanced |
| skills_required | TEXT | YES | NULL | JSON array of required skills |
| estimated_hours | INTEGER | YES | NULL | Estimated time in hours |
| compensation | VARCHAR(100) | YES | NULL | Compensation details |
| deadline | DATE | YES | NULL | Task deadline |
| requirements | TEXT | YES | NULL | Specific requirements |
| deliverables | TEXT | YES | NULL | Expected deliverables |
| status | VARCHAR(20) | NO | active | Status: active, closed, completed |
| max_applicants | INTEGER | NO | 5 | Maximum number of applicants |
| application_count | INTEGER | NO | 0 | Current application count |
| created_at | DATETIME | NO | NOW | Task creation timestamp |
| updated_at | DATETIME | NO | NOW | Last update timestamp |

**Relationships**:
- company_id → users.id (Many-to-One)

**Sample Data**:
```json
{
  "title": "Build a Responsive Landing Page",
  "category": "Programming",
  "difficulty": "Beginner",
  "skills_required": ["HTML", "CSS", "JavaScript"],
  "estimated_hours": 20,
  "compensation": "$500"
}
```

---

### 5. applications
**Description**: Learner applications to tasks

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | Auto | Primary key |
| learner_id | INTEGER | NO | - | Foreign key to users (learner) |
| task_id | INTEGER | NO | - | Foreign key to tasks |
| cover_letter | TEXT | YES | NULL | Application cover letter |
| status | VARCHAR(20) | NO | pending | Status: pending, accepted, rejected, in_progress, submitted, completed |
| applied_at | DATETIME | NO | NOW | Application timestamp |
| accepted_at | DATETIME | YES | NULL | Acceptance timestamp |
| submission_url | VARCHAR(255) | YES | NULL | Work submission URL |
| submission_notes | TEXT | YES | NULL | Submission notes |
| submitted_at | DATETIME | YES | NULL | Submission timestamp |
| evaluation | TEXT | YES | NULL | JSON evaluation data |
| completed_at | DATETIME | YES | NULL | Completion timestamp |

**Relationships**:
- learner_id → users.id (Many-to-One)
- task_id → tasks.id (Many-to-One)

**Unique Constraint**: (learner_id, task_id)

**Sample Data**:
```json
{
  "learner_id": 1,
  "task_id": 1,
  "status": "accepted",
  "cover_letter": "I am excited to work on this project..."
}
```

---

### 6. notifications
**Description**: System notifications for users

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | Auto | Primary key |
| user_id | INTEGER | NO | - | Foreign key to users |
| title | VARCHAR(200) | NO | - | Notification title |
| message | TEXT | NO | - | Notification message |
| type | VARCHAR(50) | NO | - | Type: application, enrollment, task, system |
| is_read | BOOLEAN | NO | false | Read status |
| created_at | DATETIME | NO | NOW | Notification timestamp |

**Relationships**:
- user_id → users.id (Many-to-One)

---

### 7. certificates
**Description**: Generated certificates for course completion

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | INTEGER | NO | Auto | Primary key |
| user_id | INTEGER | NO | - | Foreign key to users (learner) |
| course_id | INTEGER | NO | - | Foreign key to courses |
| certificate_number | VARCHAR(50) | NO | - | Unique certificate number |
| issued_at | DATETIME | NO | NOW | Issuance timestamp |
| pdf_path | VARCHAR(255) | YES | NULL | PDF file path |

**Relationships**:
- user_id → users.id (Many-to-One)
- course_id → courses.id (Many-to-One)

**Unique Constraint**: certificate_number

---

## Entity Relationships

```
users (learners)
  ├─→ enrollments (One-to-Many)
  │   └─→ courses (Many-to-One)
  │       └─→ certificates (One-to-One)
  │
  └─→ applications (One-to-Many)
      └─→ tasks (Many-to-One)
          └─→ users (companies) (Many-to-One)

users (companies)
  └─→ tasks (One-to-Many)
      └─→ applications (One-to-Many)
          └─→ users (learners) (Many-to-One)

users (instructors/supervisors)
  └─→ courses (One-to-Many)
      └─→ enrollments (One-to-Many)

users (all)
  └─→ notifications (One-to-Many)
```

---

## Test Data Summary

### Users (7 records)
- 2 Learners: `learner@skillbridge.com`, `john@example.com`
- 2 Companies: `company@techcorp.com`, `hr@datainc.com`
- 2 Supervisors: `supervisor@university.edu`, `prof.davis@mit.edu`
- 1 Admin: `admin@skillbridge.com`
- **Default Password**: `password123` (bcrypt hashed)

### Courses (5 records)
- Python Programming (Beginner)
- Web Development Fundamentals (Beginner)
- Data Analysis with SQL (Intermediate)
- Machine Learning Basics (Advanced)
- Cybersecurity Fundamentals (Intermediate)

### Tasks (5 records)
- Build a Responsive Landing Page (Programming, Beginner)
- Create Social Media Campaign (Marketing, Beginner)
- Data Analysis Project (Data Analysis, Intermediate)
- Security Audit Report (Cybersecurity, Advanced)
- Design Mobile App UI (UX/UI Design, Intermediate)

### Applications (5 records)
- Various statuses: pending, accepted, in_progress, submitted, completed

### Enrollments (3 records)
- Course enrollments with progress tracking

---

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/refresh` - Refresh access token
- GET `/api/auth/me` - Get current user

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update profile

### Courses
- GET `/api/courses` - List all courses
- GET `/api/courses/:id` - Get course details
- GET `/api/courses/my-enrollments` - Get learner enrollments
- POST `/api/courses/:id/enroll` - Enroll in course
- PUT `/api/courses/enrollments/:id/progress` - Update progress

### Tasks
- GET `/api/tasks` - List all tasks (public)
- GET `/api/tasks/my` - Get company's tasks
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task
- GET `/api/tasks/applications/my` - Get learner's applications
- POST `/api/tasks/:id/apply` - Apply to task
- PUT `/api/tasks/applications/:id/submit` - Submit work

### Company
- GET `/api/companies/applications` - Get all applications to company tasks
- PUT `/api/companies/applications/:id/accept` - Accept application
- PUT `/api/companies/applications/:id/reject` - Reject application

### Notifications
- GET `/api/notifications` - Get user notifications
- PUT `/api/notifications/:id/read` - Mark notification as read

---

## Security Features

1. **Password Hashing**: Bcrypt with salt
2. **JWT Authentication**: Access + Refresh tokens
3. **Role-Based Access Control (RBAC)**: Learner, Company, Supervisor, Admin
4. **CORS Protection**: Configured for frontend origin
5. **SQL Injection Protection**: SQLAlchemy ORM parameterized queries
6. **Email Validation**: Unique email constraint

---

## Database Setup Commands

```bash
# Initialize database
flask db init

# Create migration
flask db migrate -m "Initial migration"

# Apply migration
flask db upgrade

# Seed data
python seed_data.py
```

---

## Backup & Restore

### Backup
```bash
# Copy database file
cp instance/skillbridge.db backup/skillbridge_$(date +%Y%m%d).db

# Export as SQL
sqlite3 instance/skillbridge.db .dump > backup.sql
```

### Restore
```bash
# From file
cp backup/skillbridge_20251012.db instance/skillbridge.db

# From SQL
sqlite3 instance/skillbridge.db < backup.sql
```
