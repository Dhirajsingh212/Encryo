'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addSharedUserToDB({
  fromUserId,
  toUserId,
  projectId,
  privilege
}: {
  fromUserId: string
  toUserId: string
  projectId: string
  privilege: 'read'
}) {
  try {
    await prisma.shared.create({
      data: {
        userIdFrom: fromUserId,
        emailIdTo: toUserId,
        projectId,
        privilege: 'READ'
      }
    })
    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed operation'
    throw new Error(errorMessage)
  }
}

export async function removeSharedUserFromProject(
  emailIdTo: string,
  projectId: string
) {
  try {
    await prisma.shared.deleteMany({
      where: {
        emailIdTo,
        projectId
      }
    })
    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed operation'
    throw new Error(errorMessage)
  }
}

export async function getSharedUserByProjectSlug(slug: string) {
  try {
    const projectDetails = await prisma.project.findFirst({
      where: {
        slug
      }
    })
    const sharedUserDetails = await prisma.shared.findMany({
      where: {
        projectId: projectDetails?.id
      },
      select: {
        userTo: {
          select: {
            email: true
          }
        },
        privilege: true
      }
    })
    return sharedUserDetails
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed operation'
    throw new Error(errorMessage)
  }
}
