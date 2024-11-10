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
      return {
        message: 'Project does not exists',
        success: false
      }
    }

    const serviceDetails = await prisma.githubService.findFirst({
      where: {
        name: serviceData.name,
        githubProjectId: projectDetails.id
      }
    })

    if (serviceDetails) {
      return {
        message: 'Service already exists',
        success: false
      }
    }

    // SECOND FIND SHARED DETAILS

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails.id
      }
    })

    if (!sharedDetails) {
      return {
        message: 'User not authorized to access this',
        success: false
      }
    }

    //THIRD FIND THE PUBLIC AND PRIVATE KEY OF USER WHO SHARED THIS PROJECT TO DECODE THE FILES
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!userDetails) {
      return {
        message: 'Admin user does not exists',
        success: false
      }
    }

    if (!userDetails.publicKey) {
      return {
        message: 'Admin user public key does not exists',
        success: false
      }
    }

    const encryptedValue = await encryptData(
      serviceData.value,
      userDetails?.publicKey || ''
    )

    if (!encryptedValue) {
      return {
        message: 'Failed to encrypt data',
        success: false
      }
    }

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
    return {
      message: 'Successfully added service',
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false
    }
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
      return {
        message: 'Project does not exists',
        success: false
      }
    }

    const serviceDetails = await prisma.githubService.findFirst({
      where: {
        id: serviceId
      }
    })

    if (!serviceDetails) {
      return {
        message: 'Servie does not exists',
        success: false
      }
    }

    // SECOND FIND SHARED DETAILS

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails.id
      }
    })

    if (!sharedDetails) {
      return {
        message: 'User not authorized to access this',
        success: false
      }
    }

    //THIRD FIND THE PUBLIC AND PRIVATE KEY OF USER WHO SHARED THIS PROJECT TO DECODE THE FILES
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!userDetails) {
      return {
        message: 'Admin user does not exists',
        success: false
      }
    }

    if (!userDetails.publicKey) {
      return {
        message: 'Admin user public key does not exists',
        success: false
      }
    }

    const encryptedValue = await encryptData(value, userDetails.publicKey || '')

    if (!encryptedValue) {
      return {
        message: 'Failed to encrypt data',
        success: false
      }
    }

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
    return {
      message: 'Service updated successfully',
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}
