import prisma from '../db'

/**
 * User Operations Examples
 */

// Get all users
export async function getAllUsers() {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      is_active: true,
      created_at: true,
    },
  })
  return users
}

// Get user by ID with relationships
export async function getUserById(userId: number) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    include: {
      learners: true,
      companies: true,
      supervisors: true,
      notifications: {
        where: { read: false },
        orderBy: { created_at: 'desc' },
      },
    },
  })
  return user
}

// Get user by email
export async function getUserByEmail(email: string) {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password_hash: true,
      role: true,
      name: true,
      is_active: true,
    },
  })
  return user
}

// Create a new user
export async function createUser(data: {
  email: string
  password_hash: string
  name: string
  role: string
}) {
  const user = await prisma.users.create({
    data: {
      ...data,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  })
  return user
}

// Update user profile
export async function updateUser(userId: number, data: {
  name?: string
  profile_picture?: string
}) {
  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  })
  return user
}

// Get users by role
export async function getUsersByRole(role: string) {
  const users = await prisma.users.findMany({
    where: { role },
    select: {
      id: true,
      email: true,
      name: true,
      is_active: true,
      created_at: true,
    },
  })
  return users
}

// Example: Get all learners with their applications
export async function getAllLearners() {
  const learners = await prisma.learners.findMany({
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
          profile_picture: true,
        },
      },
      applications: {
        include: {
          tasks: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      },
      enrollments: {
        include: {
          courses: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      },
    },
  })
  return learners
}

// Example: Get all companies with their tasks
export async function getAllCompanies() {
  const companies = await prisma.companies.findMany({
    include: {
      users: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          created_at: true,
        },
      },
    },
  })
  return companies
}
