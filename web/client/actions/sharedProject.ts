'use server'

import { decryptData, encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { FormData } from '@/types/types'

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
      return false
    }
    // SECOND FIND THE SHARED DETAILS OF THE PROJECT WITH PROJECTID AND UserIDTO
    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId,
        githubProjectId: projectDetails?.id
      }
    })

    if (!sharedDetails) {
      return false
    }
    //THIRD FIND THE PUBLIC AND PRIVATE KEY OF USER WHO SHARED THIS PROJECT TO DECODE THE FILES
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails.userIdFrom
      }
    })

    if (!userDetails || !userDetails.publicKey) {
      return false
    }
    //ENCRYPT THE FILES
    const encryptedData = await encryptData(
      formData.content,
      userDetails.publicKey
    )
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
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
