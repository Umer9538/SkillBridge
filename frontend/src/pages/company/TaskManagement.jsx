import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { Plus, Edit, Trash2, Eye, Clock, DollarSign, Users, Calendar } from 'lucide-react'
import { format } from 'date-fns'

const TaskManagement = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    difficulty: 'Beginner',
    skills_required: '',
    estimated_hours: '',
    compensation: '',
    deadline: '',
    requirements: '',
    deliverables: '',
    max_applicants: 5
  })
  const [submitting, setSubmitting] = useState(false)

  const categories = ['Programming', 'Data Analysis', 'UX/UI Design', 'Cybersecurity', 'Marketing', 'Other']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks/my')
      setTasks(response.data.tasks || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setLoading(false)
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setFormData({
      title: '',
      description: '',
      category: 'Programming',
      difficulty: 'Beginner',
      skills_required: '',
      estimated_hours: '',
      compensation: '',
      deadline: '',
      requirements: '',
      deliverables: '',
      max_applicants: 5
    })
    setShowModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      difficulty: task.difficulty,
      skills_required: Array.isArray(task.skills_required) ? task.skills_required.join(', ') : '',
      estimated_hours: task.estimated_hours || '',
      compensation: task.compensation || '',
      deadline: task.deadline ? format(new Date(task.deadline), 'yyyy-MM-dd') : '',
      requirements: task.requirements || '',
      deliverables: task.deliverables || '',
      max_applicants: task.max_applicants || 5
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const taskData = {
        ...formData,
        skills_required: formData.skills_required.split(',').map(s => s.trim()).filter(s => s),
        estimated_hours: parseInt(formData.estimated_hours) || 0,
        max_applicants: parseInt(formData.max_applicants) || 5
      }

      if (editingTask) {
        await api.put(`/companies/tasks/${editingTask.id}`, taskData)
        alert('Task updated successfully!')
      } else {
        await api.post('/companies/tasks', taskData)
        alert('Task created successfully!')
      }

      setShowModal(false)
      fetchTasks()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save task')
    }
    setSubmitting(false)
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await api.delete(`/companies/tasks/${taskId}`)
      alert('Task deleted successfully!')
      fetchTasks()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete task')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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
        <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Management</h1>
            <p className="text-gray-600">Create and manage your tasks</p>
          </div>
          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus size={20} />
            Post New Task
          </button>
        </div>

        {/* Tasks List */}
        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{task.application_count || 0} Applicants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    <span>{task.estimated_hours}h</span>
                  </div>
                  {task.compensation && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign size={16} />
                      <span>{task.compensation}</span>
                    </div>
                  )}
                  {task.deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {task.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {task.difficulty}
                  </span>
                  {task.skills_required && task.skills_required.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Plus size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks posted yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first task to start receiving applications from talented learners
            </p>
            <button
              onClick={handleCreateTask}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600"
            >
              Post Your First Task
            </button>
          </div>
        )}

        {/* Create/Edit Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Build a Responsive Landing Page"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Describe the task in detail..."
                    />
                  </div>

                  {/* Category and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        {difficulties.map((diff) => (
                          <option key={diff} value={diff}>
                            {diff}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills Required
                    </label>
                    <input
                      type="text"
                      value={formData.skills_required}
                      onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., React, JavaScript, CSS (comma separated)"
                    />
                  </div>

                  {/* Hours, Compensation, Deadline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Hours
                      </label>
                      <input
                        type="number"
                        value={formData.estimated_hours}
                        onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compensation (optional)
                      </label>
                      <input
                        type="text"
                        value={formData.compensation}
                        onChange={(e) => setFormData({ ...formData, compensation: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="$500 - $1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="List specific requirements..."
                    />
                  </div>

                  {/* Deliverables */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deliverables
                    </label>
                    <textarea
                      value={formData.deliverables}
                      onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="What should be delivered..."
                    />
                  </div>

                  {/* Max Applicants */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Applicants
                    </label>
                    <input
                      type="number"
                      value={formData.max_applicants}
                      onChange={(e) => setFormData({ ...formData, max_applicants: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="5"
                      min="1"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TaskManagement
