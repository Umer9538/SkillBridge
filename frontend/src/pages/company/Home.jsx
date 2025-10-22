import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import { Briefcase, Users, Clock, CheckCircle, Eye, Plus, Calendar, TrendingUp, Building2, ArrowRight } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

const CompanyHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    activeTasks: 0,
    totalApplications: 0,
    activeUsers: 0
  })
  const [tasks, setTasks] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, applicationsRes] = await Promise.all([
        api.get('/tasks/my'),
        api.get('/companies/applications')
      ])

      const tasksData = tasksRes.data.tasks || []
      const applicationsData = applicationsRes.data.applications || []

      setTasks(tasksData)

      // Calculate stats
      const activeTasks = tasksData.filter(t => t.status === 'active').length
      const uniqueLearners = new Set(applicationsData.map(a => a.learner_id)).size

      setStats({
        activeTasks,
        totalApplications: applicationsData.length,
        activeUsers: uniqueLearners
      })

      // Create recent activity from applications
      const activity = applicationsData.slice(0, 5).map(app => ({
        id: app.id,
        type: 'application',
        learner: app.learner_name,
        task: app.task_title,
        status: app.status,
        time: app.applied_at
      }))
      setRecentActivity(activity)

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      in_progress: 'bg-purple-100 text-purple-800',
      submitted: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0')
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage
  const indexOfFirstTask = indexOfLastTask - tasksPerPage
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(tasks.length / tasksPerPage)

  return (
    <Layout>
      <div>
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Building2 size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-blue-100">
                  Manage your opportunities and review applications
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/company/tasks/new')}
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              Post New Task
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Tasks</p>
                <h3 className="text-4xl font-bold text-gray-900">
                  {formatNumber(stats.activeTasks)}
                </h3>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <Briefcase className="text-green-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applicants</p>
                <h3 className="text-4xl font-bold text-gray-900">
                  {formatNumber(stats.totalApplications)}
                </h3>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <Users className="text-blue-600" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Offers Sent</p>
                <h3 className="text-4xl font-bold text-gray-900">
                  {formatNumber(stats.activeUsers)}
                </h3>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <CheckCircle className="text-purple-600" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Table - Left Side (2/3) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Active Tasks</h2>
                <button
                  onClick={() => navigate('/company/tasks')}
                  className="text-primary hover:text-primary-600 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  Manage Tasks
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="overflow-x-auto">
                {currentTasks.length > 0 ? (
                  <>
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Task Title
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Applicants
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentTasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="text-sm font-semibold text-gray-900">{task.title}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{task.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-700">
                                {task.deadline ? format(new Date(task.deadline), 'MMM dd, yyyy') : '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{task.application_count || 0}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                task.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => navigate('/company/applicants')}
                                className="text-primary hover:text-primary-700 font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Eye size={16} />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          Showing {indexOfFirstTask + 1} to {Math.min(indexOfLastTask, tasks.length)} of {tasks.length}
                        </div>
                        <div className="flex gap-2">
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`w-8 h-8 rounded ${
                                currentPage === index + 1
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-4">No tasks posted yet</p>
                    <button
                      onClick={() => navigate('/company/tasks/new')}
                      className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600"
                    >
                      Post Your First Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity - Right Side (1/3) */}
          <div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button
                  onClick={() => navigate('/company/applicants')}
                  className="text-primary hover:text-primary-600 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="p-6">
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="text-primary" size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 font-medium">
                            New application from {activity.learner}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{activity.task}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CompanyHome
