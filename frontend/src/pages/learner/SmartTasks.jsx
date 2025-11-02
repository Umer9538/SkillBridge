import Layout from '../../components/common/Layout'
import SmartTaskSearch from '../../components/ai/SmartTaskSearch'

const SmartTasks = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <SmartTaskSearch />
      </div>
    </Layout>
  )
}

export default SmartTasks
