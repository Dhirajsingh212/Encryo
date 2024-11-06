'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { ServiceForm } from '@/types/types'
import { revalidatePath } from 'next/cache'

export async function getSharedServicedDetailsByUserIdAndSlug(
  userId: string,
  slug: string
) {
  try {
    //FIRST FIND THE PROJECT DETAILS AND ID
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug
      },
      select: {
        id: true,
        githubService: {
          select: {
            name: true,
            id: true,
            value: true,
            link: true,
            expDate: true
          }
        }
      }
    })

    if (!projectDetails) {
      return null
    }

    // SECOND FIND SHARED DETAILS

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails.id
      }
    })

    if (!sharedDetails) {
      return null
    }

    //THIRD FIND THE PUBLIC AND PRIVATE KEY OF USER WHO SHARED THIS PROJECT TO DECODE THE FILES
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!userDetails) {
      return null
    }
    //DECODE THE FILES
    const decryptedData = await Promise.all(
      projectDetails.githubService.map(async item => {
        const decryptedValue = await decryptData(
          item.value,
          userDetails.privateKey!
        )
        return {
          ...item,
          value: decryptedValue
        }
      })
    )
    //RETURN THE DATA
    return {
      decryptedData,
      access: sharedDetails.privilege === 'READ' ? 'read' : 'write'
    }
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function getSharedProjectsByUserId(userId: string) {
  try {
    const sharedDetails = await prisma.githubShared.findMany({
      where: {
        userIdTo: userId
      },
      select: {
        project: {
          select: {
            name: true,
            id: true,
            createdAt: true
          }
        }
      }
    })
    return sharedDetails
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function addSharedGithubService(
  serviceData: ServiceForm,
  projectSlug: string,
  userId: string
) {
  try {
    //FIRST FIND THE PROJECT DETAILS AND ID
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      }
    })

    if (!projectDetails) {
      return null
    }

    // SECOND FIND SHARED DETAILS

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails.id
      }
    })

    if (!sharedDetails) {
      return null
    }

    //THIRD FIND THE PUBLIC AND PRIVATE KEY OF USER WHO SHARED THIS PROJECT TO DECODE THE FILES
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!userDetails) {
      return null
    }

    const encryptedValue = await encryptData(
      serviceData.value,
      userDetails?.publicKey || ''
    )

    await prisma.githubService.create({
      data: {
        name: serviceData.name,
        value: encryptedValue,
        link: serviceData.link,
        expDate: serviceData.date,
        githubProjectId: projectDetails.id
      }
    })
    revalidatePath('/shared(.*)')
    return true
  } catch (err) {
    return false
  }
}

export async function updateSharedServiceData({
  projectSlug,
  name,
  value,
  expDate,
  link,
  serviceId,
  userId
}: {
  projectSlug: string
  name: string
  value: string
  expDate: string
  link: string
  serviceId: string
  userId: string
}) {
  try {
    //FIRST FIND THE PROJECT DETAILS AND ID
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      }
    })

    if (!projectDetails) {
      return null
    }

    // SECOND FIND SHARED DETAILS

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails.id
      }
    })

    if (!sharedDetails) {
      return null
    }

    //THIRD FIND THE PUBLIC AND PRIVATE KEY OF USER WHO SHARED THIS PROJECT TO DECODE THE FILES
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!userDetails) {
      return null
    }

    const encryptedValue = await encryptData(value, userDetails.publicKey || '')

    await prisma.githubService.updateMany({
      where: {
        id: serviceId
      },
      data: {
        name: name,
        value: encryptedValue,
        link: link,
        expDate: expDate
      }
    })

    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    return false
  }
}
