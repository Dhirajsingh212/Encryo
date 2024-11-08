'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getGithubProjectDetailsByUserID(userId: string) {
  try {
    const githubProjectDetails = await prisma.githubProject.findMany({
      where: {
        userId: userId
      }
    })
    return githubProjectDetails
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function createNewGithubProject(
  userId: string,
  projectName: string
) {
  try {
    await prisma.githubProject.create({
      data: {
        userId,
        name: projectName,
        slug: projectName
      }
    })
    revalidatePath('/github(.*)')
    revalidatePath('/forked(.*)')
    revalidatePath('/home(.*)')
    revalidatePath('/shared(.*)')
    return true
  } catch (err) {
    return false
  }
}

export async function getGithubSharedProjectByUserId(userId: string) {
  try {
    const projectDetails = await prisma.githubShared.findMany({
      where: {
        userIdTo: userId
      },
      select: {
        project: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })
    return projectDetails
  } catch (err) {
    return null
  }
}

export async function deleteProjectById(projectId: string, userId: string) {
  try {
    await prisma.$transaction(async prisma => {
      await prisma.githubFile.deleteMany({
        where: {
          projectId: projectId
        }
      })
      await prisma.githubService.deleteMany({
        where: {
          githubProjectId: projectId
        }
      })
      await prisma.githubShared.deleteMany({
        where: {
          userIdFrom: userId,
          githubProjectId: projectId
        }
      })
      await prisma.githubProject.deleteMany({
        where: {
          id: projectId
        }
      })
    })

    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
