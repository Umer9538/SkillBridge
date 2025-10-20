import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { Settings, Bell, Mail, Shield, Database, Globe, Save, AlertCircle } from 'lucide-react'

const SystemSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [settings, setSettings] = useState({
    platform_name: 'SkillBridge',
    platform_email: 'admin@skillbridge.com',
    allow_registration: true,
    require_email_verification: false,
    max_upload_size: 10,
    notification_email: true,
    notification_sms: false,
    maintenance_mode: false,
    terms_url: '',
    privacy_url: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/settings')
      setSettings(response.data.settings || settings)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/admin/settings', settings)
      alert('Settings updated successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const sections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database }
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
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{section.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {/* General Settings */}
              {activeSection === 'general' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Name
                      </label>
                      <input
                        type="text"
                        name="platform_name"
                        value={settings.platform_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">The name displayed across the platform</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Email
                      </label>
                      <input
                        type="email"
                        name="platform_email"
                        value={settings.platform_email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Default email address for system notifications</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Terms of Service URL
                      </label>
                      <input
                        type="url"
                        name="terms_url"
                        value={settings.terms_url}
                        onChange={handleChange}
                        placeholder="https://example.com/terms"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Privacy Policy URL
                      </label>
                      <input
                        type="url"
                        name="privacy_url"
                        value={settings.privacy_url}
                        onChange={handleChange}
                        placeholder="https://example.com/privacy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notification_email"
                          checked={settings.notification_email}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Send notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notification_sms"
                          checked={settings.notification_sms}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeSection === 'email' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Configuration</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Email Configuration</p>
                          <p className="text-xs text-blue-700 mt-1">
                            Email settings are configured via environment variables. Contact your system administrator to update SMTP settings.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value="noreply@skillbridge.com"
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value="SkillBridge"
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Allow User Registration</p>
                        <p className="text-sm text-gray-600">Allow new users to register on the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="allow_registration"
                          checked={settings.allow_registration}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Require Email Verification</p>
                        <p className="text-sm text-gray-600">Users must verify their email before accessing the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="require_email_verification"
                          checked={settings.require_email_verification}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeSection === 'system' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Upload Size (MB)
                      </label>
                      <input
                        type="number"
                        name="max_upload_size"
                        value={settings.max_upload_size}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum file size for uploads</p>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <p className="font-medium text-red-900">Maintenance Mode</p>
                        <p className="text-sm text-red-700">Disable platform access for maintenance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="maintenance_mode"
                          checked={settings.maintenance_mode}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    {settings.maintenance_mode && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                          <div>
                            <p className="text-sm font-medium text-yellow-900">Warning</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              Maintenance mode is enabled. Users will not be able to access the platform.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 font-medium flex items-center gap-2 disabled:bg-gray-300"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SystemSettings
