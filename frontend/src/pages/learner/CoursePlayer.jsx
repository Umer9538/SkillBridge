import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { CheckCircle, Award, PlayCircle, MessageSquare, Send, FileText, BookOpen } from 'lucide-react'

const CoursePlayerPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')

  useEffect(() => {
    fetchCourseData()
  }, [id])

  const fetchCourseData = async () => {
    try {
      const [courseRes, enrollmentRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get('/courses/my-enrollments')
      ])

      setCourse(courseRes.data.course)
      const enrolled = enrollmentRes.data.enrollments.find(
        (e) => e.course_id === parseInt(id)
      )
      setEnrollment(enrolled)

      // Find first incomplete module or start from beginning
      if (enrolled && courseRes.data.course.modules) {
        const firstIncomplete = courseRes.data.course.modules.findIndex(
          (m) => !enrolled.progress[m.id]
        )
        setCurrentModuleIndex(firstIncomplete >= 0 ? firstIncomplete : 0)
      }

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch course data:', error)
      setLoading(false)
    }
  }

  const markModuleComplete = async (moduleId) => {
    try {
      await api.put(`/courses/enrollments/${enrollment.id}/progress`, {
        module_id: moduleId,
        completed: true
      })
      // Refresh enrollment data
      const response = await api.get('/courses/my-enrollments')
      const updated = response.data.enrollments.find((e) => e.course_id === parseInt(id))
      setEnrollment(updated)
    } catch (error) {
      console.error('Failed to mark module as complete:', error)
    }
  }

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      // Mark current module as complete
      markModuleComplete(course.modules[currentModuleIndex].id)
      setCurrentModuleIndex(currentModuleIndex + 1)
    } else {
      // Course completed
      markModuleComplete(course.modules[currentModuleIndex].id)
      alert('Congratulations! You have completed the course!')
    }
  }

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }

  const isModuleCompleted = (moduleId) => {
    return enrollment?.progress?.[moduleId] || false
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

  if (!course || !enrollment) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Please enroll in this course to access the content
          </h2>
          <button
            onClick={() => navigate(`/learner/courses/${id}`)}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600"
          >
            Go to Course Details
          </button>
        </div>
      </Layout>
    )
  }

  const currentModule = course.modules[currentModuleIndex]
  const completedModules = course.modules.filter(m => isModuleCompleted(m.id)).length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video/Content Area */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {currentModule.content_type === 'video' ? (
                  <div className="text-center text-gray-600">
                    <PlayCircle size={64} className="mx-auto mb-4" />
                    <p className="text-lg font-medium">Video Player</p>
                    <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto px-4">
                      Video content for: {currentModule.title}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-gray-600 p-8">
                    <BookOpen size={64} className="mx-auto mb-4" />
                    <p className="text-lg font-medium">Learning Content</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {currentModule.content_type}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Module Title & Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentModule.title}
              </h2>
              {currentModule.description && (
                <p className="text-gray-600 leading-relaxed">{currentModule.description}</p>
              )}
            </div>

            {/* Discussion & Comments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={24} />
                Discussion & Comments
              </h3>

              {/* Comment Input */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows={3}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                  <button
                    onClick={() => {
                      // Handle comment submission
                      setComment('')
                      alert('Comment submitted!')
                    }}
                    disabled={!comment.trim()}
                    className="self-end bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={16} />
                    Post
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No comments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Be the first to start the discussion</p>
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={24} />
                Assignment
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Test your knowledge with our quiz
                </p>
                <button
                  onClick={() => {
                    handleNextModule()
                  }}
                  className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  {isModuleCompleted(currentModule.id) ? 'Mark as Complete & Continue' : 'Take Quiz'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Progress</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">
                    {enrollment.completion_percentage.toFixed(0)}%
                  </span>
                  <span className="text-sm text-gray-600">
                    {completedModules} of {course.modules.length} lessons completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${enrollment.completion_percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Modules</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.modules.map((module, index) => (
                  <button
                    key={module.id}
                    onClick={() => setCurrentModuleIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentModuleIndex
                        ? 'bg-primary-50 border-2 border-primary'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {isModuleCompleted(module.id) ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${
                          index === currentModuleIndex ? 'text-primary' : 'text-gray-900'
                        }`}>
                          {module.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{module.duration} minutes</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Prerequisites</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic programming knowledge</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Computer with internet connection</span>
                </li>
              </ul>
            </div>

            {/* Certificate */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Certificate</h3>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
                <Award className="text-yellow-600 mx-auto mb-2" size={32} />
                <p className="text-center text-sm text-gray-700">
                  {enrollment.status === 'completed'
                    ? 'Certificate earned!'
                    : 'Complete course to earn certificate'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CoursePlayerPage
