'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function saveGithubEnvs(
  projectName: string,
  envs: Record<string, string>
) {
  try {
    const projectDetails = await prisma.githubProject.findFirst({
      where: { slug: projectName },
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
      return false
    }

    await Promise.all(
      Object.entries(envs).map(async ([key, value]) => {
        const encryptedValue = await encryptData(
          value,
          projectDetails.user.publicKey || ''
        )

        await prisma.githubEnv.create({
          data: {
            githubProjectId: projectDetails.id,
            name: key,
            value: encryptedValue
          }
        })
      })
    )

    revalidatePath('/github(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Failed to save environment variables'
    throw new Error(errorMessage)
  }
}

export async function getGithubEnvs(userId: string, projectSlug: string) {
  try {
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      },
      select: {
        id: true,
        githubEnvs: {
          select: {
            name: true,
            value: true,
            id: true
          }
        }
      }
    })

    if (!projectDetails || !projectDetails.githubEnvs) {
      throw new Error('Project details or environment variables not found.')
    }

    if (projectDetails.githubEnvs.length === 0) {
      return { ...projectDetails }
    }

    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails || !userDetails.privateKey) {
      throw new Error('User details or private key not found.')
    }

    const decryptedEnvs = await Promise.all(
      projectDetails.githubEnvs.map(async pair => {
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
      githubEnvs: decryptedEnvs
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function deleteGithubEnvById(id: string) {
  try {
    if (!id) {
      throw new Error('Id must be provided')
    }

    await prisma.githubEnv.delete({
      where: {
        id
      }
    })

    revalidatePath('/github(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Failed to save environment variables'
    throw new Error(errorMessage)
  }
}

export async function udpateGithubEnvById(
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

    await prisma.githubEnv.update({
      where: {
        id: id
      },
      data: {
        name,
        value: encryptedValue
      }
    })

    revalidatePath('/github(.*)')
    return true
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Failed to save environment variables'
    throw new Error(errorMessage)
  }
}
