import Layout from '../../components/common/Layout'

const MessagesPage = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your messages will be displayed here.</p>
        </div>
      </div>
    </Layout>
  )
}

export default MessagesPage
