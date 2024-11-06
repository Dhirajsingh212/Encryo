'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { ServiceForm } from '@/types/types'
import { revalidatePath } from 'next/cache'

export async function addGithubService(
  serviceData: ServiceForm,
  projectSlug: string,
  userId: string
) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      }
    })

    if (!projectDetails || !userDetails) {
      return false
    }

    if (!userDetails.publicKey) {
      return false
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
    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    return false
  }
}

export async function getServicesDataByProjectSlug(projectSlug: string) {
  try {
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      },
      select: {
        id: true,
        user: {
          select: {
            privateKey: true
          }
        }
      }
    })
    const serviceData = await prisma.githubService.findMany({
      where: {
        githubProjectId: projectDetails?.id
      }
    })

    if (serviceData.length === 0) {
      return serviceData
    }

    const decryptedData = await Promise.all(
      serviceData.map(async service => {
        return {
          ...service,
          value: await decryptData(
            service.value,
            projectDetails?.user.privateKey || ''
          )
        }
      })
    )

    return decryptedData
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function deleteServiceById(serviceId: string) {
  try {
    await prisma.githubService.deleteMany({
      where: {
        id: serviceId
      }
    })
    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    return false
  }
}

export async function updateServiceData({
  projectSlug,
  name,
  value,
  expDate,
  link,
  serviceId
}: {
  projectSlug: string
  name: string
  value: string
  expDate: string
  link: string
  serviceId: string
}) {
  try {
    const projectDetails = await prisma.githubProject.findFirst({
      where: { slug: projectSlug },
      select: {
        id: true,
        user: { select: { publicKey: true } }
      }
    })

    if (
      !projectDetails ||
      !projectDetails.id ||
      !projectDetails.user.publicKey
    ) {
      throw new Error('Project not found or missing public key')
    }

    const encryptedValue = await encryptData(
      value,
      projectDetails.user.publicKey || ''
    )

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
