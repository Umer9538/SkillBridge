import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import ReviewsSection from '../../components/reviews/ReviewsSection'
import api from '../../utils/api'
import { Clock, BarChart, BookOpen, User, CheckCircle, PlayCircle, Award, Star, Mail } from 'lucide-react'

const CourseDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [enrollment, setEnrollment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCourseDetails()
    checkEnrollment()
  }, [id])

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${id}`)
      setCourse(response.data.course)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch course:', error)
      setLoading(false)
    }
  }

  const checkEnrollment = async () => {
    try {
      const response = await api.get('/courses/my-enrollments')
      const enrolled = response.data.enrollments.find((e) => e.course_id === parseInt(id))
      setEnrollment(enrolled || null)
    } catch (error) {
      console.error('Failed to check enrollment:', error)
    }
  }

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await api.post(`/courses/${id}/enroll`)
      await checkEnrollment()
      alert('Successfully enrolled in the course!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to enroll in course')
    }
    setEnrolling(false)
  }

  const handleStartCourse = () => {
    navigate(`/learner/courses/${id}/player`)
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

  if (!course) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        </div>
      </Layout>
    )
  }

  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header with Title and Enroll Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 text-sm">
              Learn the fundamentals and build amazing applications
            </p>
          </div>
          {!enrollment && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
          {enrollment && (
            <button
              onClick={handleStartCourse}
              className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <PlayCircle size={20} />
              Continue Learning
            </button>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Course Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Image */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-blue-600 h-64 flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen size={64} className="mx-auto mb-4 opacity-90" />
                  <h2 className="text-2xl font-bold">{course.title}</h2>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <div className="flex gap-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('instructor')}
                    className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                      activeTab === 'instructor'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Instructor
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                      activeTab === 'reviews'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Reviews
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* About this course */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About this course</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{course.description}</p>
                      <p className="text-gray-600 leading-relaxed">
                        This comprehensive course covers everything from the basics to advanced concepts.
                        You'll learn by doing, with hands-on projects and real-world examples throughout the curriculum.
                      </p>
                    </div>

                    {/* Key concepts */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Key concepts</h3>
                      <ul className="space-y-2">
                        {course.learning_objectives && course.learning_objectives.length > 0 ? (
                          course.learning_objectives.map((objective, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                              <span className="text-gray-700">{objective}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start">
                              <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                              <span className="text-gray-700">Understand core concepts and fundamentals</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                              <span className="text-gray-700">Build reusable components efficiently</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                              <span className="text-gray-700">Manage complex state effectively</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                              <span className="text-gray-700">Deploy a React app to production</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About the Instructor</h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${course.supervisor_name}&size=80&background=2563EB&color=fff`}
                        alt={course.supervisor_name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{course.supervisor_name}</h4>
                        <p className="text-gray-600 text-sm mb-3">Course Instructor & Expert</p>
                        <p className="text-gray-600 leading-relaxed">
                          An experienced instructor with years of industry experience. Passionate about
                          teaching and helping students achieve their learning goals.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h3>
                    <ReviewsSection courseId={id} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Instructor Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${course.supervisor_name}&size=60&background=2563EB&color=fff`}
                  alt={course.supervisor_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{course.supervisor_name}</h4>
                  <p className="text-sm text-gray-600">Course Instructor</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Expert in {course.category} with years of teaching experience
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <Mail size={16} />
                Contact Instructor
              </button>
            </div>

            {/* Certificate Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Certificate</h3>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 mb-4">
                <Award className="text-yellow-600 mx-auto mb-2" size={32} />
                <p className="text-center text-sm text-gray-700">
                  Earn a certificate upon completion
                </p>
              </div>
              <p className="text-xs text-gray-600 text-center">
                Share your certificate with your network to showcase your achievement
              </p>
            </div>

            {/* Course Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-medium text-gray-900">{course.duration} hours</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Modules</span>
                  <span className="text-sm font-medium text-gray-900">{course.total_modules} modules</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Level</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${difficultyColors[course.difficulty]}`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium text-gray-900">{course.category}</span>
                </div>
              </div>
            </div>

            {/* Explore More Button */}
            <button
              onClick={() => navigate('/learner/courses')}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Explore 5 More Course
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CourseDetailPage
