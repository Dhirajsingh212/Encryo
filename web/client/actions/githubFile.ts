'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { FormData } from '@/types/types'
import { revalidatePath } from 'next/cache'

export async function addFileToGithubProject(
  formData: FormData,
  projectSlug: string,
  userId: string,
  type: string
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

    if (!userDetails || !userDetails.publicKey || !userDetails.privateKey) {
      return false
    }

    if (!projectDetails) {
      return false
    }

    const encryptedContent = await encryptData(
      formData.content,
      userDetails.publicKey
    )

    await prisma.githubFile.create({
      data: {
        name: formData.name,
        encryptedContent: encryptedContent,
        projectId: projectDetails.id,
        extension: formData.extension,
        type: type
      }
    })
    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function getGithubFilesByProjectSlug(
  slug: string,
  userId: string
) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails) {
      return null
    }

    const fileDetails = await prisma.githubProject.findFirst({
      where: {
        slug
      },
      select: {
        files: {
          select: {
            id: true,
            name: true,
            encryptedContent: true,
            extension: true,
            type: true
          }
        }
      }
    })

    if (!fileDetails || !fileDetails.files) {
      return null
    }

    const decryptedData = await Promise.all(
      fileDetails.files.map(async item => {
        const decryptedValue = await decryptData(
          item.encryptedContent,
          userDetails.privateKey!
        )
        return {
          ...item,
          encryptedContent: decryptedValue
        }
      })
    )

    return {
      ...fileDetails,
      files: decryptedData
    }
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function deleteFileById(id: string) {
  try {
    await prisma.githubFile.deleteMany({
      where: {
        id
      }
    })
    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function updateGithubFileById(
  formData: FormData,
  id: string,
  userId: string
) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails || !userDetails.publicKey || !userDetails.privateKey) {
      return false
    }

    const encryptedContent = await encryptData(
      formData.content,
      userDetails.publicKey
    )

    await prisma.githubFile.update({
      where: {
        id: id
      },
      data: {
        name: formData.name,
        encryptedContent: encryptedContent,
        extension: formData.extension
      }
    })
    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
