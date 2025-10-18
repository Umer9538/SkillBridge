# SkillBridge - Quick Start Guide

Get the platform running in 5 minutes!

## Prerequisites Check
```bash
# Check Python version (need 3.8+)
python --version

# Check Node.js version (need 16+)
node --version
```

## Step 1: Start the Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python run.py
```

Backend will be running at: **http://localhost:5000**

## Step 2: Start the Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running at: **http://localhost:3000**

## Step 3: Create Your First Account

1. Open **http://localhost:3000** in your browser
2. Click "Register here"
3. Fill in the registration form:
   - Choose a role (Learner, Company, or Supervisor)
   - Enter your details
   - Create a password
4. Click "Create Account"
5. You'll be automatically logged in and redirected to your dashboard

## Testing the Application

### As a Learner
- Navigate to **Courses** to browse available courses
- Go to **Tasks** to see real-world opportunities
- Check out **Portfolio** to build your showcase

### As a Company
- Go to **Tasks** to post new opportunities
- View **Applicants** to manage applications

### As a Supervisor
- Navigate to **Courses** to create learning content
- Check **Evaluations** to review submissions

### As an Admin
- Go to **Users** to manage all platform users
- View platform statistics on the dashboard

## API Health Check

Test if the backend is running:
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "SkillBridge API is running"
}
```

## Common Issues

### Backend won't start
- Make sure virtual environment is activated
- Check if port 5000 is already in use
- Verify all dependencies are installed

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check if port 3000 is already in use
- Clear npm cache: `npm cache clean --force`

### Database errors
- Delete `skillbridge.db` file in backend directory
- Restart the backend server (it will recreate the database)

## Next Steps

1. **Explore the Codebase**
   - Check `backend/app/models/` for database structure
   - Look at `frontend/src/pages/` for UI components
   - Review `backend/app/routes/` for API endpoints

2. **Customize the Platform**
   - Update color scheme in `frontend/tailwind.config.js`
   - Modify database models in `backend/app/models/`
   - Add new features to the API routes

3. **Deploy to Production**
   - Set up PostgreSQL database
   - Configure production environment variables
   - Use Gunicorn for backend
   - Build frontend with `npm run build`

## Development Tips

- Backend auto-reloads on file changes (debug mode)
- Frontend has hot module replacement
- Check browser console for frontend errors
- Check terminal for backend errors
- Use browser DevTools Network tab to inspect API calls

## Need Help?

- Check the main README.md for detailed documentation
- Review the API documentation section
- Open an issue on GitHub

Happy coding! 🚀
