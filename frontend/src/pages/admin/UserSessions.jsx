import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { Users, LogIn, Eye, Copy, CheckCircle } from 'lucide-react'

const UserSessions = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedEmail, setCopiedEmail] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data.users || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setLoading(false)
    }
  }

  const handleImpersonate = async (userId) => {
    try {
      const response = await api.post(`/admin/impersonate/${userId}`)

      // Store the impersonation token
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to the user's dashboard
      const role = response.data.user.role
      const dashboardPaths = {
        'learner': '/learner/home',
        'company': '/company/home',
        'supervisor': '/supervisor/home',
        'admin': '/admin/home'
      }

      // Reload to update auth context
      window.location.href = dashboardPaths[role] || '/login'
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to impersonate user')
    }
  }

  const copyToClipboard = (text, email) => {
    navigator.clipboard.writeText(text)
    setCopiedEmail(email)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      'admin': 'bg-red-100 text-red-700',
      'supervisor': 'bg-purple-100 text-purple-700',
      'company': 'bg-blue-100 text-blue-700',
      'learner': 'bg-green-100 text-green-700'
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Sessions & Testing</h1>
          <p className="text-gray-600">View and test user accounts across all roles</p>
        </div>

        {/* Test Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Quick Test Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: 'Admin', email: 'admin@test.com', password: 'admin123' },
              { role: 'Learner', email: 'learner@test.com', password: 'learner123' },
              { role: 'Company', email: 'company@test.com', password: 'company123' },
              { role: 'Supervisor', email: 'supervisor@test.com', password: 'supervisor123' }
            ].map((cred) => (
              <div key={cred.role} className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="font-semibold text-gray-900 mb-2">{cred.role}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">Email:</p>
                    <button
                      onClick={() => copyToClipboard(cred.email, cred.email)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {copiedEmail === cred.email ? (
                        <><CheckCircle size={12} /> Copied</>
                      ) : (
                        <><Copy size={12} /> Copy</>
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-mono text-gray-800">{cred.email}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600">Password:</p>
                    <button
                      onClick={() => copyToClipboard(cred.password, cred.password)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {copiedEmail === cred.password ? (
                        <><CheckCircle size={12} /> Copied</>
                      ) : (
                        <><Copy size={12} /> Copy</>
                      )}
                    </button>
                  </div>
                  <p className="text-sm font-mono text-gray-800">{cred.password}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-700 mt-4">
            💡 Tip: Use "Impersonate" to instantly switch to any user account without logging out.
          </p>
        </div>

        {/* All Users Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users size={24} />
              All User Accounts
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{user.email}</span>
                        <button
                          onClick={() => copyToClipboard(user.email, `email-${user.id}`)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copiedEmail === `email-${user.id}` ? (
                            <CheckCircle size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_active ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleImpersonate(user.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          <LogIn size={16} />
                          Impersonate
                        </button>
                        <button
                          onClick={() => navigate(`/admin/users?view=${user.id}`)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">How to Test Different User Roles:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Click "Impersonate" to instantly switch to that user's account</li>
            <li>You'll be redirected to their dashboard with their permissions</li>
            <li>Test all features available to that role</li>
            <li>To switch back, logout and login as admin again</li>
            <li>Or use the impersonate feature to switch to another user</li>
          </ol>
        </div>
      </div>
    </Layout>
  )
}

export default UserSessions
