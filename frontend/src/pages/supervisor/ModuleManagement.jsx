import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import FileUpload from '../../components/common/FileUpload'
import api from '../../utils/api'
import { Plus, Edit, Trash2, ArrowLeft, Save, X, FileText, Video, Link, ChevronUp, ChevronDown } from 'lucide-react'

const ModuleManagement = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: 'text',
    content_data: '',
    order: 1,
    duration_minutes: '',
    video_url: '',
    document_url: ''
  })

  const contentTypes = [
    { value: 'text', label: 'Text Content', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'link', label: 'External Link', icon: Link }
  ]

  useEffect(() => {
    fetchCourseAndModules()
  }, [courseId])

  const fetchCourseAndModules = async () => {
    try {
      const [courseRes, modulesRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/supervisors/courses/${courseId}/modules`)
      ])

      setCourse(courseRes.data.course)
      setModules(modulesRes.data.modules || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (uploadData, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: uploadData.url
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingModule) {
        await api.put(`/supervisors/modules/${editingModule.id}`, formData)
        alert('Module updated successfully!')
      } else {
        await api.post(`/supervisors/courses/${courseId}/modules`, formData)
        alert('Module created successfully!')
      }

      setShowModal(false)
      resetForm()
      fetchCourseAndModules()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save module')
    }
  }

  const handleEdit = (module) => {
    setEditingModule(module)
    setFormData({
      title: module.title,
      description: module.description || '',
      content_type: module.content_type,
      content_data: module.content_data || '',
      order: module.order,
      duration_minutes: module.duration_minutes || '',
      video_url: module.video_url || '',
      document_url: module.document_url || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (moduleId) => {
    if (!confirm('Are you sure you want to delete this module?')) return

    try {
      await api.delete(`/supervisors/modules/${moduleId}`)
      alert('Module deleted successfully!')
      fetchCourseAndModules()
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete module')
    }
  }

  const handleReorder = async (moduleId, direction) => {
    const moduleIndex = modules.findIndex(m => m.id === moduleId)
    if (direction === 'up' && moduleIndex === 0) return
    if (direction === 'down' && moduleIndex === modules.length - 1) return

    const newModules = [...modules]
    const targetIndex = direction === 'up' ? moduleIndex - 1 : moduleIndex + 1

    // Swap orders
    const temp = newModules[moduleIndex]
    newModules[moduleIndex] = newModules[targetIndex]
    newModules[targetIndex] = temp

    // Update order numbers
    newModules.forEach((module, index) => {
      module.order = index + 1
    })

    setModules(newModules)

    try {
      await api.put(`/supervisors/modules/${moduleId}/reorder`, {
        new_order: direction === 'up' ? moduleIndex : moduleIndex + 2
      })
    } catch (error) {
      console.error('Failed to reorder:', error)
      fetchCourseAndModules() // Revert on error
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content_type: 'text',
      content_data: '',
      order: modules.length + 1,
      duration_minutes: '',
      video_url: '',
      document_url: ''
    })
    setEditingModule(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
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
          <button
            onClick={() => navigate('/supervisor/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Courses
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
              <p className="text-gray-600">Manage course modules and content</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Module
            </button>
          </div>
        </div>

        {/* Modules List */}
        {modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module, index) => {
              const ContentIcon = contentTypes.find(t => t.value === module.content_type)?.icon || FileText

              return (
                <div key={module.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Order Number */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleReorder(module.id, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <button
                          onClick={() => handleReorder(module.id, 'down')}
                          disabled={index === modules.length - 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <ContentIcon className="text-primary" size={24} />
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{module.title}</h3>
                              {module.description && (
                                <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {module.duration_minutes && (
                              <span className="text-sm text-gray-500">{module.duration_minutes} min</span>
                            )}
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                              {contentTypes.find(t => t.value === module.content_type)?.label}
                            </span>
                          </div>
                        </div>

                        {/* Content Preview */}
                        {module.content_type === 'text' && module.content_data && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 line-clamp-3">
                            {module.content_data}
                          </div>
                        )}

                        {module.content_type === 'video' && module.video_url && (
                          <div className="mt-3">
                            <a
                              href={module.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Video URL: {module.video_url}
                            </a>
                          </div>
                        )}

                        {module.content_type === 'document' && module.document_url && (
                          <div className="mt-3">
                            <a
                              href={`${import.meta.env.VITE_API_URL}${module.document_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center gap-2"
                            >
                              <FileText size={16} />
                              View Document
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(module)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(module.id)}
                          className="px-4 py-2 border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 mb-6">Add your first module to start building this course</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add Module
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingModule ? 'Edit Module' : 'Add New Module'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter module title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter module description"
                  />
                </div>

                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {contentTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, content_type: type.value }))}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                            formData.content_type === type.value
                              ? 'border-primary bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Icon size={24} className={formData.content_type === type.value ? 'text-primary' : 'text-gray-500'} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Estimated duration in minutes"
                  />
                </div>

                {/* Content based on type */}
                {formData.content_type === 'text' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Content *
                    </label>
                    <textarea
                      name="content_data"
                      value={formData.content_data}
                      onChange={handleInputChange}
                      required
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter the module content..."
                    />
                  </div>
                )}

                {formData.content_type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      name="video_url"
                      value={formData.video_url}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supports YouTube, Vimeo, and other video platforms
                    </p>
                  </div>
                )}

                {formData.content_type === 'document' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Document *
                    </label>
                    <FileUpload
                      uploadType="course-document"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      maxSize={20}
                      label="Upload course document"
                      onUploadSuccess={(data) => handleFileUpload(data, 'document_url')}
                      currentFile={formData.document_url}
                    />
                  </div>
                )}

                {formData.content_type === 'link' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      External Link *
                    </label>
                    <input
                      type="url"
                      name="content_data"
                      value={formData.content_data}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingModule ? 'Update Module' : 'Add Module'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ModuleManagement
