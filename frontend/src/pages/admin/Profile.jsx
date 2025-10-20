import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Shield, Lock } from 'lucide-react'

const AdminProfile = () => {
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    profile_picture: '',
    created_at: ''
  })
  const [formData, setFormData] = useState({})
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/profile')
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/admin/profile', formData)
      setProfile(formData)
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match!')
      return
    }

    if (passwordData.new_password.length < 6) {
      alert('Password must be at least 6 characters long!')
      return
    }

    try {
      await api.put('/admin/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      })
      alert('Password changed successfully!')
      setChangingPassword(false)
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change password')
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setEditing(false)
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
            <p className="text-gray-600">Manage your administrator account settings</p>
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
          {/* Profile Picture and Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    alt={formData.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <User className="text-white" size={40} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
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
                    <p className="text-2xl font-bold text-gray-900">{profile.name}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    <Shield size={14} />
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            {editing ? (
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || 'No bio provided yet.'}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </div>
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="e.g., +1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile.phone || 'Not specified'}</p>
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
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={20} />
              Security
            </h3>

            {!changingPassword ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-600">Last changed: Never</p>
                  </div>
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChangingPassword(false)
                      setPasswordData({
                        current_password: '',
                        new_password: '',
                        confirm_password: ''
                      })
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Account Created</p>
                  <p className="text-gray-900">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-gray-400" size={18} />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-gray-900 font-semibold">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminProfile
