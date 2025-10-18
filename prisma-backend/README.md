# SkillBridge Prisma Backend

Complete Prisma ORM implementation for the SkillBridge database using TypeScript.

## 📍 Database Location

The SQLite database file is located at:
```
/Users/mac/Documents/Project/skillBridge/backend/instance/skillbridge.db
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

### 3. Run Examples
```bash
npm run dev
```

This will execute `src/index.ts` which demonstrates all the database operations.

## 📦 What's Included

### Database Schema
The Prisma schema has been automatically generated from your existing database and includes:

- **13 Models**: users, learners, companies, supervisors, tasks, applications, courses, enrollments, modules, certificates, evaluations, notifications, messages
- **All relationships** properly mapped
- **Type-safe** queries with TypeScript

### Example Operations

Located in `src/examples/`:

#### **users.ts** - User Operations
- Get all users
- Get user by ID/email
- Create/update users
- Get users by role
- Get learners with applications
- Get companies with tasks

#### **tasks.ts** - Task Operations
- Get all tasks
- Get task by ID
- Get tasks by company/category/difficulty
- Create/update/delete tasks
- Get active tasks
- Task statistics

#### **applications.ts** - Application Operations
- Get all applications
- Get applications by learner/task/company
- Create applications
- Update status (accept/reject)
- Submit work
- Get pending applications

#### **courses.ts** - Course & Enrollment Operations
- Get all courses
- Get courses by category/difficulty
- Create courses
- Enroll learners
- Update progress
- Get completed courses

## 📊 Database Schema Overview

```typescript
// Users (Base)
users {
  id, email, password_hash, role, name, profile_picture, is_active
  ├─ learners (One-to-One)
  ├─ companies (One-to-One)
  ├─ supervisors (One-to-One)
  ├─ messages (One-to-Many)
  └─ notifications (One-to-Many)
}

// Learners
learners {
  id, user_id, skills, bio, phone, location
  ├─ applications (One-to-Many)
  ├─ enrollments (One-to-Many)
  └─ certificates (One-to-Many)
}

// Companies
companies {
  id, user_id, company_name, industry, description
  └─ tasks (One-to-Many)
}

// Tasks
tasks {
  id, company_id, title, description, category, difficulty, status
  └─ applications (One-to-Many)
}

// Applications
applications {
  id, task_id, learner_id, status, cover_letter, submission_url
  └─ evaluations (One-to-One)
}

// Courses
courses {
  id, title, description, category, difficulty, supervisor_id
  ├─ modules (One-to-Many)
  ├─ enrollments (One-to-Many)
  └─ certificates (One-to-Many)
}

// Enrollments
enrollments {
  id, learner_id, course_id, status, progress, completion_percentage
}
```

## 🔧 Available Commands

### Development
```bash
npm run dev          # Run examples
npm run build        # Compile TypeScript
npm start            # Run compiled code
```

### Prisma Commands
```bash
npm run prisma:generate   # Generate Prisma Client
npm run prisma:studio     # Open Prisma Studio (GUI)
npm run prisma:pull       # Re-introspect database
```

## 🎯 Usage Examples

### Basic Query
```typescript
import prisma from './db'

// Get all users
const users = await prisma.users.findMany()

