import { useState, useEffect } from 'react'
import api from '../../utils/api'
import { Star, ThumbsUp, Edit, Trash2 } from 'lucide-react'

const ReviewsSection = ({ courseId }) => {
  const [reviews, setReviews] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [userReview, setUserReview] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [courseId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/api/courses/${courseId}/reviews`)
      setReviews(response.data.reviews)
      setStatistics(response.data.statistics)

      // Check if current user has already reviewed
      const currentUserId = localStorage.getItem('userId')
      const existingReview = response.data.reviews.find(
        r => r.user_id === parseInt(currentUserId)
      )
      setUserReview(existingReview)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      await api.post(`/api/courses/${courseId}/reviews`, {
        rating,
        review_text: reviewText
      })

      setRating(0)
      setReviewText('')
      setShowReviewForm(false)
      fetchReviews()
      alert('Review submitted successfully!')
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      await api.delete(`/api/courses/${courseId}/reviews/${reviewId}`)
      fetchReviews()
      alert('Review deleted successfully')
    } catch (error) {
      alert('Failed to delete review')
    }
  }

  const renderStars = (count, interactive = false, size = 20) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1
      return (
        <Star
          key={index}
          size={size}
          className={`${
            interactive ? 'cursor-pointer' : ''
          } ${
            starValue <= (interactive ? (hoverRating || rating) : count)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={() => interactive && setRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      )
    })
  }

  const getRatingPercentage = (ratingValue) => {
    if (!statistics || statistics.total_reviews === 0) return 0
    return (statistics.rating_distribution[ratingValue] / statistics.total_reviews) * 100
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-gray-500">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {statistics?.average_rating?.toFixed(1) || '0.0'}
          </div>
          <div className="flex mb-2">{renderStars(Math.round(statistics?.average_rating || 0))}</div>
          <div className="text-sm text-gray-600">
            {statistics?.total_reviews || 0} {statistics?.total_reviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((ratingValue) => (
            <div key={ratingValue} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm text-gray-700">{ratingValue}</span>
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${getRatingPercentage(ratingValue)}%` }}
                />
              </div>
              <div className="w-12 text-right text-sm text-gray-600">
                {statistics?.rating_distribution[ratingValue] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {!userReview && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && !userReview && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex gap-1">{renderStars(rating, true, 32)}</div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Share your experience with this course..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false)
                setRating(0)
                setReviewText('')
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* User's Review */}
      {userReview && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-gray-900">Your Review</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">{renderStars(userReview.rating, false, 16)}</div>
                <span className="text-sm text-gray-600">
                  {new Date(userReview.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDeleteReview(userReview.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Delete review"
            >
              <Trash2 size={18} />
            </button>
          </div>
          {userReview.review_text && (
            <p className="text-gray-700">{userReview.review_text}</p>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">
          All Reviews ({statistics?.total_reviews || 0})
        </h4>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to review this course</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {review.user_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.user_name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating, false, 14)}</div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {review.review_text && (
                <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewsSection
