# SkillBridge Platform

Bridge the Gap Between Theoretical Learning and Practical Industry Experience

## Overview

SkillBridge is a full-stack web platform that connects learners with real-world tasks from companies, enabling them to gain practical experience while building their portfolios.

## Features

### For Learners
- Browse and enroll in courses across various categories
- Access learning materials (videos, documents, quizzes)
- Find and apply for real-world tasks from companies
- Submit work and receive professional feedback
- Build a portfolio showcasing completed tasks
- Earn certificates upon course completion
- Track learning progress

### For Companies
- Post real-world tasks for learners
- Review applications from qualified learners
- Evaluate submitted work
- Provide feedback and ratings
- Access learner portfolios

### For Supervisors
- Create and manage courses
- Upload learning materials
- Monitor course enrollments
- Evaluate learner submissions
- Provide structured feedback

### For Administrators
- Manage all platform users
- Monitor system activity
- View platform-wide analytics
- Manage courses and tasks

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLAlchemy with SQLite (PostgreSQL ready)
- **Authentication**: JWT (Flask-JWT-Extended)
- **Password Hashing**: Bcrypt
- **Email**: Flask-Mail
- **Migrations**: Flask-Migrate

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Charts**: Recharts
- **PDF Generation**: jsPDF

## Project Structure

```
skillBridge/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── utils/           # Helper functions
│   │   └── __init__.py      # App factory
│   ├── migrations/          # Database migrations
│   ├── uploads/             # Uploaded files
│   ├── config.py            # Configuration
│   ├── run.py               # Entry point
│   └── requirements.txt     # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── contexts/        # React contexts
    │   ├── utils/           # Utility functions
    │   └── App.jsx          # Main app component
    ├── public/              # Static assets
    └── package.json         # Node dependencies
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On macOS/Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

6. Initialize the database:
```bash
python run.py
```

The backend server will start at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "learner",
  "company_name": "Optional for companies"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user info (requires JWT token)

### Course Endpoints

#### GET /api/courses
Get all published courses (with optional filters)

#### GET /api/courses/:id
Get course details

#### POST /api/courses/:id/enroll
Enroll in a course (learners only)

#### GET /api/courses/my-enrollments
Get current learner's enrollments

### Task Endpoints

#### GET /api/tasks
Get all active tasks

#### GET /api/tasks/:id
Get task details

#### POST /api/tasks/:id/apply
Apply for a task (learners only)

#### GET /api/tasks/applications/my
Get current learner's applications

### Company Endpoints

#### POST /api/companies/tasks
Create a new task (companies only)

#### GET /api/companies/tasks
Get company's tasks

#### GET /api/companies/tasks/:id/applications
Get applications for a task

#### POST /api/companies/applications/:id/evaluate
Evaluate an application

### Supervisor Endpoints

#### POST /api/supervisors/courses
Create a new course

#### PUT /api/supervisors/courses/:id
Update a course

#### POST /api/supervisors/courses/:id/modules
Add a module to a course

### Admin Endpoints

#### GET /api/admin/users
Get all users

#### PUT /api/admin/users/:id/toggle-active
Activate/deactivate a user

#### GET /api/admin/statistics
Get platform statistics

## Default Test Users

After running the application for the first time, you can create test users through the registration page with different roles:

- **Learner**: Select "Learner" role during registration
- **Company**: Select "Company" role during registration
- **Supervisor**: Select "Supervisor" role during registration
- **Admin**: Create manually in the database or via API

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

#### Backend
```bash
# Set environment to production in .env
FLASK_ENV=production

# Use a production-grade server like Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

#### Frontend
```bash
npm run build
```

## Database Schema

### Core Models
- **User**: Base user model with authentication
- **Learner**: Learner-specific profile
- **Company**: Company-specific profile
- **Supervisor**: Supervisor-specific profile
- **Course**: Course information
- **Module**: Course modules/lessons
- **Enrollment**: Course enrollments
- **Task**: Company-posted tasks
- **Application**: Task applications
- **Evaluation**: Task evaluations
- **Certificate**: Course completion certificates
- **Notification**: User notifications
- **Message**: In-app messaging

## Security Features

- Password hashing with Bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## Future Enhancements

- [ ] AI-powered course/task recommendations
- [ ] Real-time messaging system
- [ ] Advanced analytics dashboards
- [ ] Mobile application
- [ ] Payment integration
- [ ] Video conferencing for mentorship
- [ ] Gamification and badges
- [ ] Social features (following, sharing)
- [ ] API rate limiting
- [ ] Comprehensive test coverage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Built with dedication to bridge the gap between learning and practice.**
