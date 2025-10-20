import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { Building2, MapPin, Globe, Users, Briefcase, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react'

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    company_name: '',
    industry: '',
    description: '',
    website: '',
    location: '',
    size: '',
    name: '',
    email: '',
    profile_picture: ''
  })
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/companies/profile')
      setProfile(response.data.profile)
      setFormData(response.data.profile)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/companies/profile', formData)
      setProfile(formData)
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setEditing(false)
  }

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '501-1000 employees',
    '1000+ employees'
  ]

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Marketing',
    'Other'
  ]

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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h1>
            <p className="text-gray-600">Manage your company information</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 flex items-center gap-2 disabled:bg-gray-300"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Company Logo and Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    alt={formData.company_name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Building2 className="text-primary-600" size={40} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{profile.company_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{profile.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} />
                    Industry
                  </div>
                </label>
                {editing ? (
                  <select
                    name="industry"
                    value={formData.industry || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.industry || 'Not specified'}</p>
                )}
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    Company Size
                  </div>
                </label>
                {editing ? (
                  <select
                    name="size"
                    value={formData.size || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Size</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{profile.size || 'Not specified'}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    Location
                  </div>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.location || 'Not specified'}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    Website
                  </div>
                </label>
                {editing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {profile.website || 'Not specified'}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Company</h3>
            {editing ? (
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us about your company..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.description || 'No description provided yet.'}
              </p>
            )}
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-gray-900">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CompanyProfile
