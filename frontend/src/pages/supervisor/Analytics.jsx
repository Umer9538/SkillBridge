import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { BookOpen, Users, TrendingUp, Award, Target, Clock, BarChart as BarChartIcon, CheckCircle } from 'lucide-react'

const SupervisorAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    overview: {
      totalCourses: 0,
      publishedCourses: 0,
      totalEnrollments: 0,
      totalModules: 0,
      completionRate: 0,
      averageRating: 0
    },
    coursesByCategory: [],
    coursesByDifficulty: [],
    enrollmentStats: [],
    topCourses: []
  })
  const [dateRange, setDateRange] = useState('30days')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await api.get('/supervisors/courses')
      const courses = response.data.courses || []

      // Calculate overview metrics
      const totalModules = courses.reduce((sum, course) => sum + (course.module_count || 0), 0)
      const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrollment_count || 0), 0)
      const completedEnrollments = courses.reduce((sum, course) => sum + (course.completed_enrollments || 0), 0)
      const avgRating = courses.length > 0
        ? courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length
        : 0

      const overview = {
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.status === 'published').length,
        totalEnrollments,
        totalModules,
        completionRate: totalEnrollments > 0 ? ((completedEnrollments / totalEnrollments) * 100).toFixed(1) : 0,
        averageRating: avgRating.toFixed(1)
      }

      // Group courses by category
      const coursesByCategory = courses.reduce((acc, course) => {
        const existing = acc.find(item => item.category === course.category)
        if (existing) {
          existing.count++
          existing.enrollments += course.enrollment_count || 0
        } else {
          acc.push({
            category: course.category,
            count: 1,
            enrollments: course.enrollment_count || 0
          })
        }
        return acc
      }, [])

      // Group courses by difficulty
      const coursesByDifficulty = courses.reduce((acc, course) => {
        const existing = acc.find(item => item.difficulty === course.difficulty)
        if (existing) {
          existing.count++
        } else {
          acc.push({ difficulty: course.difficulty, count: 1 })
        }
        return acc
      }, [])

      // Top courses by enrollments
      const topCourses = [...courses]
        .sort((a, b) => (b.enrollment_count || 0) - (a.enrollment_count || 0))
        .slice(0, 5)

      setAnalytics({
        overview,
        coursesByCategory,
        coursesByDifficulty,
        topCourses
      })

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      setLoading(false)
    }
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
          <p className="text-gray-600">Track your course performance and student engagement</p>
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
          {/* Total Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.totalCourses}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Courses</h3>
            <p className="text-xs text-gray-500 mt-1">{analytics.overview.publishedCourses} published</p>
          </div>

          {/* Total Enrollments */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.totalEnrollments}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
            <p className="text-xs text-gray-500 mt-1">Across all courses</p>
          </div>

          {/* Total Modules */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChartIcon className="text-green-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.totalModules}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Modules</h3>
            <p className="text-xs text-gray-500 mt-1">Content created</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CheckCircle className="text-orange-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.completionRate}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Completion Rate</h3>
            <p className="text-xs text-gray-500 mt-1">Students who finished</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="text-yellow-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{analytics.overview.averageRating}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
            <p className="text-xs text-gray-500 mt-1">Out of 5.0</p>
          </div>

          {/* Avg Enrollments per Course */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Target className="text-indigo-600" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.overview.totalCourses > 0
                  ? (analytics.overview.totalEnrollments / analytics.overview.totalCourses).toFixed(0)
                  : 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Avg Students/Course</h3>
            <p className="text-xs text-gray-500 mt-1">Enrollment average</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Courses by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses by Category</h3>
            <div className="space-y-3">
              {analytics.coursesByCategory.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-600">{item.count} courses</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / analytics.overview.totalCourses) * 100}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.enrollments} enrollments</p>
                </div>
              ))}
              {analytics.coursesByCategory.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>

          {/* Courses by Difficulty */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses by Difficulty</h3>
            <div className="space-y-3">
              {analytics.coursesByDifficulty.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.difficulty}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${getDifficultyColor(item.difficulty)} h-2 rounded-full`}
                      style={{
                        width: `${(item.count / analytics.overview.totalCourses) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {analytics.coursesByDifficulty.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No data available</p>
              )}
            </div>
          </div>

          {/* Top Performing Courses */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Students</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {analytics.topCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{course.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">{course.enrollment_count || 0}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Award size={14} className="text-yellow-500" />
                          <span className="text-sm text-gray-900">{(course.rating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {analytics.topCourses.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No courses available</p>
              )}
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {analytics.overview.completionRate}% completion rate
                </p>
                <p className="text-xs text-gray-600">
                  {analytics.overview.completionRate > 70 ? 'Excellent!' : analytics.overview.completionRate > 50 ? 'Good' : 'Needs improvement'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {analytics.overview.totalEnrollments} total students
                </p>
                <p className="text-xs text-gray-600">Across all your courses</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="text-yellow-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {analytics.overview.averageRating}/5.0 average rating
                </p>
                <p className="text-xs text-gray-600">Student satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SupervisorAnalytics
