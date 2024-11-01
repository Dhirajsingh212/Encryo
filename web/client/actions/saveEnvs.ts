'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveEnvs(
  projectSlug: string,
  envs: Record<string, string>
) {
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

    await Promise.all(
      Object.entries(envs).map(async ([key, value]) => {
        const encryptedValue = await encryptData(
          value,
          projectDetails.user.publicKey || ''
        )

        await prisma.env.create({
          data: {
            projectId: projectDetails.id,
            name: key,
            value: encryptedValue
          }
        })
      })
    )

    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Failed to save environment variables'
    throw new Error(errorMessage)
  }
}

export async function getEnvsByProjectSlug(slug: string, userId: string) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails || !userDetails.privateKey) {
      throw new Error('User details or private key not found.')
    }

    const projectDetails = await prisma.project.findFirst({
      where: {
        slug: slug
      },
      select: {
        id: true,
        envs: {
          select: {
            name: true,
            value: true,
            id: true
          }
        }
      }
    })

    if (!projectDetails || !projectDetails.envs) {
      throw new Error('Project details or environment variables not found.')
    }

    const decryptedEnvs = await Promise.all(
      projectDetails.envs.map(async pair => {
        const decryptedValue = await decryptData(
          pair.value,
          userDetails.privateKey!
        )
        return {
          ...pair,
          value: decryptedValue
        }
      })
    )

    return {
      ...projectDetails,
      envs: decryptedEnvs
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function getSharedEnvsByProjectSlug(slug: string, userId: string) {
  try {
    const sharedUserDetail = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    const toUserIdDetails = await prisma.shared.findFirst({
      where: {
        emailIdTo: sharedUserDetail?.email
      },
      select: {
        userIdFrom: true
      }
    })

    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: toUserIdDetails?.userIdFrom
      }
    })

    if (!userDetails || !userDetails.privateKey) {
      throw new Error('User details or private key not found.')
    }

    const projectDetails = await prisma.project.findFirst({
      where: {
        slug: slug
      },
      select: {
        id: true,
        envs: {
          select: {
            name: true,
            value: true,
            id: true
          }
        }
      }
    })

    if (!projectDetails || !projectDetails.envs) {
      throw new Error('Project details or environment variables not found.')
    }

    const decryptedEnvs = await Promise.all(
      projectDetails.envs.map(async pair => {
        const decryptedValue = await decryptData(
          pair.value,
          userDetails.privateKey!
        )
        return {
          ...pair,
          value: decryptedValue
        }
      })
    )

    return {
      ...projectDetails,
      envs: decryptedEnvs
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function deleteEnvById(id: string) {
  try {
    if (!id) {
      throw new Error('Id must be provided')
    }

    console.log(id)

    await prisma.env.delete({
      where: {
        id
      }
    })

    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Failed to save environment variables'
    throw new Error(errorMessage)
  }
}

export async function udpateEnvById(
  userId: string,
  id: string,
  name: string,
  value: string
) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      },
      select: {
        publicKey: true
      }
    })

    if (!userDetails || !userDetails.publicKey) {
      throw new Error('User not found or missing public key')
    }

    const encryptedValue = await encryptData(value, userDetails.publicKey || '')

    await prisma.env.update({
      where: {
        id: id
      },
      data: {
        name,
        value: encryptedValue
      }
    })

    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Failed to save environment variables'
    throw new Error(errorMessage)
  }
}
