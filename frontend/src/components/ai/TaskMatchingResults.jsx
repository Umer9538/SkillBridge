import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { Users, Award, TrendingUp, Mail, Sparkles, CheckCircle } from 'lucide-react'

const TaskMatchingResults = ({ taskId }) => {
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState([])
  const [taskTitle, setTaskTitle] = useState('')

  useEffect(() => {
    if (taskId) {
      fetchMatches()
    }
  }, [taskId])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/ai/task-matches/${taskId}`)
      setMatches(response.data.matches || [])
      setTaskTitle(response.data.task_title)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch matches:', error)
      setLoading(false)
    }
  }

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getMatchLabel = (score) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Potential Match'
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
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-purple-600" size={24} />
          <h3 className="text-2xl font-bold text-gray-900">AI-Powered Learner Matches</h3>
        </div>
        <p className="text-gray-600">
          Top candidates for: <span className="font-semibold">{taskTitle}</span>
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No matching learners found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div
              key={match.learner_id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    #{index + 1}
                  </div>
                </div>

                {/* Learner Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{match.learner_name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail size={14} />
                        {match.learner_email}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${getMatchColor(match.match_score)}`}>
                        <TrendingUp size={18} />
                        {match.match_score}%
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{getMatchLabel(match.match_score)}</p>
                    </div>
                  </div>

                  {/* Matched Skills */}
                  {match.matched_skills && match.matched_skills.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Matching Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {match.matched_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="text-blue-600" size={16} />
                      <span className="text-gray-700">
                        <span className="font-semibold">{match.completed_tasks}</span> tasks completed
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => window.location.href = `mailto:${match.learner_email}`}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                    >
                      Contact Learner
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskMatchingResults
