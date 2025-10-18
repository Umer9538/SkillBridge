import prisma from '../db'

/**
 * Application Operations Examples
 */

// Get all applications
export async function getAllApplications() {
  const applications = await prisma.applications.findMany({
    include: {
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
      tasks: {
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
      },
    },
    orderBy: {
      applied_at: 'desc',
    },
  })
  return applications
}

// Get application by ID
export async function getApplicationById(applicationId: number) {
  const application = await prisma.applications.findUnique({
    where: { id: applicationId },
    include: {
      learners: {
        include: {
          users: true,
        },
      },
      tasks: {
        include: {
          companies: {
            include: {
              users: true,
            },
          },
        },
      },
      evaluations: true,
    },
  })
  return application
}

// Get applications by learner
export async function getApplicationsByLearner(learnerId: number) {
  const applications = await prisma.applications.findMany({
    where: { learner_id: learnerId },
    include: {
      tasks: {
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
      },
      evaluations: true,
    },
    orderBy: {
      applied_at: 'desc',
    },
  })
  return applications
}

// Get applications by task
export async function getApplicationsByTask(taskId: number) {
  const applications = await prisma.applications.findMany({
    where: { task_id: taskId },
    include: {
      learners: {
        include: {
          users: {
            select: {
              name: true,
              email: true,
              profile_picture: true,
            },
          },
        },
      },
    },
    orderBy: {
      applied_at: 'desc',
    },
  })
  return applications
}

// Get applications for a company's tasks
export async function getApplicationsByCompany(companyId: number) {
  const applications = await prisma.applications.findMany({
    where: {
      tasks: {
        company_id: companyId,
      },
    },
    include: {
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
      tasks: {
        select: {
          id: true,
          title: true,
          category: true,
        },
      },
    },
    orderBy: {
      applied_at: 'desc',
    },
  })
  return applications
}

// Create a new application
export async function createApplication(data: {
  task_id: number
  learner_id: number
  cover_letter: string
}) {
  const application = await prisma.applications.create({
    data: {
      ...data,
      status: 'pending',
      applied_at: new Date(),
    },
  })
  return application
}

// Update application status (accept/reject)
export async function updateApplicationStatus(
  applicationId: number,
  status: string
) {
  const application = await prisma.applications.update({
    where: { id: applicationId },
    data: {
      status,
      ...(status === 'accepted' && { accepted_at: new Date() }),
    },
  })
  return application
}

// Submit work for an application
export async function submitWork(
  applicationId: number,
  data: {
    submission_url: string
    submission_notes?: string
  }
) {
  const application = await prisma.applications.update({
    where: { id: applicationId },
    data: {
      ...data,
      status: 'submitted',
      submitted_at: new Date(),
    },
  })
  return application
}

// Complete an application
export async function completeApplication(applicationId: number) {
  const application = await prisma.applications.update({
    where: { id: applicationId },
    data: {
      status: 'completed',
      completed_at: new Date(),
    },
  })
  return application
}

// Get applications by status
export async function getApplicationsByStatus(status: string) {
  const applications = await prisma.applications.findMany({
    where: { status },
    include: {
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
      tasks: {
        select: {
          title: true,
        },
      },
    },
  })
  return applications
}

// Get pending applications for a company
export async function getPendingApplicationsByCompany(companyId: number) {
  const applications = await prisma.applications.findMany({
    where: {
      status: 'pending',
      tasks: {
        company_id: companyId,
      },
    },
    include: {
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
      tasks: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })
  return applications
}
