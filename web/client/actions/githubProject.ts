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
