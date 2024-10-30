'use server'

import { encryptData } from '@/lib/key'
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
    console.log(err)
    return false
  }
}

export async function getServicesDataByProjectSlug(projectSlug: string) {
  try {
    const projectDetails = await prisma.project.findFirst({
      where: {
        slug: projectSlug
      }
    })
    const serviceData = await prisma.service.findMany({
      where: {
        projectId: projectDetails?.id
      }
    })
    return serviceData
  } catch (err) {
    console.log(err)
    return null
  }
}
