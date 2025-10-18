import { Link } from 'react-router-dom'
import { Building2, Clock, Calendar, Award } from 'lucide-react'
import Card from '../common/Card'
import { format } from 'date-fns'

const TaskCard = ({ task, onApply }) => {
  const difficultyColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }

  return (
    <Card hover className="p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
              {task.category}
            </span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                difficultyColors[task.difficulty] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {task.difficulty}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{task.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{task.description}</p>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Building2 size={16} className="mr-1" />
            <span>{task.company_name}</span>
          </div>

          {/* Skills */}
          {task.skills_required && task.skills_required.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {task.skills_required.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
              {task.skills_required.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{task.skills_required.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            {task.estimated_hours && (
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{task.estimated_hours}h</span>
              </div>
            )}
            {task.deadline && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{format(new Date(task.deadline), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onApply && onApply(task)}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Apply Now
          </button>
        </div>
      </div>
    </Card>
  )
}

export default TaskCard