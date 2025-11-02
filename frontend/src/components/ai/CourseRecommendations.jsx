import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { BookOpen, Star, Clock, TrendingUp, Award, Sparkles } from 'lucide-react'

const CourseRecommendations = ({ limit = 5 }) => {
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await api.get(`/ai/course-recommendations?limit=${limit}`)
      setRecommendations(response.data.recommendations || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <BookOpen className="mx-auto text-gray-400 mb-3" size={48} />
        <p className="text-gray-600">No recommendations available yet.</p>
        <p className="text-sm text-gray-500 mt-1">Complete more courses to get personalized recommendations!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-purple-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">AI-Powered Recommendations</h3>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Link
            key={rec.course_id}
            to={`/learner/courses/${rec.course_id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 border border-gray-200 hover:border-primary-300"
          >
            <div className="flex gap-4">
              {/* Thumbnail */}
              {rec.thumbnail ? (
                <img
                  src={rec.thumbnail}
                  alt={rec.title}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-primary-600" size={32} />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-lg line-clamp-1">
                    {rec.title}
                  </h4>
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex-shrink-0">
                    <TrendingUp size={14} />
                    {rec.recommendation_score}% match
                  </div>
                </div>

                {/* Meta information */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {rec.category}
                  </span>
                  <span className="capitalize">{rec.difficulty}</span>
                  {rec.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500 fill-yellow-500" size={14} />
                      <span>{rec.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Reasons */}
                {rec.reasons && rec.reasons.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {rec.reasons.map((reason, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center gap-1"
                      >
                        <Award size={12} className="text-primary" />
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default CourseRecommendations
