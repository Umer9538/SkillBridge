import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { Clock, CheckCircle, XCircle, Upload, Send, Star, Briefcase } from 'lucide-react'
import { format } from 'date-fns'

const MyApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('all')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [submissionData, setSubmissionData] = useState({
    submission_url: '',
    submission_notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await api.get('/tasks/applications/my')
      setApplications(response.data.applications)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      setLoading(false)
    }
  }

  const handleSubmitWork = (app) => {
    setSelectedApp(app)
    setShowSubmitModal(true)
    setSubmissionData({ submission_url: '', submission_notes: '' })
  }

  const submitWork = async () => {
    if (!submissionData.submission_url.trim()) {
      alert('Please provide a submission URL')
      return
    }

    setSubmitting(true)
    try {
      await api.put(`/tasks/applications/${selectedApp.id}/submit`, submissionData)
      alert('Work submitted successfully!')
      setShowSubmitModal(false)
      fetchApplications()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit work')
    }
    setSubmitting(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      in_progress: 'bg-purple-100 text-purple-800',
      submitted: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />
      case 'accepted':
      case 'completed':
        return <CheckCircle size={16} />
      case 'rejected':
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const filteredApplications = applications.filter(app => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'active') return ['pending', 'accepted', 'in_progress', 'submitted'].includes(app.status)
    if (selectedTab === 'completed') return app.status === 'completed'
    return true
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your task applications and submissions</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setSelectedTab('all')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                selectedTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Applications ({applications.length})
            </button>
            <button
              onClick={() => setSelectedTab('active')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                selectedTab === 'active'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active ({applications.filter(a => ['pending', 'accepted', 'in_progress', 'submitted'].includes(a.status)).length})
            </button>
            <button
              onClick={() => setSelectedTab('completed')}
              className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                selectedTab === 'completed'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed ({applications.filter(a => a.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {app.task_title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Applied on {format(new Date(app.applied_at), 'MMM dd, yyyy')}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {(app.status === 'accepted' || app.status === 'in_progress') && (
                    <button
                      onClick={() => handleSubmitWork(app)}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <Upload size={16} />
                      Submit Work
                    </button>
                  )}
                </div>

                {/* Cover Letter */}
                {app.cover_letter && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">
                      {app.cover_letter}
                    </p>
                  </div>
                )}

                {/* Submission Details */}
                {app.submission_url && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Submission</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>URL:</strong>{' '}
                        <a
                          href={app.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {app.submission_url}
                        </a>
                      </p>
                      {app.submission_notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Notes:</strong> {app.submission_notes}
                        </p>
                      )}
                      {app.submitted_at && (
                        <p className="text-sm text-gray-500 mt-2">
                          Submitted on {format(new Date(app.submitted_at), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Evaluation */}
                {app.evaluation && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="text-yellow-500" size={20} />
                      Evaluation
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          {app.evaluation.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-600">/ 5.0</span>
                      </div>
                      {app.evaluation.feedback && (
                        <p className="text-gray-700 text-sm mb-2">
                          <strong>Feedback:</strong> {app.evaluation.feedback}
                        </p>
                      )}
                      {app.evaluation.strengths && (
                        <p className="text-gray-700 text-sm mb-2">
                          <strong>Strengths:</strong> {app.evaluation.strengths}
                        </p>
                      )}
                      {app.evaluation.improvements && (
                        <p className="text-gray-700 text-sm">
                          <strong>Areas for Improvement:</strong> {app.evaluation.improvements}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start applying to tasks to build your experience
            </p>
            <button
              onClick={() => (window.location.href = '/learner/tasks')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-600"
            >
              Browse Tasks
            </button>
          </div>
        )}

        {/* Submit Work Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Work</h2>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {selectedApp.task_title}
                  </h3>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={submissionData.submission_url}
                    onChange={(e) =>
                      setSubmissionData({ ...submissionData, submission_url: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://github.com/yourproject or https://drive.google.com/..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Link to your GitHub repository, Google Drive, or deployed project
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={submissionData.submission_notes}
                    onChange={(e) =>
                      setSubmissionData({ ...submissionData, submission_notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Add any additional information about your submission..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitWork}
                    disabled={submitting || !submissionData.submission_url.trim()}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                  >
                    <Send size={16} />
                    {submitting ? 'Submitting...' : 'Submit Work'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default MyApplications