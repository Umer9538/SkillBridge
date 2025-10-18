import prisma from './db'

/**
 * Simple Prisma Test
 */

async function test() {
  console.log('🔍 Testing Prisma Connection...\n')

  try {
    // Test 1: Count records
    console.log('📊 Counting records...')
    const userCount = await prisma.users.count()
    const taskCount = await prisma.tasks.count()
    const applicationCount = await prisma.applications.count()
    const courseCount = await prisma.courses.count()

    console.log(`✅ Users: ${userCount}`)
    console.log(`✅ Tasks: ${taskCount}`)
    console.log(`✅ Applications: ${applicationCount}`)
    console.log(`✅ Courses: ${courseCount}`)
    console.log('')

    // Test 2: Get specific records
    console.log('🔎 Fetching specific records...')

    const firstUser = await prisma.users.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })
    console.log('First user:', firstUser)
    console.log('')

    const firstTask = await prisma.tasks.findFirst({
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
      },
    })
    console.log('First task:', firstTask)
    console.log('')

    // Test 3: Query with relations
    console.log('🔗 Testing relations...')
    const taskWithCompany = await prisma.tasks.findFirst({
      include: {
        companies: {
          select: {
            company_name: true,
          },
        },
      },
    })
    console.log('Task with company:', {
      task: taskWithCompany?.title,
      company: taskWithCompany?.companies.company_name,
    })
    console.log('')

    // Test 4: Applications with learner info
    const applicationWithDetails = await prisma.applications.findFirst({
      include: {
        tasks: {
          select: {
            title: true,
          },
        },
        learners: {
          include: {
            users: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    if (applicationWithDetails) {
      console.log('Application details:', {
        task: applicationWithDetails.tasks.title,
        learner: applicationWithDetails.learners.users.name,
        status: applicationWithDetails.status,
      })
    }

    console.log('\n✅ All tests passed! Prisma is working correctly.\n')
    console.log('💡 Next steps:')
    console.log('  - Run "npm run prisma:studio" to open Prisma Studio')
    console.log('  - Check src/examples/ for more complex queries')
    console.log('  - Read README.md for full documentation')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
