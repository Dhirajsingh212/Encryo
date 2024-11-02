'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addServicesData({
  projectSlug,
  name,
  apiKey,
  expDate,
  link
}: {
  projectSlug: string
  name: string
  apiKey: string
  expDate: string
  link: string
}) {
  try {
    const projectDetails = await prisma.project.findFirst({
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
      apiKey,
      projectDetails.user.publicKey || ''
    )

    await prisma.service.create({
      data: {
        projectId: projectDetails.id,
        name: name,
        value: encryptedValue,
        link: link,
        expDate: expDate
      }
    })

    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to create service'
    throw new Error(errorMessage)
  }
}

export async function getServicesDataByProjectSlug(projectSlug: string) {
  try {
    const projectDetails = await prisma.project.findFirst({
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
    const serviceData = await prisma.service.findMany({
      where: {
        projectId: projectDetails?.id
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
    await prisma.service.deleteMany({
      where: {
        id: serviceId
      }
    })
    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to delete service'
    throw new Error(errorMessage)
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
    const projectDetails = await prisma.project.findFirst({
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

    await prisma.service.updateMany({
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

    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to update service'
    throw new Error(errorMessage)
  }
}
