import prisma from '../db'

/**
 * Course & Enrollment Operations Examples
 */

// Get all courses
export async function getAllCourses() {
  const courses = await prisma.courses.findMany({
    include: {
      supervisors: {
        include: {
          users: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      modules: {
        orderBy: {
          order: 'asc',
        },
      },
      enrollments: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
  return courses
}

// Get course by ID with full details
export async function getCourseById(courseId: number) {
  const course = await prisma.courses.findUnique({
    where: { id: courseId },
    include: {
      supervisors: {
        include: {
          users: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      modules: {
        orderBy: {
          order: 'asc',
        },
      },
      enrollments: {
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
        },
      },
    },
  })
  return course
}

// Get courses by category
export async function getCoursesByCategory(category: string) {
  const courses = await prisma.courses.findMany({
    where: { category },
    include: {
      supervisors: {
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
  return courses
}

// Get courses by difficulty
export async function getCoursesByDifficulty(difficulty: string) {
  const courses = await prisma.courses.findMany({
    where: { difficulty },
    include: {
      supervisors: {
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
  return courses
}

// Create a new course
export async function createCourse(data: {
  title: string
  description: string
  category: string
  difficulty: string
  supervisor_id: number
  duration?: number
  thumbnail?: string
}) {
  const course = await prisma.courses.create({
    data: {
      ...data,
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
    },
  })
  return course
}

// Get learner enrollments
export async function getLearnerEnrollments(learnerId: number) {
  const enrollments = await prisma.enrollments.findMany({
    where: { learner_id: learnerId },
    include: {
      courses: {
        include: {
          modules: {
            orderBy: {
              order: 'asc',
            },
          },
          supervisors: {
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
      enrolled_at: 'desc',
    },
  })
  return enrollments
}

// Enroll a learner in a course
export async function enrollLearner(data: {
  learner_id: number
  course_id: number
}) {
  const enrollment = await prisma.enrollments.create({
    data: {
      ...data,
      status: 'active',
      completion_percentage: 0,
      enrolled_at: new Date(),
    },
  })
  return enrollment
}

// Update enrollment progress
export async function updateEnrollmentProgress(
  enrollmentId: number,
  completionPercentage: number
) {
  const enrollment = await prisma.enrollments.update({
    where: { id: enrollmentId },
    data: {
      completion_percentage: completionPercentage,
      ...(completionPercentage === 100 && {
        status: 'completed',
        completed_at: new Date(),
      }),
    },
  })
  return enrollment
}

// Get course enrollments
export async function getCourseEnrollments(courseId: number) {
  const enrollments = await prisma.enrollments.findMany({
    where: { course_id: courseId },
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
      enrolled_at: 'desc',
    },
  })
  return enrollments
}

// Get completed courses for a learner
export async function getCompletedCourses(learnerId: number) {
  const enrollments = await prisma.enrollments.findMany({
    where: {
      learner_id: learnerId,
      status: 'completed',
    },
    include: {
      courses: {
        include: {
          certificates: {
            where: {
              learner_id: learnerId,
            },
          },
        },
      },
    },
  })
  return enrollments
}

// Get active enrollments for a learner
export async function getActiveEnrollments(learnerId: number) {
  const enrollments = await prisma.enrollments.findMany({
    where: {
      learner_id: learnerId,
      status: 'active',
    },
    include: {
      courses: {
        include: {
          modules: true,
        },
      },
    },
  })
  return enrollments
}
