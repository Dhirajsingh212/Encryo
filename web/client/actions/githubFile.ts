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

    if (!userDetails) {
      return {
        message: 'User does not exists',
        success: false
      }
    }

    if (!userDetails.publicKey || !userDetails.privateKey) {
      return {
        message: 'Key does not exists',
        success: false
      }
    }

    if (!projectDetails) {
      return {
        message: 'Project does not exists',
        success: false
      }
    }

    const fileDetails = await prisma.githubFile.findFirst({
      where: {
        name: formData.name,
        projectId: projectDetails.id
      }
    })

    if (fileDetails) {
      return {
        message: 'File already exists',
        success: false
      }
    }

    const encryptedContent = await encryptData(
      formData.content,
      userDetails.publicKey
    )

    if (!encryptedContent) {
      return {
        message: 'Failed to encrypt content',
        success: false
      }
    }

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
    return {
      message: 'File added successfully',
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false
    }
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
        id: true,
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
    const fileDetails = await prisma.githubFile.findFirst({
      where: {
        id
      }
    })

    if (!fileDetails) {
      return {
        message: 'File does not exists',
        success: false
      }
    }

    await prisma.githubFile.deleteMany({
      where: {
        id
      }
    })
    revalidatePath('/forked(.*)')
    return {
      message: 'File successfully deleted',
      success: true
    }
  } catch (err) {
    console.log(err)
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}

export async function updateGithubFileById(
  formData: FormData,
  id: string,
  userId: string
) {
  try {
    const fileDetails = await prisma.githubFile.findFirst({
      where: {
        id
      }
    })

    if (!fileDetails) {
      return {
        message: 'File does not exists',
        success: false
      }
    }

    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails) {
      return {
        message: 'user does not exists',
        success: false
      }
    }

    if (!userDetails || !userDetails.publicKey || !userDetails.privateKey) {
      return {
        message: 'Public key does not exists',
        success: false
      }
    }

    const encryptedContent = await encryptData(
      formData.content,
      userDetails.publicKey
    )

    if (!encryptedContent) {
      return {
        message: 'Failed to encrypt content',
        success: false
      }
    }

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
    return {
      message: 'File successfully updated',
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}
