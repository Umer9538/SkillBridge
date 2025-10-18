import { Link } from 'react-router-dom'
import { Clock, BarChart, BookOpen, User } from 'lucide-react'
import Card from '../common/Card'

const CourseCard = ({ course }) => {
  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }

  return (
    <Link to={`/learner/courses/${course.id}`}>
      <Card hover className="p-6 h-full">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700 mb-2">
              {course.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                <span>{course.duration}h</span>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  difficultyColors[course.difficulty] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {course.difficulty}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span>{course.supervisor_name}</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={16} className="mr-1" />
                <span>{course.total_modules} modules</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default CourseCard
