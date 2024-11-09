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
  privilege: 'read' | 'write'
}) {
  try {
    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdFrom: fromUserId,
        userIdTo: toUserId,
        githubProjectId: projectId,
        privilege: privilege === 'read' ? 'READ' : 'WRITE'
      }
    })

    if (sharedDetails) {
      return {
        message: 'Already shared with the user',
        success: false
      }
    }

    await prisma.githubShared.create({
      data: {
        userIdFrom: fromUserId,
        userIdTo: toUserId,
        githubProjectId: projectId,
        privilege: privilege === 'read' ? 'READ' : 'WRITE'
      }
    })

    const toUserDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: toUserId
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
    return {
      message: 'User added to the project',
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}

export async function removeSharedUserFromProject(
  emailIdTo: string,
  projectId: string
) {
  try {
    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: emailIdTo,
        githubProjectId: projectId
      }
    })

    if (!sharedDetails) {
      return {
        message: 'User does not added',
        success: false
      }
    }

    await prisma.githubShared.deleteMany({
      where: {
        userIdTo: emailIdTo,
        githubProjectId: projectId
      }
    })
    revalidatePath('/forked(.*)')
    return {
      message: 'User removed successfully',
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}

export async function getSharedUserByProjectSlug(slug: string) {
  try {
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug
      }
    })
    const sharedUserDetails = await prisma.githubShared.findMany({
      where: {
        githubProjectId: projectDetails?.id
      },
      select: {
        userTo: {
          select: {
            clerkUserId: true,
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
