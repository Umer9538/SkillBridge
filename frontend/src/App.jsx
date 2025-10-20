import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Auth pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

// Learner pages
import LearnerHome from './pages/learner/Home'
import CoursesPage from './pages/learner/Courses'
import CourseDetailPage from './pages/learner/CourseDetail'
import CoursePlayerPage from './pages/learner/CoursePlayer'
import TasksPage from './pages/learner/Tasks'
import MyApplicationsPage from './pages/learner/MyApplications'
import PortfolioPage from './pages/learner/Portfolio'

// Company pages
import CompanyHome from './pages/company/Home'
import TaskManagement from './pages/company/TaskManagement'
import ApplicantsPage from './pages/company/Applicants'

// Supervisor pages
import SupervisorHome from './pages/supervisor/Home'
import CourseManagement from './pages/supervisor/CourseManagement'
import Evaluations from './pages/supervisor/Evaluations'

// Admin pages
import AdminHome from './pages/admin/Home'
import UserManagement from './pages/admin/UserManagement'
import UserSessions from './pages/admin/UserSessions'

// Common pages
import NotificationsPage from './pages/common/Notifications'
import SettingsPage from './pages/common/Settings'
import MessagesPage from './pages/common/Messages'

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Learner routes */}
            <Route path="/learner" element={<ProtectedRoute allowedRoles={['learner']} />}>
              <Route index element={<Navigate to="/learner/home" replace />} />
              <Route path="home" element={<LearnerHome />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/:id/player" element={<CoursePlayerPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="applications" element={<MyApplicationsPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
            </Route>

            {/* Company routes */}
            <Route path="/company" element={<ProtectedRoute allowedRoles={['company']} />}>
              <Route index element={<Navigate to="/company/home" replace />} />
              <Route path="home" element={<CompanyHome />} />
              <Route path="tasks" element={<TaskManagement />} />
              <Route path="applicants" element={<ApplicantsPage />} />
            </Route>

            {/* Supervisor routes */}
            <Route path="/supervisor" element={<ProtectedRoute allowedRoles={['supervisor']} />}>
              <Route index element={<Navigate to="/supervisor/home" replace />} />
              <Route path="home" element={<SupervisorHome />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="evaluations" element={<Evaluations />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route index element={<Navigate to="/admin/home" replace />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="sessions" element={<UserSessions />} />
            </Route>

            {/* Common protected routes */}
            <Route element={<ProtectedRoute allowedRoles={['learner', 'company', 'supervisor', 'admin']} />}>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
