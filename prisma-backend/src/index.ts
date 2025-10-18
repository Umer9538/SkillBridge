import prisma from './db'
import * as UserExamples from './examples/users'
import * as TaskExamples from './examples/tasks'
import * as ApplicationExamples from './examples/applications'
import * as CourseExamples from './examples/courses'

/**
 * SkillBridge Prisma Examples
 *
 * This file demonstrates how to use Prisma with the SkillBridge database
 */

async function main() {
  console.log('🚀 SkillBridge Prisma Examples\n')

  try {
    // ===== USERS =====
    console.log('📊 Fetching all users...')
    const users = await UserExamples.getAllUsers()
    console.log(`Found ${users.length} users:`)
    users.forEach((user) => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`)
    })
    console.log('')

    // ===== LEARNERS =====
    console.log('🎓 Fetching all learners with their data...')
    const learners = await UserExamples.getAllLearners()
    console.log(`Found ${learners.length} learners:`)
    learners.forEach((learner) => {
      console.log(`  - ${learner.users.name}`)
      console.log(`    Applications: ${learner.applications.length}`)
      console.log(`    Enrollments: ${learner.enrollments.length}`)
    })
    console.log('')

    // ===== COMPANIES =====
    console.log('🏢 Fetching all companies...')
    const companies = await UserExamples.getAllCompanies()
    console.log(`Found ${companies.length} companies:`)
    companies.forEach((company) => {
      console.log(`  - ${company.company_name} (${company.users.email})`)
      console.log(`    Tasks posted: ${company.tasks.length}`)
    })
    console.log('')

    // ===== TASKS =====
    console.log('📋 Fetching all tasks...')
    const tasks = await TaskExamples.getAllTasks()
    console.log(`Found ${tasks.length} tasks:`)
    tasks.forEach((task) => {
      console.log(`  - ${task.title}`)
      console.log(`    Category: ${task.category} | Difficulty: ${task.difficulty}`)
      console.log(`    Applications: ${task.applications.length}`)
      console.log(`    Status: ${task.status}`)
    })
    console.log('')

    // ===== ACTIVE TASKS =====
    console.log('✅ Fetching active tasks...')
    const activeTasks = await TaskExamples.getActiveTasks()
    console.log(`Found ${activeTasks.length} active tasks`)
    console.log('')

    // ===== APPLICATIONS =====
    console.log('📝 Fetching all applications...')
    const applications = await ApplicationExamples.getAllApplications()
    console.log(`Found ${applications.length} applications:`)
    applications.forEach((app) => {
      console.log(`  - ${app.learners.users.name} applied to "${app.tasks.title}"`)
      console.log(`    Status: ${app.status}`)
      if (app.submission_url) {
        console.log(`    Submission: ${app.submission_url}`)
      }
    })
    console.log('')

    // ===== COURSES =====
    console.log('📚 Fetching all courses...')
    const courses = await CourseExamples.getAllCourses()
    console.log(`Found ${courses.length} courses:`)
    courses.forEach((course) => {
      console.log(`  - ${course.title}`)
      console.log(`    Category: ${course.category} | Difficulty: ${course.difficulty}`)
      console.log(`    Modules: ${course.modules.length}`)
      console.log(`    Enrollments: ${course.enrollments.length}`)
    })
    console.log('')

    // ===== ENROLLMENTS =====
    if (learners.length > 0) {
      console.log('🎯 Fetching enrollments for first learner...')
      const enrollments = await CourseExamples.getLearnerEnrollments(learners[0].id)
      console.log(`Found ${enrollments.length} enrollments for ${learners[0].users.name}:`)
      enrollments.forEach((enrollment) => {
        console.log(`  - ${enrollment.courses.title}`)
        console.log(`    Progress: ${enrollment.completion_percentage || 0}%`)
        console.log(`    Status: ${enrollment.status}`)
      })
    }
    console.log('')

    // ===== STATISTICS =====
    console.log('📈 Database Statistics:')
    const stats = {
      users: await prisma.users.count(),
      learners: await prisma.learners.count(),
      companies: await prisma.companies.count(),
      supervisors: await prisma.supervisors.count(),
      tasks: await prisma.tasks.count(),
      applications: await prisma.applications.count(),
      courses: await prisma.courses.count(),
      enrollments: await prisma.enrollments.count(),
      notifications: await prisma.notifications.count(),
    }

    Object.entries(stats).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value}`)
    })

    console.log('\n✅ All examples completed successfully!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
