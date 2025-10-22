import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import {
  Bell,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  Briefcase,
  Award,
  Users,
  BarChart,
  FileText,
  UserCog
} from 'lucide-react'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Define navigation items based on user role
  const getNavItems = () => {
    switch (user?.role) {
      case 'learner':
        return [
          { name: 'Home', path: '/learner/home', icon: Home },
          { name: 'Courses', path: '/learner/courses', icon: BookOpen },
          { name: 'Tasks', path: '/learner/tasks', icon: Briefcase },
          { name: 'Applications', path: '/learner/applications', icon: FileText },
          { name: 'Portfolio', path: '/learner/portfolio', icon: Award },
        ]
      case 'company':
        return [
          { name: 'Dashboard', path: '/company/home', icon: Home },
          { name: 'Tasks', path: '/company/tasks', icon: Briefcase },
          { name: 'Applicants', path: '/company/applicants', icon: Users },
          { name: 'Analytics', path: '/company/analytics', icon: BarChart },
          { name: 'Profile', path: '/company/profile', icon: UserCog },
        ]
      case 'supervisor':
        return [
          { name: 'Dashboard', path: '/supervisor/home', icon: Home },
          { name: 'Courses', path: '/supervisor/courses', icon: BookOpen },
          { name: 'Evaluations', path: '/supervisor/evaluations', icon: FileText },
          { name: 'Analytics', path: '/supervisor/analytics', icon: BarChart },
          { name: 'Profile', path: '/supervisor/profile', icon: UserCog },
        ]
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/home', icon: Home },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'User Sessions', path: '/admin/sessions', icon: UserCog },
          { name: 'Analytics', path: '/admin/analytics', icon: BarChart },
          { name: 'Content', path: '/admin/content', icon: FileText },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
          { name: 'Profile', path: '/admin/profile', icon: UserCog },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-2xl font-bold text-primary ml-2">SkillBridge</h1>
            </div>

            <div className="flex items-center md:space-x-4">
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/messages')}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <Mail size={20} />
              </button>

              <button
                onClick={() => navigate('/settings')}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <Settings size={20} />
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <img
                  src={user?.profile_picture || `https://ui-avatars.com/api/?name=${user?.name}&background=2563EB&color=fff`}
                  alt={user?.name}
                  className="h-10 w-10 rounded-full hidden sm:block"
                />
              </div>

              <button
                onClick={logout}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <nav className="mt-5 px-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center px-4 py-3 mb-2 text-gray-700 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default Layout
