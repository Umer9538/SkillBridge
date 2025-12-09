import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import { BookOpen, Users, Award, TrendingUp, Plus, Edit, BarChart } from 'lucide-react'

const SupervisorHome = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalModules: 0,
    averageRating: 0,
    completionRate: 0
  })
  const [recentCourses, setRecentCourses] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get('/supervisors/courses')
      const courses = response.data.courses || []

      // Calculate stats
      const publishedCourses = courses.filter(c => c.status === 'published')
      const totalModules = courses.reduce((sum, c) => sum + (c.total_modules || 0), 0)
      const totalStudents = courses.reduce((sum, c) => sum + (c.total_enrollments || 0), 0)

      // Calculate average rating (if courses have ratings)
      const coursesWithRatings = courses.filter(c => c.rating && c.rating > 0)
      const avgRating = coursesWithRatings.length > 0
        ? coursesWithRatings.reduce((sum, c) => sum + c.rating, 0) / coursesWithRatings.length
        : 0

      setStats({
        totalCourses: courses.length,
        publishedCourses: publishedCourses.length,
        totalStudents,
        totalModules,
        averageRating: avgRating,
        completionRate: 0 // Will calculate from enrollments if needed
      })

      // Get 4 most recent courses
      setRecentCourses(courses.slice(0, 4))
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-700',
      draft: 'bg-yellow-100 text-yellow-700',
      archived: 'bg-gray-100 text-gray-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
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
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-blue-100 text-sm">
              Manage your courses and track student progress
            </p>
          </div>
          <div className="hidden md:block">
            <BookOpen size={48} className="opacity-80" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalCourses}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Courses</h3>
            <p className="text-xs text-gray-500 mt-1">{stats.publishedCourses} published</p>
          </div>

          {/* Total Students */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalStudents}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
            <p className="text-xs text-gray-500 mt-1">Across all courses</p>
          </div>

          {/* Total Modules */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalModules}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Modules</h3>
            <p className="text-xs text-gray-500 mt-1">Learning content</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
            <p className="text-xs text-gray-500 mt-1">Student feedback</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => navigate('/supervisor/courses', { state: { openCreateModal: true } })}
            className="bg-primary text-white rounded-lg p-4 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 font-medium shadow"
          >
            <Plus size={20} />
            Create New Course
          </button>
          <button
            onClick={() => navigate('/supervisor/courses')}
            className="bg-white text-gray-700 rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium shadow border border-gray-200"
          >
            <Edit size={20} />
            Manage Courses
          </button>
          <button
            onClick={() => navigate('/supervisor/evaluations')}
            className="bg-white text-gray-700 rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium shadow border border-gray-200"
          >
            <BarChart size={20} />
            View Evaluations
          </button>
        </div>

        {/* Recent Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Courses</h2>
            <button
              onClick={() => navigate('/supervisor/courses')}
              className="text-primary hover:text-primary-600 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/supervisor/courses/${course.id}`)}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {course.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(course.status)}`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen size={14} />
                        {course.total_modules || 0} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {course.total_enrollments || 0} students
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {course.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-600 mb-4">You haven't created any courses yet</p>
              <button
                onClick={() => navigate('/supervisor/courses', { state: { openCreateModal: true } })}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600 inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default SupervisorHome
