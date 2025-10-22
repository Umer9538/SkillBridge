import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { TrendingUp, Users, Briefcase, CheckCircle, Clock, DollarSign, Target, Award } from 'lucide-react'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalTasks: 0,
      activeTasks: 0,
      totalApplications: 0,
      acceptedApplications: 0,
      completedTasks: 0,
      averageApplicationsPerTask: 0
    },
    tasksByCategory: [],
    tasksByDifficulty: [],
    applicationsByStatus: [],
    recentMetrics: []
  })
  const [dateRange, setDateRange] = useState('30days')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [tasksRes, applicationsRes] = await Promise.all([
        api.get('/tasks/my'),
        api.get('/companies/applications')
      ])

      const tasks = tasksRes.data.tasks || []
      const applications = applicationsRes.data.applications || []

      // Calculate overview metrics
      const overview = {
        totalTasks: tasks.length,
        activeTasks: tasks.filter(t => t.status === 'active').length,
        totalApplications: applications.length,
        acceptedApplications: applications.filter(a => a.status === 'accepted').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        averageApplicationsPerTask: tasks.length > 0 ? (applications.length / tasks.length).toFixed(1) : 0
      }

      // Group tasks by category
      const tasksByCategory = tasks.reduce((acc, task) => {
        const existing = acc.find(item => item.category === task.category)
        if (existing) {
          existing.count++
        } else {
          acc.push({ category: task.category, count: 1 })
        }
        return acc
      }, [])

      // Group tasks by difficulty
      const tasksByDifficulty = tasks.reduce((acc, task) => {
        const existing = acc.find(item => item.difficulty === task.difficulty)
        if (existing) {
          existing.count++
        } else {
          acc.push({ difficulty: task.difficulty, count: 1 })
        }
        return acc
      }, [])

      // Group applications by status
      const applicationsByStatus = applications.reduce((acc, app) => {
        const existing = acc.find(item => item.status === app.status)
        if (existing) {
          existing.count++
        } else {
          acc.push({ status: app.status, count: 1 })
        }
        return acc
      }, [])

      setAnalytics({
        overview,
        tasksByCategory,
        tasksByDifficulty,
        applicationsByStatus,
        recentMetrics: []
      })

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      accepted: 'bg-blue-500',
      rejected: 'bg-red-500',
      in_progress: 'bg-purple-500',
      submitted: 'bg-indigo-500',
      completed: 'bg-green-500'
    }
    return colors[status] || 'bg-gray-500'
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: 'bg-green-500',
      Intermediate: 'bg-yellow-500',
      Advanced: 'bg-red-500'
    }
    return colors[difficulty] || 'bg-gray-500'
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

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your recruitment performance and insights</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['7days', '30days', '90days', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range === '7days' && 'Last 7 Days'}
              {range === '30days' && 'Last 30 Days'}
              {range === '90days' && 'Last 90 Days'}
              {range === 'all' && 'All Time'}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.totalTasks}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
            <p className="text-xs text-gray-500 mt-1">{analytics.overview.activeTasks} active</p>
          </div>

          {/* Total Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.totalApplications}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Applications</h3>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.overview.acceptedApplications} accepted
            </p>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.completedTasks}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Completed Tasks</h3>
            <p className="text-xs text-gray-500 mt-1">Successfully finished</p>
          </div>

          {/* Average Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.overview.averageApplicationsPerTask}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Avg Applications/Task</h3>
            <p className="text-xs text-gray-500 mt-1">Per posted task</p>
          </div>

          {/* Acceptance Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Award className="text-indigo-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.overview.totalApplications > 0
                  ? ((analytics.overview.acceptedApplications / analytics.overview.totalApplications) * 100).toFixed(0)
                  : 0}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Acceptance Rate</h3>
            <p className="text-xs text-gray-500 mt-1">Applications accepted</p>
          </div>

          {/* Pending Review */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.applicationsByStatus.find(a => a.status === 'pending')?.count || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
            <p className="text-xs text-gray-500 mt-1">Awaiting decision</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tasks by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Category</h3>
            <div className="space-y-3">
              {analytics.tasksByCategory.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.overview.totalTasks) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {analytics.tasksByCategory.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>

          {/* Applications by Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications by Status</h3>
            <div className="space-y-3">
              {analytics.applicationsByStatus.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{item.status}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getStatusColor(item.status)} h-2 rounded-full`}
                      style={{
                        width: `${(item.count / analytics.overview.totalApplications) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {analytics.applicationsByStatus.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>

          {/* Tasks by Difficulty */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Difficulty</h3>
            <div className="space-y-3">
              {analytics.tasksByDifficulty.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.difficulty}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getDifficultyColor(item.difficulty)} h-2 rounded-full`}
                      style={{
                        width: `${(item.count / analytics.overview.totalTasks) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {analytics.tasksByDifficulty.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {analytics.overview.averageApplicationsPerTask} applications per task
                  </p>
                  <p className="text-xs text-gray-600">
                    {analytics.overview.averageApplicationsPerTask > 5 ? 'Great!' : 'Good'} engagement rate
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="text-blue-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {((analytics.overview.acceptedApplications / analytics.overview.totalApplications) * 100).toFixed(0)}% acceptance rate
                  </p>
                  <p className="text-xs text-gray-600">Applications successfully accepted</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="text-purple-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {analytics.overview.activeTasks} active tasks
                  </p>
                  <p className="text-xs text-gray-600">Currently recruiting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Analytics
