# SkillBridge Database Exports - README

## Available Database Files for Client

Here are all the database files and documentation you can send to your client:

### 1. **DATABASE_DICTIONARY.md** (Recommended)
**Location**: `/Users/mac/Documents/Project/skillBridge/backend/DATABASE_DICTIONARY.md`

Complete database documentation including:
- All table schemas with column details
- Data types and constraints
- Relationships and foreign keys
- API endpoints
- Sample data information
- Security features
- Setup and backup commands

**Best for**: Comprehensive documentation for developers and technical stakeholders

---

### 2. **database_export.sql**
**Location**: `/Users/mac/Documents/Project/skillBridge/backend/database_export.sql`

Complete SQL dump including:
- Table creation statements (CREATE TABLE)
- All data (INSERT statements)
- Indexes and constraints
- Ready to import into any SQLite database

**Best for**: Database administrators or for importing into another system

**To import**:
```bash
sqlite3 new_database.db < database_export.sql
```

---

### 3. **skillbridge.db** (The Actual Database)
**Location**: `/Users/mac/Documents/Project/skillBridge/backend/instance/skillbridge.db`

The actual SQLite database file with all data.

**Best for**: Direct use, testing, or analysis with SQLite tools

**To use**:
```bash
# View in terminal
sqlite3 instance/skillbridge.db

# Copy to another location
cp instance/skillbridge.db /path/to/destination/
```

---

## Quick View: Database Contents

### Tables Summary
| Table | Records | Description |
|-------|---------|-------------|
| users | 7 | All user accounts (learners, companies, supervisors, admins) |
| courses | 5 | Available courses |
| tasks | 5 | Real-world tasks from companies |
| applications | 5 | Task applications from learners |
| enrollments | 3 | Course enrollments |
| notifications | Variable | User notifications |
| certificates | Variable | Generated certificates |

### Test Accounts
| Email | Password | Role |
|-------|----------|------|
| learner@skillbridge.com | password123 | Learner |
| john@example.com | password123 | Learner |
| company@techcorp.com | password123 | Company |
| hr@datainc.com | password123 | Company |
| supervisor@university.edu | password123 | Supervisor |
| prof.davis@mit.edu | password123 | Supervisor |
| admin@skillbridge.com | password123 | Admin |

---

## How to Send to Client

### Option A: Send Documentation Only
Send these files:
1. `DATABASE_DICTIONARY.md` - Complete documentation
2. This `DATABASE_EXPORTS_README.md` - Overview

### Option B: Send Database + Documentation
Send these files:
1. `DATABASE_DICTIONARY.md` - Complete documentation
2. `database_export.sql` - SQL dump
3. `skillbridge.db` - Actual database file
4. This `DATABASE_EXPORTS_README.md` - Overview

### Option C: Create a ZIP Package
```bash
cd /Users/mac/Documents/Project/skillBridge/backend
zip -r skillbridge-database-export.zip \
  DATABASE_DICTIONARY.md \
  DATABASE_EXPORTS_README.md \
  database_export.sql \
  instance/skillbridge.db
```

Then send: `skillbridge-database-export.zip`

---

## Database Statistics

### Data Volume
- Total Tables: 7
- Total Users: 7
- Total Courses: 5
- Total Tasks: 5
- Total Applications: 5
- Total Enrollments: 3
- Database Size: ~100 KB

### Relationships
- Users → Enrollments (One-to-Many)
- Users → Applications (One-to-Many)
- Users → Tasks (One-to-Many, as company)
- Courses → Enrollments (One-to-Many)
- Tasks → Applications (One-to-Many)

---

## Additional Commands

### View Database Schema
```bash
sqlite3 instance/skillbridge.db .schema
```

### Export Specific Table
```bash
sqlite3 instance/skillbridge.db << EOF
.headers on
.mode csv
.output users_export.csv
SELECT * FROM users;
EOF
```

### Check Database Integrity
```bash
sqlite3 instance/skillbridge.db "PRAGMA integrity_check;"
```

### Get Table Row Counts
```bash
sqlite3 instance/skillbridge.db << EOF
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'applications', COUNT(*) FROM applications
UNION ALL
SELECT 'enrollments', COUNT(*) FROM enrollments;
EOF
```

---

## Security Note

⚠️ **Important**: The database contains hashed passwords (bcrypt), but you may want to:
1. Remove or reset passwords before sending
2. Sanitize any sensitive user data
3. Consider sending only the schema without data

To export schema only:
```bash
sqlite3 instance/skillbridge.db .schema > database_schema.sql
```

---

## Support

For questions about the database structure or data, refer to:
- API Documentation: `/api/docs` (when server is running)
- Backend Code: `/app/models/` directory
- Migration Files: `/migrations/` directory

---

**Generated**: October 12, 2025
**Platform**: SkillBridge Learning Platform
**Database**: SQLite 3.x
