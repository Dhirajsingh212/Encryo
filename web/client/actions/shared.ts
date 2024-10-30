'use server'

import prisma from '@/lib/prisma'
import { pusherServer } from '@/pusher/pusherServer'
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

    const toUserDetails = await prisma.user.findFirst({
      where: {
        email: toUserId
      }
    })

    const fromUserDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: fromUserId
      }
    })

    await prisma.notification.create({
      data: {
        message: `${fromUserDetails?.firstName} ${fromUserDetails?.lastName} Added you to their project`,
        userId: toUserDetails?.clerkUserId || ''
      }
    })

    await pusherServer.trigger(
      `${toUserDetails?.clerkUserId}`,
      `${toUserDetails?.clerkUserId}`,
      `${fromUserDetails?.firstName}  ${fromUserDetails?.lastName} Added you to their project`
    )
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
