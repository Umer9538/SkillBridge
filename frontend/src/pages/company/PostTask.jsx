import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { ArrowLeft, Plus, X, Upload, Calendar, Clock, DollarSign, Users, FileText } from 'lucide-react'

const PostTask = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Programming',
    difficulty: 'Beginner',
    skills_required: [],
    estimated_hours: '',
    deadline: '',
    requirements: '',
    deliverables: [],
    max_applicants: 5,
    compensation: ''
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [currentDeliverable, setCurrentDeliverable] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [attachments, setAttachments] = useState([])

  const categories = [
    'Programming',
    'Data Analysis',
    'UX/UI Design',
    'Cybersecurity',
    'Marketing',
    'Content Writing',
    'Video Editing',
    'Other'
  ]

  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (currentSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills_required: [...prev.skills_required, currentSkill.trim()]
      }))
      setCurrentSkill('')
    }
  }

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills_required: prev.skills_required.filter((_, i) => i !== index)
    }))
  }

  const handleAddDeliverable = () => {
    if (currentDeliverable.trim()) {
      setFormData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, currentDeliverable.trim()]
      }))
      setCurrentDeliverable('')
    }
  }

  const handleRemoveDeliverable = (index) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setAttachments(prev => [...prev, ...files])
  }

  const handleRemoveFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        skills_required: formData.skills_required,
        estimated_hours: parseInt(formData.estimated_hours) || 0,
        deadline: formData.deadline || null,
        requirements: formData.requirements,
        deliverables: formData.deliverables.join('\n'),
        max_applicants: parseInt(formData.max_applicants) || 5,
        compensation: formData.compensation
      }

      await api.post('/companies/tasks', taskData)
      alert('Task posted successfully!')
      navigate('/company/tasks')
    } catch (error) {
      console.error('Failed to create task:', error)
      alert(error.response?.data?.message || 'Failed to post task')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/company/tasks')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Tasks
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Task</h1>
          <p className="text-gray-600">Create a new opportunity for learners</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            {/* Task Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Build a responsive landing page"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Task Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the task in detail, including objectives and expectations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category and Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {difficulties.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, difficulty: level }))}
                      className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                        formData.difficulty === level
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Requirements Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>

            {/* Skills Required */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Add a skill (e.g., React, Python)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="3"
                placeholder="List any additional requirements or prerequisites..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Deliverables Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Deliverables</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Deliverables
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={currentDeliverable}
                  onChange={(e) => setCurrentDeliverable(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())}
                  placeholder="Add a deliverable (e.g., Source code with documentation)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.deliverables.map((deliverable, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-gray-400" />
                      <span className="text-gray-900">{deliverable}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Configuration Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estimated Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    Estimated Hours
                  </div>
                </label>
                <input
                  type="number"
                  name="estimated_hours"
                  value={formData.estimated_hours}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g., 40"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Deadline
                  </div>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Max Applicants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    Max Applicants
                  </div>
                </label>
                <input
                  type="number"
                  name="max_applicants"
                  value={formData.max_applicants}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Compensation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Compensation (Optional)
                  </div>
                </label>
                <input
                  type="text"
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  placeholder="e.g., $500 or Unpaid"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Attachments Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Attachments</h2>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto text-gray-400 mb-3" size={40} />
              <p className="text-gray-600 mb-2">Drag & drop files here, or click to browse</p>
              <p className="text-sm text-gray-500 mb-4">Supports: PDF, DOC, images (Max 10MB)</p>
              <label className="inline-block">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                <span className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer inline-block">
                  Browse Files
                </span>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-gray-400" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/company/tasks')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Publishing...' : 'Publish Task'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default PostTask