// Get user by ID
const user = await prisma.users.findUnique({
  where: { id: 1 }
})
```

### Query with Relations
```typescript
// Get user with all related data
const user = await prisma.users.findUnique({
  where: { id: 1 },
  include: {
    learners: {
      include: {
        applications: true,
        enrollments: true
      }
    },
    notifications: true
  }
})
```

### Create with Relations
```typescript
// Create a new task
const task = await prisma.tasks.create({
  data: {
    title: "Build a Website",
    description: "Create a modern website",
    category: "Programming",
    difficulty: "Intermediate",
    company_id: 1,
    status: "active",
    created_at: new Date()
  }
})
```

### Update
```typescript
// Accept an application
const application = await prisma.applications.update({
  where: { id: 1 },
  data: {
    status: "accepted",
    accepted_at: new Date()
  }
})
```

### Complex Queries
```typescript
// Get all active tasks with company info and applications
const tasks = await prisma.tasks.findMany({
  where: {
    status: "active"
  },
  include: {
    companies: {
      include: {
        users: true
      }
    },
    applications: {
      where: {
        status: "pending"
      }
    }
  },
  orderBy: {
    created_at: 'desc'
  }
})
```

### Aggregations
```typescript
// Count tasks by status
const stats = await prisma.tasks.groupBy({
  by: ['status'],
  _count: {
    id: true
  }
})
```

## 🎨 Prisma Studio

Launch Prisma Studio to view and edit your database with a GUI:

```bash
npm run prisma:studio
```

This will open http://localhost:5555 in your browser.

## 📚 Documentation

### Prisma Docs
- Official Docs: https://www.prisma.io/docs
- Prisma Client API: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference
- Prisma Schema: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

### Type Safety
All queries are fully type-safe with TypeScript:

```typescript
// ✅ Type-safe - TypeScript knows the shape
const user = await prisma.users.findUnique({
  where: { id: 1 }
})
// user: users | null

// ✅ Autocomplete works
user?.email // TypeScript autocompletes all fields

// ❌ Type error - field doesn't exist
user?.nonExistentField // TypeScript error
```

## 🔐 Environment Variables

Configure database path in `.env`:

```env
DATABASE_URL="file:/Users/mac/Documents/Project/skillBridge/backend/instance/skillbridge.db"
```

## 🆚 Prisma vs SQLAlchemy

| Feature | Prisma | SQLAlchemy (Current) |
|---------|--------|---------------------|
| Language | TypeScript/JavaScript | Python |
| Type Safety | ✅ Full | ⚠️ Partial (with plugins) |
| Autocomplete | ✅ Excellent | ⚠️ Limited |
| Migrations | ✅ Built-in | ✅ Alembic |
| GUI | ✅ Prisma Studio | ❌ None |
| Performance | ✅ Fast | ✅ Fast |
| Learning Curve | ✅ Easy | ⚠️ Moderate |

## 📁 Project Structure

```
prisma-backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── db.ts                  # Prisma client instance
│   ├── index.ts               # Example runner
│   └── examples/
│       ├── users.ts           # User operations
│       ├── tasks.ts           # Task operations
│       ├── applications.ts    # Application operations
│       └── courses.ts         # Course operations
├── generated/
│   └── prisma/                # Generated Prisma Client
├── .env                       # Environment variables
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🚨 Known Limitations

Some fields use `Unsupported("json")` type because Prisma doesn't fully support JSON in SQLite:
- `applications.submission_files`
- `courses.prerequisites`
- `courses.learning_objectives`
- `tasks.skills_required`
- `learners.skills`, `education`, `experience`
- `modules.content_data`
- `supervisors.expertise_areas`

**Workaround**: Store these as JSON strings and parse them in your application code.

## 🔄 Sync with Existing Database

If the database schema changes, re-introspect:

```bash
npm run prisma:pull
npm run prisma:generate
```

## 💡 Tips

1. **Use Prisma Studio** for visual database exploration
2. **Enable query logging** in development (already configured in `src/db.ts`)
3. **Use transactions** for multiple related operations
4. **Leverage TypeScript** for autocomplete and type checking
5. **Check generated types** in `generated/prisma/index.d.ts`

## 🤝 Integration

To use this in your application:

```typescript
// Import the prisma client
import prisma from './db'

// Import example functions
import { getAllUsers, createUser } from './examples/users'

// Use in your routes/controllers
app.get('/api/users', async (req, res) => {
  const users = await getAllUsers()
  res.json(users)
})
```

## 📞 Support

- Prisma Docs: https://www.prisma.io/docs
- Prisma Discord: https://discord.gg/prisma
- Issues: https://github.com/prisma/prisma/issues

---

**Created**: October 12, 2025
**Database**: SkillBridge SQLite
**Prisma Version**: 6.17.1
