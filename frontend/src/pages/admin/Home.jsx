import Layout from '../../components/common/Layout'

const AdminHome = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Welcome to the admin dashboard. Manage users and monitor the platform here.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default AdminHome
