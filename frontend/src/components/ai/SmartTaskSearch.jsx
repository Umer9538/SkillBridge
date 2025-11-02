import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { Briefcase, TrendingUp, Clock, Calendar, Sparkles, Building } from 'lucide-react'
import { format } from 'date-fns'

const SmartTaskSearch = () => {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetchSmartTasks()
  }, [])

  const fetchSmartTasks = async () => {
    try {
      const response = await api.get('/ai/smart-search/tasks')
      setTasks(response.data.tasks || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch smart task matches:', error)
      setLoading(false)
    }
  }

  const getMatchColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700'
    if (score >= 60) return 'bg-blue-100 text-blue-700'
    if (score >= 40) return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700'
      case 'advanced':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-purple-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-900">Tasks Matched to Your Skills</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Briefcase className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No matching tasks found</p>
          <p className="text-sm text-gray-500 mt-1">Complete more courses to unlock task recommendations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/learner/tasks/${task.id}`}
                      className="text-xl font-bold text-gray-900 hover:text-primary"
                    >
                      {task.title}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getMatchColor(task.match_score)}`}>
                      <TrendingUp size={14} />
                      {task.match_score}% match
                    </span>
                  </div>

                  {task.company_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Building size={16} />
                      {task.company_name}
                    </div>
                  )}

                  <p className="text-gray-700 line-clamp-2 mb-4">{task.description}</p>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {task.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </span>
                    {task.estimated_hours && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock size={16} />
                        <span>{task.estimated_hours} hours</span>
                      </div>
                    )}
                    {task.deadline && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={16} />
                        <span>Due {format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills Required */}
                  {task.skills_required && task.skills_required.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.skills_required.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-3">
                <Link
                  to={`/learner/tasks/${task.id}`}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                  View Details & Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SmartTaskSearch
