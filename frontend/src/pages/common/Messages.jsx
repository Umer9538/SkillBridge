import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import api from '../../utils/api'
import { MessageSquare, Send, Search, X } from 'lucide-react'

const MessagesPage = () => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await api.get('/messages/conversations')
      setConversations(response.data.conversations)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConversation = async (userId) => {
    try {
      const response = await api.get(`/messages/conversations/${userId}`)
      setSelectedConversation(response.data.conversation)
      setMessages(response.data.conversation.messages)

      // Update unread count in conversations list
      setConversations(prev =>
        prev.map(conv =>
          conv.user_id === userId
            ? { ...conv, unread_count: 0 }
            : conv
        )
      )
    } catch (error) {
      console.error('Failed to fetch conversation:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    try {
      setSending(true)
      const response = await api.post('/messages', {
        receiver_id: selectedConversation.user_id,
        content: newMessage
      })

      // Add new message to the list
      setMessages(prev => [...prev, response.data.data])
      setNewMessage('')

      // Update conversation list with new message
      fetchConversations()
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    // Less than 24 hours ago
    if (diff < 86400000) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }

    // Less than 7 days ago
    if (diff < 604800000) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    }

    // Older
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="bg-white rounded-lg shadow h-[calc(100vh-12rem)] flex flex-col lg:flex-row">
          {/* Conversations List */}
          <div className={`${selectedConversation ? 'hidden' : 'flex'} lg:flex w-full lg:w-1/3 flex-col border-r border-gray-200`}>
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Loading conversations...</div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageSquare size={48} className="mb-2 text-gray-300" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.user_id}
                    onClick={() => fetchConversation(conv.user_id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.user_id === conv.user_id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {conv.user_profile_picture ? (
                          <img
                            src={conv.user_profile_picture}
                            alt={conv.user_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-lg">
                              {conv.user_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {conv.user_name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conv.last_message.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conv.last_message.content}
                          </p>
                          {conv.unread_count > 0 && (
                            <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-primary-500 rounded-full">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">{conv.user_role}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className={`${selectedConversation ? 'flex' : 'hidden'} lg:flex flex-1 flex-col h-full`}>
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {selectedConversation.user_profile_picture ? (
                      <img
                        src={selectedConversation.user_profile_picture}
                        alt={selectedConversation.user_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-semibold">
                          {selectedConversation.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedConversation.user_name}
                      </h2>
                      <span className="text-sm text-gray-500 capitalize">
                        {selectedConversation.user_role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isSent = msg.sender_id !== selectedConversation.user_id
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-lg ${
                            isSent
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isSent ? 'text-primary-100' : 'text-gray-500'
                            }`}
                          >
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Send Message Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-1 sm:space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-1 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="px-3 sm:px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send size={18} />
                      <span className='hidden sm:block'>{sending ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <MessageSquare size={64} className="mb-4 text-gray-300" />
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MessagesPage
