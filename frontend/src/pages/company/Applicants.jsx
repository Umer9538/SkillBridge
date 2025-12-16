import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { Eye, Check, X, Users, Filter, MoreVertical, PlayCircle, CheckCircle, RotateCcw } from 'lucide-react'
import { format } from 'date-fns'

const ApplicantsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('all')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all')
  const [tasks, setTasks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative')) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const fetchData = async () => {
    try {
      const [applicationsRes, tasksRes] = await Promise.all([
        api.get('/companies/applications'),
        api.get('/tasks/my')
      ])
      setApplications(applicationsRes.data.applications || [])
      setTasks(tasksRes.data.tasks || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  const handleAccept = async (applicationId) => {
    if (!confirm('Accept this application?')) return

    try {
      await api.put(`/companies/applications/${applicationId}/accept`)
      alert('Application accepted successfully!')
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept application')
    }
  }

  const handleReject = async (applicationId) => {
    if (!confirm('Reject this application?')) return

    try {
      await api.put(`/companies/applications/${applicationId}/reject`)
      alert('Application rejected')
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject application')
    }
  }

  const handleStatusChange = async (applicationId, newStatus) => {
    const statusLabels = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      in_progress: 'In Progress',
      submitted: 'Submitted',
      completed: 'Completed'
    }

    if (!confirm(`Change status to "${statusLabels[newStatus]}"?`)) return

    try {
      await api.put(`/companies/applications/${applicationId}/status`, { status: newStatus })
      alert(`Status updated to ${statusLabels[newStatus]}`)
      setOpenDropdown(null)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status')
    }
  }

  const getAvailableStatusOptions = (currentStatus) => {
    // Define what status transitions are allowed
    const statusOptions = {
      pending: ['accepted', 'rejected'],
      accepted: ['in_progress', 'completed', 'rejected', 'pending'],
      in_progress: ['submitted', 'completed', 'accepted'],
      submitted: ['completed', 'in_progress', 'rejected'],
      completed: ['in_progress'],
      rejected: ['pending', 'accepted']
    }
    return statusOptions[currentStatus] || []
  }

  const handleViewDetails = (application) => {
    setSelectedApplication(application)
    setShowModal(true)
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

  // Filter applications
  let filteredApplications = applications

  if (selectedTaskFilter !== 'all') {
    filteredApplications = filteredApplications.filter(app => app.task_id === parseInt(selectedTaskFilter))
  }

  if (selectedStatusFilter !== 'all') {
    filteredApplications = filteredApplications.filter(app => app.status === selectedStatusFilter)
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Applicants</h1>
          <p className="text-gray-600">Review and manage applications for your tasks</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task</label>
              <select
                value={selectedTaskFilter}
                onChange={(e) => setSelectedTaskFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Tasks</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in_progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Applied</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option>All Dates</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-lg shadow">
          {filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://ui-avatars.com/api/?name=${app.learner_name}&size=40&background=2563EB&color=fff`}
                            alt={app.learner_name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{app.learner_name}</div>
                            <div className="text-xs text-gray-500">{app.learner_email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.task_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(app.applied_at), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(app)}
                            className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {app.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAccept(app.id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Accept"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(app.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                          {/* Status change dropdown for non-pending statuses */}
                          {app.status !== 'pending' && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenDropdown(openDropdown === app.id ? null : app.id)}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Change Status"
                              >
                                <MoreVertical size={18} />
                              </button>
                              {openDropdown === app.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                  <div className="py-1">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                                      Change Status To
                                    </div>
                                    {getAvailableStatusOptions(app.status).map((status) => (
                                      <button
                                        key={status}
                                        onClick={() => handleStatusChange(app.id, status)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        {status === 'accepted' && <Check size={14} className="text-green-600" />}
                                        {status === 'rejected' && <X size={14} className="text-red-600" />}
                                        {status === 'pending' && <RotateCcw size={14} className="text-yellow-600" />}
                                        {status === 'in_progress' && <PlayCircle size={14} className="text-purple-600" />}
                                        {status === 'completed' && <CheckCircle size={14} className="text-green-600" />}
                                        {status === 'submitted' && <Check size={14} className="text-indigo-600" />}
                                        <span className="capitalize">{status.replace('_', ' ')}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications yet</h3>
              <p className="text-gray-600">
                Applications will appear here when learners apply to your tasks
              </p>
            </div>
          )}
        </div>

        {/* Application Details Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Details</h2>

                <div className="space-y-6">
                  {/* Applicant Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={`https://ui-avatars.com/api/?name=${selectedApplication.learner_name}&size=60&background=2563EB&color=fff`}
                        alt={selectedApplication.learner_name}
                        className="w-15 h-15 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{selectedApplication.learner_name}</p>
                        <p className="text-sm text-gray-600">{selectedApplication.learner_email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Task Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Task</h3>
                    <p className="text-gray-700">{selectedApplication.task_title}</p>
                  </div>

                  {/* Cover Letter */}
                  {selectedApplication.cover_letter && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter</h3>
                      <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {selectedApplication.cover_letter}
                      </p>
                    </div>
                  )}

                  {/* Submission */}
                  {selectedApplication.submission_url && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Submission</h3>
                      <a
                        href={selectedApplication.submission_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {selectedApplication.submission_url}
                      </a>
                      {selectedApplication.submission_notes && (
                        <p className="text-gray-700 mt-2">{selectedApplication.submission_notes}</p>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
                    <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-6 border-t">
                  {/* Status change options */}
                  {getAvailableStatusOptions(selectedApplication.status).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Change Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {getAvailableStatusOptions(selectedApplication.status).map((status) => {
                          const buttonStyles = {
                            accepted: 'bg-green-100 text-green-700 hover:bg-green-200',
                            rejected: 'bg-red-100 text-red-700 hover:bg-red-200',
                            pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
                            in_progress: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
                            submitted: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
                            completed: 'bg-green-100 text-green-700 hover:bg-green-200'
                          }
                          return (
                            <button
                              key={status}
                              onClick={() => {
                                handleStatusChange(selectedApplication.id, status)
                                setShowModal(false)
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${buttonStyles[status]}`}
                            >
                              {status === 'accepted' && <Check size={16} />}
                              {status === 'rejected' && <X size={16} />}
                              {status === 'pending' && <RotateCcw size={16} />}
                              {status === 'in_progress' && <PlayCircle size={16} />}
                              {status === 'completed' && <CheckCircle size={16} />}
                              {status === 'submitted' && <Check size={16} />}
                              <span className="capitalize">{status.replace('_', ' ')}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ApplicantsPage
