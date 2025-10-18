import prisma from '../db'

/**
 * Task Operations Examples
 */

// Get all tasks with company info
export async function getAllTasks() {
  const tasks = await prisma.tasks.findMany({
    include: {
      companies: {
        include: {
          users: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      applications: {
        select: {
          id: true,
          status: true,
          learner_id: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
  return tasks
}

// Get task by ID with full details
export async function getTaskById(taskId: number) {
  const task = await prisma.tasks.findUnique({
    where: { id: taskId },
    include: {
      companies: {
        include: {
          users: true,
        },
      },
      applications: {
        include: {
          learners: {
            include: {
              users: true,
            },
          },
        },
      },
    },
  })
  return task
}

// Get tasks by company
export async function getTasksByCompany(companyId: number) {
  const tasks = await prisma.tasks.findMany({
    where: { company_id: companyId },
    include: {
      applications: {
        select: {
          id: true,
          status: true,
          applied_at: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
  return tasks
}

// Get active tasks (for learners to browse)
export async function getActiveTasks() {
  const tasks = await prisma.tasks.findMany({
    where: {
      status: 'active',
    },
    include: {
      companies: {
        include: {
          users: {
            select: {
              name: true,
            },
          },
        },
      },
      applications: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
  return tasks
}

// Create a new task
export async function createTask(data: {
  company_id: number
  title: string
  description: string
  category: string
  difficulty: string
  estimated_hours?: number
  deadline?: Date
  max_applicants?: number
}) {
  const task = await prisma.tasks.create({
    data: {
      ...data,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    },
  })
  return task
}

// Update task
export async function updateTask(
  taskId: number,
  data: {
    title?: string
    description?: string
    status?: string
    deadline?: Date
  }
) {
  const task = await prisma.tasks.update({
    where: { id: taskId },
    data: {
      ...data,
      updated_at: new Date(),
    },
  })
  return task
}

// Delete task
export async function deleteTask(taskId: number) {
  const task = await prisma.tasks.delete({
    where: { id: taskId },
  })
  return task
}

// Get tasks by category
export async function getTasksByCategory(category: string) {
  const tasks = await prisma.tasks.findMany({
    where: {
      category,
      status: 'active',
    },
    include: {
      companies: {
        include: {
          users: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
  return tasks
}

// Get tasks by difficulty
export async function getTasksByDifficulty(difficulty: string) {
  const tasks = await prisma.tasks.findMany({
    where: {
      difficulty,
      status: 'active',
    },
    include: {
      companies: {
        include: {
          users: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })
  return tasks
}

// Get task statistics for a company
export async function getCompanyTaskStats(companyId: number) {
  const stats = await prisma.tasks.groupBy({
    by: ['status'],
    where: {
      company_id: companyId,
    },
    _count: {
      id: true,
    },
  })
  return stats
}
