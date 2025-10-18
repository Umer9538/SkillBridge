import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import {
  Award,
  Download,
  Star,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Eye,
  EyeOff
} from 'lucide-react'

const PortfolioPage = () => {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [privacy, setPrivacy] = useState('public')

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const [portfolioRes, certsRes, profileRes] = await Promise.all([
        api.get('/learners/portfolio'),
        api.get('/learners/certificates'),
        api.get('/learners/profile')
      ])

      setPortfolio(portfolioRes.data.portfolio)
      setCertificates(certsRes.data.certificates)
      setPrivacy(profileRes.data.profile.portfolio_privacy || 'public')
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch portfolio:', error)
      setLoading(false)
    }
  }

  const togglePrivacy = async () => {
    const newPrivacy = privacy === 'public' ? 'private' : 'public'
    try {
      await api.put('/learners/profile', { portfolio_privacy: newPrivacy })
      setPrivacy(newPrivacy)
    } catch (error) {
      alert('Failed to update privacy setting')
    }
  }

  const exportPDF = () => {
    alert('PDF export feature coming soon! This will generate a professional PDF of your portfolio.')
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

  const profile = portfolio?.profile || {}
  const completedTasks = portfolio?.completed_tasks || []
  const skills = profile.skills || []

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
            <p className="text-gray-600">Showcase your skills and achievements</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={togglePrivacy}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {privacy === 'public' ? <Eye size={20} /> : <EyeOff size={20} />}
              {privacy === 'public' ? 'Public' : 'Private'}
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-600"
            >
              <Download size={20} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-start gap-6 mb-6">
            <img
              src={user?.profile_picture || `https://ui-avatars.com/api/?name=${user?.name}&size=128&background=2563EB&color=fff`}
              alt={user?.name}
              className="w-32 h-32 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              {profile.bio && <p className="text-gray-600 mb-4">{profile.bio}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{user?.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={18} />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <Briefcase className="text-primary" size={32} />
              <span className="text-3xl font-bold text-gray-900">
                {portfolio?.total_completed || 0}
              </span>
            </div>
            <p className="text-gray-600">Tasks Completed</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <Award className="text-green-600" size={32} />
              <span className="text-3xl font-bold text-gray-900">{certificates.length}</span>
            </div>
            <p className="text-gray-600">Certificates Earned</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-3">
              <Star className="text-yellow-500" size={32} />
              <span className="text-3xl font-bold text-gray-900">{skills.length}</span>
            </div>
            <p className="text-gray-600">Skills Mastered</p>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Completed Projects</h3>
          {completedTasks.length > 0 ? (
            <div className="space-y-6">
              {completedTasks.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{app.task_title}</h4>
                      {app.submission_url && (
                        <a
                          href={app.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline mb-3"
                        >
                          <LinkIcon size={16} />
                          View Project
                        </a>
                      )}
                      {app.submission_notes && (
                        <p className="text-gray-600 text-sm mb-3">{app.submission_notes}</p>
                      )}
                    </div>
                    {app.evaluation && (
                      <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                        <Star className="text-yellow-500" size={20} />
                        <span className="text-lg font-bold text-gray-900">
                          {app.evaluation.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-600">/5.0</span>
                      </div>
                    )}
                  </div>

                  {app.evaluation && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {app.evaluation.feedback && (
                        <p className="text-gray-700 text-sm mb-2">
                          <strong>Feedback:</strong> {app.evaluation.feedback}
                        </p>
                      )}
                      {app.evaluation.strengths && (
                        <p className="text-gray-700 text-sm">
                          <strong>Strengths:</strong> {app.evaluation.strengths}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No completed projects yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete tasks to showcase your work here
              </p>
            </div>
          )}
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Certificates</h3>
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <GraduationCap className="text-green-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1">{cert.course_title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Issued on {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                        {cert.verification_code}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No certificates earned yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete courses to earn certificates
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default PortfolioPage
