'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addProjectToUser({
  userId,
  deployed,
  name,
  icon,
  link,
  slug
}: {
  userId: string
  deployed: boolean
  name: string
  icon: string
  link: string
  slug: string
}) {
  try {
    if (!userId) {
      return false
    }
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      },
      select: {
        id: true,
        limit: true,
        projects: {
          select: {
            id: true
          }
        }
      }
    })

    if (!userDetails) {
      return false
    }

    if (userDetails.projects.length >= userDetails.limit) {
      throw new Error('Subscibe to add more projects')
    }
    await prisma.project.create({
      data: {
        userId: userDetails?.id,
        deployed,
        name,
        icon,
        link,
        slug
      }
    })
    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to create project'
    throw new Error(errorMessage)
  }
}

export async function getProjectsByUserId(userId: string) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })
    const userProjects = await prisma.project.findMany({
      where: {
        userId: userDetails?.id
      },
      select: {
        name: true,
        slug: true,
        icon: true,
        link: true,
        createdAt: true,
        id: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return userProjects
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getSharedProjectByUserId(userId: string) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })
    const sharedProjects = await prisma.shared.findMany({
      where: {
        emailIdTo: userDetails?.email
      },
      select: {
        project: {
          select: {
            name: true,
            createdAt: true,
            slug: true,
            link: true,
            icon: true
          }
        }
      }
    })
    return sharedProjects
  } catch (err) {
    console.log(err)
    return null
  }
}
export async function deleteProjectById(projectId: string, userId: string) {
  try {
    await prisma.$transaction(async prisma => {
      await prisma.shared.deleteMany({
        where: {
          userIdFrom: userId,
          projectId
        }
      })
      await prisma.env.deleteMany({
        where: {
          projectId: projectId
        }
      })
      await prisma.project.deleteMany({
        where: {
          id: projectId
        }
      })
    })

    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to delete project'
    throw new Error(errorMessage)
  }
}
