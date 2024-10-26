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
      where: {
        slug: projectSlug
      },
      select: {
        id: true,
        user: {
          select: {
            publicKey: true
          }
        }
      }
    })

    if (
      !projectDetails ||
      !projectDetails.id ||
      !projectDetails.user.publicKey
    ) {
      return false
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
    console.log(err)
    return false
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
        envs: {
          select: {
            name: true,
            value: true
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
