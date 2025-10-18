import Layout from '../../components/common/Layout'

const SupervisorHome = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Supervisor Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Welcome to your supervisor dashboard. Manage courses and evaluations here.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default SupervisorHome
