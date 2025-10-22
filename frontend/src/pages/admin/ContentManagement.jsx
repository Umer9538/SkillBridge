import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { BookOpen, Briefcase, Search, Filter, Trash2, Eye, Ban, CheckCircle, Award } from 'lucide-react'
import { format } from 'date-fns'

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('courses')
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchContent()
  }, [activeTab])

  const fetchContent = async () => {
    try {
      setLoading(true)
      if (activeTab === 'courses') {
        const response = await api.get('/admin/courses')
        setCourses(response.data.courses || [])
      } else {
        const response = await api.get('/admin/tasks')
        setTasks(response.data.tasks || [])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch content:', error)
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return

    try {
      await api.delete(`/admin/courses/${courseId}`)
      alert('Course deleted successfully!')
      fetchContent()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete course')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) return

    try {
      await api.delete(`/admin/tasks/${taskId}`)
      alert('Task deleted successfully!')
      fetchContent()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task')
    }
  }

  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    if (!confirm(`Are you sure you want to ${newStatus === 'published' ? 'publish' : 'unpublish'} this course?`)) return

    try {
      await api.put(`/admin/courses/${courseId}/status`, { status: newStatus })
      alert(`Course ${newStatus === 'published' ? 'published' : 'unpublished'} successfully!`)
      fetchContent()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update course status')
    }
  }

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this task?`)) return

    try {
      await api.put(`/admin/tasks/${taskId}/status`, { status: newStatus })
      alert(`Task ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
      fetchContent()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update task status')
    }
  }

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
          <p className="text-gray-600">Manage all courses and tasks on the platform</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setActiveTab('courses')
                setSearchTerm('')
                setStatusFilter('all')
              }}
              className={`pb-4 px-2 sm:px-4 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen size={20} />
              Courses ({courses.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('tasks')
                setSearchTerm('')
                setStatusFilter('all')
              }}
              className={`pb-4 px-2 sm:px-4 font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Briefcase size={20} />
              Tasks ({tasks.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                {activeTab === 'courses' ? (
                  <>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </>
                ) : (
                  <>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="inactive">Inactive</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Supervisor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Enrollments</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-primary-100 rounded flex items-center justify-center">
                              <BookOpen className="text-primary-600" size={20} />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{course.title}</div>
                            <div className="text-xs text-gray-500">{course.difficulty}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {course.supervisor_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {course.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {course.enrollment_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {course.created_at ? format(new Date(course.created_at), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleCourseStatus(course.id, course.status)}
                            className={`p-2 rounded transition-colors ${
                              course.status === 'published'
                                ? 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={course.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {course.status === 'published' ? <Ban size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete course"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No courses found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks Table */}
        {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredTasks.length} of {tasks.length} tasks
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center">
                            <Briefcase className="text-purple-600" size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{task.title}</div>
                            <div className="text-xs text-gray-500">{task.difficulty}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {task.company_name || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                          {task.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {task.application_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {task.created_at ? format(new Date(task.created_at), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleTaskStatus(task.id, task.status)}
                            className={`p-2 rounded transition-colors ${
                              task.status === 'active'
                                ? 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={task.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {task.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No tasks found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ContentManagement
