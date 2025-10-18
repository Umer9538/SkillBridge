import { useEffect } from 'react'
import Layout from '../../components/common/Layout'
import { useNotifications } from '../../contexts/NotificationContext'
import { Bell, CheckCheck, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id)
    }
    if (notification.link) {
      window.location.href = notification.link
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      system: '🔔',
      course: '📚',
      task: '💼',
      evaluation: '⭐',
      certificate: '🏆',
      message: '💬'
    }
    return icons[type] || '🔔'
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadNotifications.length} unread notification
              {unreadNotifications.length !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadNotifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary-50 rounded-lg transition-colors"
            >
              <CheckCheck size={20} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Unread</h2>
            <div className="space-y-3">
              {unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="bg-primary-50 border border-primary-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true
                          })}
                        </span>
                        {notification.link && (
                          <ExternalLink size={16} className="text-primary" />
                        )}
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Earlier</h2>
            <div className="space-y-3">
              {readNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl opacity-50">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true
                          })}
                        </span>
                        {notification.link && (
                          <ExternalLink size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              We'll notify you when there's something new
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default NotificationsPage
