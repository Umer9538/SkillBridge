import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { UserPlus } from 'lucide-react'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner',
    company_name: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)

    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">SkillBridge</h1>
          <p className="text-gray-600">Bridge the Gap Between Learning and Practice</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to join as...
            </label>
            <div className="space-y-2">
              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'learner' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                <input
                  type="radio"
                  name="role"
                  value="learner"
                  checked={formData.role === 'learner'}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-semibold text-gray-900">Learner</div>
                  <div className="text-sm text-gray-600">Learn new skills, enroll in courses, and apply for real-world tasks</div>
                </div>
              </label>

              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'company' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                <input
                  type="radio"
                  name="role"
                  value="company"
                  checked={formData.role === 'company'}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-semibold text-gray-900">Company</div>
                  <div className="text-sm text-gray-600">Post tasks and hire talented learners for your projects</div>
                </div>
              </label>

              <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'supervisor' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                <input
                  type="radio"
                  name="role"
                  value="supervisor"
                  checked={formData.role === 'supervisor'}
                  onChange={handleChange}
                  className="mt-1 mr-3"
                />
                <div>
                  <div className="font-semibold text-gray-900">Supervisor</div>
                  <div className="text-sm text-gray-600">Create and manage courses, add learning content and modules</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {formData.role === 'company' ? 'Contact Name' : 'Full Name'}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          {formData.role === 'company' && (
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Acme Inc."
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Min. 6 characters"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus size={20} className="mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
