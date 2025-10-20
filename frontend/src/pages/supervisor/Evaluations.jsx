import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { BookOpen, Users, TrendingUp, Award, Search } from 'lucide-react'

const Evaluations = () => {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetchEnrollments(selectedCourse)
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/supervisors/courses')
      setCourses(response.data.courses)
      if (response.data.courses.length > 0) {
        setSelectedCourse(response.data.courses[0].id)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrollments = async (courseId) => {
    try {
      const response = await api.get(`/api/courses/${courseId}/enrollments`)
      setEnrollments(response.data.enrollments || [])
    } catch (error) {
      console.error('Failed to fetch enrollments:', error)
      setEnrollments([])
    }
  }

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.learner_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      dropped: 'bg-red-100 text-red-800'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const selectedCourseData = courses.find(c => c.id === selectedCourse)
  const totalEnrollments = enrollments.length
  const completedEnrollments = enrollments.filter(e => e.status === 'completed').length
  const averageProgress = totalEnrollments > 0
    ? enrollments.reduce((sum, e) => sum + (e.completion_percentage || 0), 0) / totalEnrollments
    : 0

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Progress & Evaluations</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center justify-center text-gray-500 py-8">
              <BookOpen size={48} className="mb-4 text-gray-300" />
              <p className="text-lg">No courses yet</p>
              <p className="text-sm">Create a course to start tracking student progress</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Course Selector */}
            <div className="bg-white rounded-lg shadow p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse || ''}
                onChange={(e) => setSelectedCourse(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalEnrollments}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{completedEnrollments}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Award className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {averageProgress.toFixed(0)}%
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <TrendingUp className="text-yellow-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {enrollments.filter(e => e.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BookOpen className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Enrolled Students
                  </h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                {filteredEnrollments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    {searchQuery ? 'No students found' : 'No enrollments yet'}
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrolled
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEnrollments.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {enrollment.learner_name || 'Unknown Student'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enrollment.learner_email || 'No email'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(enrollment.status)}`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(enrollment.completion_percentage)}`}
                                  style={{ width: `${enrollment.completion_percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-700">
                                {enrollment.completion_percentage?.toFixed(0) || 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enrollment.enrolled_at ? new Date(enrollment.enrolled_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Evaluations
