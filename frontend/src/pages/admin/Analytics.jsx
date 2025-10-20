import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import {
  Users,
  BookOpen,
  Briefcase,
  Award,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Calendar,
  BarChart3
} from 'lucide-react'

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30days')
  const [analytics, setAnalytics] = useState({
    overview: null,
    growth: null,
    engagement: null,
    userGrowth: [],
    courseStats: [],
    taskStats: [],
    platformActivity: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [overviewRes, growthRes, engagementRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/growth'),
        api.get('/admin/analytics/engagement')
      ])

      setAnalytics({
        overview: overviewRes.data.overview,
        growth: growthRes.data.growth,
        engagement: engagementRes.data.engagement
      })
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  const MetricCard = ({ title, value, change, icon: Icon, color, subtitle }) => {
    const isPositive = change >= 0
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    )
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

  const { overview, growth, engagement } = analytics

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into platform performance and growth</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-2">
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

        {/* Key Metrics Grid */}
        {overview && growth && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Users"
              value={overview.total_users}
              change={growth.user_growth}
              icon={Users}
              color="bg-blue-500"
              subtitle={`${overview.active_users} active users`}
            />
            <MetricCard
              title="Total Courses"
              value={overview.total_courses}
              change={growth.course_growth}
              icon={BookOpen}
              color="bg-green-500"
              subtitle={`${overview.published_courses} published`}
            />
            <MetricCard
              title="Total Tasks"
              value={overview.total_tasks}
              change={growth.task_growth}
              icon={Briefcase}
              color="bg-purple-500"
              subtitle={`${overview.active_tasks} active tasks`}
            />
            <MetricCard
              title="Total Enrollments"
              value={overview.total_enrollments}
              change={growth.enrollment_growth}
              icon={Award}
              color="bg-orange-500"
              subtitle={`${overview.total_applications} applications`}
            />
          </div>
        )}

        {/* User Statistics */}
        {overview && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Distribution by Role</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Learners</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {overview.total_learners} ({((overview.total_learners / overview.total_users) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${(overview.total_learners / overview.total_users) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Companies</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {overview.total_companies} ({((overview.total_companies / overview.total_users) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{ width: `${(overview.total_companies / overview.total_users) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Supervisors</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {overview.total_supervisors} ({((overview.total_supervisors / overview.total_users) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full transition-all"
                      style={{ width: `${(overview.total_supervisors / overview.total_users) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Activity className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Active Users</p>
                      <p className="text-2xl font-bold text-gray-900">{overview.active_users}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">of total users</p>
                    <p className="text-lg font-semibold text-green-600">
                      {((overview.active_users / overview.total_users) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Briefcase className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Active Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{overview.active_tasks}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">of total tasks</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {((overview.active_tasks / overview.total_tasks) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <BookOpen className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Published Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{overview.published_courses}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">of total courses</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {((overview.published_courses / overview.total_courses) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Metrics */}
        {engagement && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Engagement</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                  <Award className="text-white" size={28} />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">Enrollment Rate</p>
                <p className="text-4xl font-bold text-green-600 mb-2">{engagement.enrollment_rate}%</p>
                <p className="text-xs text-gray-600">Learners enrolled in courses</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-full mb-4">
                  <Briefcase className="text-white" size={28} />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">Application Rate</p>
                <p className="text-4xl font-bold text-purple-600 mb-2">{engagement.application_rate}%</p>
                <p className="text-xs text-gray-600">Learners applied to tasks</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                  <BarChart3 className="text-white" size={28} />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">Avg. Enrollments</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">{engagement.avg_enrollments_per_learner}</p>
                <p className="text-xs text-gray-600">Per active learner</p>
              </div>
            </div>
          </div>
        )}

        {/* Growth Trends */}
        {growth && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Growth Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">User Growth</span>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    growth.user_growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growth.user_growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(growth.user_growth)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{growth.new_users}</p>
                <p className="text-xs text-gray-500 mt-1">new users this period</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Course Growth</span>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    growth.course_growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growth.course_growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(growth.course_growth)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{growth.new_courses}</p>
                <p className="text-xs text-gray-500 mt-1">new courses this period</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Task Growth</span>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    growth.task_growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growth.task_growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(growth.task_growth)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{growth.new_tasks}</p>
                <p className="text-xs text-gray-500 mt-1">new tasks this period</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Enrollment Growth</span>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    growth.enrollment_growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growth.enrollment_growth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(growth.enrollment_growth)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{growth.new_enrollments}</p>
                <p className="text-xs text-gray-500 mt-1">new enrollments this period</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AdminAnalytics
