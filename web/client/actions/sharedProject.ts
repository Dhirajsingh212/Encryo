'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { FormData } from '@/types/types'
import { revalidatePath } from 'next/cache'

export async function getSharedProjectDetailsByUserIdAndSlug(
  userId: string,
  slug: string
) {
  try {
    // FIRST FIND THE PROJECT DETAILS
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: slug
      },
      select: {
        id: true,
        files: {
          select: {
            name: true,
            extension: true,
            encryptedContent: true,
            type: true,
            id: true
          }
        }
      }
    })
    if (!projectDetails) {
      return null
    }
    // SECOND FIND THE SHARED DETAILS OF THE PROJECT WITH PROJECTID AND UserIDTO
    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails?.id
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
      projectDetails.files.map(async item => {
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

export async function updateSharedGithubFileById(
  projectSlug: string,
  userId: string,
  id: string,
  formData: FormData
) {
  try {
    // FIRST FIND THE PROJECT DETAILS
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      },
      select: {
        id: true
      }
    })
    if (!projectDetails) {
      return {
        message: 'Project does not exists',
        success: false
      }
    }
    // SECOND FIND THE SHARED DETAILS OF THE PROJECT WITH PROJECTID AND UserIDTO
    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails?.id
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
        message: 'User does not exists',
        success: false
      }
    }

    if (!userDetails.publicKey) {
      return {
        message: 'Public key not found',
        success: false
      }
    }

    //ENCRYPT THE FILES
    const encryptedData = await encryptData(
      formData.content,
      userDetails.publicKey
    )

    if (!encryptedData) {
      return {
        message: 'Failed to encrypt data',
        success: false
      }
    }

    //UPDATE THE DATA
    await prisma.githubFile.update({
      where: {
        id
      },
      data: {
        name: formData.name,
        encryptedContent: encryptedData,
        extension: formData.extension
      }
    })
    revalidatePath('/shared(.*)')
    return {
      message: 'File updated successfully',
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

export async function addFileToSharedProject(
  formData: FormData,
  projectSlug: string,
  userId: string,
  type: string
) {
  try {
    // FIRST FIND THE PROJECT DETAILS
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      },
      select: {
        id: true
      }
    })
    if (!projectDetails) {
      return {
        message: 'Project does not exists',
        success: false
      }
    }

    const fileDetails = await prisma.githubFile.findFirst({
      where: {
        name: formData.name,
        extension: formData.extension,
        projectId: projectDetails.id
      }
    })

    if (fileDetails) {
      return {
        message: 'File already exists',
        success: false
      }
    }
    // SECOND FIND THE SHARED DETAILS OF THE PROJECT WITH PROJECTID AND UserIDTO
    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails?.id
      }
    })

    if (!sharedDetails) {
      return {
        message: 'User not authorized to access this',
        success: false
      }
    }
    //THIRD FIND THE PUBLIC AND PRIVATE KEY OF USER WHO SHARED THIS PROJECT TO DECODE THE FILES
    const sharedFromUserDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!sharedFromUserDetails) {
      return {
        message: 'Admin user does not exists',
        success: false
      }
    }

    if (!sharedFromUserDetails.publicKey) {
      return {
        message: 'Admin user public key does not exists',
        success: false
      }
    }

    const encryptedContent = await encryptData(
      formData.content,
      sharedFromUserDetails.publicKey
    )

    if (!encryptedContent) {
      return {
        message: 'Failed to encrypt data',
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
      message: 'Successfully created file',
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      success: false
    }
  }
}
