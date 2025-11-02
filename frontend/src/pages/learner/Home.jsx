import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import { Send, Clock, DollarSign, MapPin } from 'lucide-react'
import CourseRecommendations from '../../components/ai/CourseRecommendations'

const LearnerHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [enrollmentsRes, applicationsRes] = await Promise.all([
        api.get('/courses/my-enrollments'),
        api.get('/tasks/applications/my')
      ])

      setEnrollments(enrollmentsRes.data.enrollments.slice(0, 4))
      setRecentTasks(applicationsRes.data.applications.slice(0, 4))

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatStatus = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
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
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between text-white">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Hi {user?.name?.split(' ')[0]}, continue your learning journey!
            </h1>
            <p className="text-blue-100 text-sm">
              Keep learning and growing with new courses and tasks
            </p>
          </div>
          <div className="hidden md:block">
            <Send size={48} className="opacity-80" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Courses - Left Side (2/3) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Active Courses</h2>
              <button
                onClick={() => navigate('/learner/courses')}
                className="text-primary hover:text-primary-600 text-sm font-medium"
              >
                View All
              </button>
            </div>

            {enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/learner/courses/${enrollment.course_id}/player`)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <div className="text-3xl font-bold mb-1">
                            {enrollment.completion_percentage.toFixed(0)}%
                          </div>
                          <div className="text-sm opacity-90">Complete</div>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {enrollment.course_title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          Continue where you left off and complete this course
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Last accessed recently
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.completion_percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600 mb-4">No active courses yet</p>
                <button
                  onClick={() => navigate('/learner/courses')}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>

          {/* Recent Task - Right Side (1/3) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Task</h2>
              <button
                onClick={() => navigate('/learner/applications')}
                className="text-primary hover:text-primary-600 text-sm font-medium"
              >
                View All
              </button>
            </div>

            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((application) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer border-l-4 border-primary"
                    onClick={() => navigate('/learner/applications')}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {application.task_title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(application.status)}`}>
                        {formatStatus(application.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {application.company_name}
                    </p>
                    {application.compensation && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <DollarSign size={12} />
                        <span>{application.compensation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 text-sm mb-3">No task applications yet</p>
                <button
                  onClick={() => navigate('/learner/tasks')}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 text-sm"
                >
                  Browse Tasks
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI-Powered Recommendations */}
        <div className="mt-8">
          <CourseRecommendations limit={5} />
        </div>
      </div>
    </Layout>
  )
}

export default LearnerHome
