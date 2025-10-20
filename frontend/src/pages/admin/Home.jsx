import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import {
  Users,
  BookOpen,
  Briefcase,
  TrendingUp,
  UserCheck,
  Award,
  Activity,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const AdminHome = () => {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState(null)
  const [growth, setGrowth] = useState(null)
  const [topCourses, setTopCourses] = useState([])
  const [topCompanies, setTopCompanies] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [engagement, setEngagement] = useState(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, growthRes, coursesRes, companiesRes, activityRes, engagementRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/growth'),
        api.get('/admin/analytics/top-courses'),
        api.get('/admin/analytics/top-companies'),
        api.get('/admin/analytics/recent-activity'),
        api.get('/admin/analytics/engagement')
      ])

      setOverview(overviewRes.data.overview)
      setGrowth(growthRes.data.growth)
      setTopCourses(coursesRes.data.top_courses)
      setTopCompanies(companiesRes.data.top_companies)
      setRecentActivity(activityRes.data.recent_activity)
      setEngagement(engagementRes.data.engagement)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  )

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <Users size={16} className="text-blue-600" />
      case 'course_enrollment':
        return <BookOpen size={16} className="text-green-600" />
      case 'task_application':
        return <Briefcase size={16} className="text-purple-600" />
      default:
        return <Activity size={16} className="text-gray-600" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registration':
        return 'bg-blue-50'
      case 'course_enrollment':
        return 'bg-green-50'
      case 'task_application':
        return 'bg-purple-50'
      default:
        return 'bg-gray-50'
    }
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor platform performance and user activity</p>
        </div>

        {/* Overview Stats */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={overview.total_users}
              icon={Users}
              color="bg-blue-500"
              subtitle={`${overview.active_users} active`}
            />
            <StatCard
              title="Total Courses"
              value={overview.total_courses}
              icon={BookOpen}
              color="bg-green-500"
              subtitle={`${overview.published_courses} published`}
            />
            <StatCard
              title="Total Tasks"
              value={overview.total_tasks}
              icon={Briefcase}
              color="bg-purple-500"
              subtitle={`${overview.active_tasks} active`}
            />
            <StatCard
              title="Enrollments"
              value={overview.total_enrollments}
              icon={Award}
              color="bg-orange-500"
              subtitle={`${overview.total_applications} applications`}
            />
          </div>
        )}

        {/* User Distribution */}
        {overview && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Learners</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.total_learners}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {((overview.total_learners / overview.total_users) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(overview.total_learners / overview.total_users) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Companies</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.total_companies}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {((overview.total_companies / overview.total_users) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(overview.total_companies / overview.total_users) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Supervisors</p>
                    <p className="text-2xl font-bold text-gray-900">{overview.total_supervisors}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {((overview.total_supervisors / overview.total_users) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(overview.total_supervisors / overview.total_users) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Metrics */}
        {engagement && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Engagement Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Enrollment Rate</p>
                <p className="text-4xl font-bold text-green-600">{engagement.enrollment_rate}%</p>
                <p className="text-xs text-gray-500 mt-1">of learners enrolled in courses</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Application Rate</p>
                <p className="text-4xl font-bold text-purple-600">{engagement.application_rate}%</p>
                <p className="text-xs text-gray-500 mt-1">of learners applied to tasks</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Avg. Enrollments</p>
                <p className="text-4xl font-bold text-blue-600">{engagement.avg_enrollments_per_learner}</p>
                <p className="text-xs text-gray-500 mt-1">per active learner</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Courses</h2>
            {topCourses.length > 0 ? (
              <div className="space-y-3">
                {topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-500 text-sm mb-1">
                        <Award size={14} />
                        <span>{course.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{course.enrollments} enrolled</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No courses yet</p>
            )}
          </div>

          {/* Top Companies */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Companies</h2>
            {topCompanies.length > 0 ? (
              <div className="space-y-3">
                {topCompanies.map((company, index) => (
                  <div key={company.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{company.name}</p>
                      <p className="text-xs text-gray-500">{company.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{company.tasks_posted} tasks</p>
                      <p className="text-xs text-gray-600">{company.total_applications} applications</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No companies yet</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${getActivityColor(activity.type)}`}
                >
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AdminHome
