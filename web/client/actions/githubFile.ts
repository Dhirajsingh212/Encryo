'use server'

import { encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { FormData } from '@/types/types'

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

    // const encryptedContent = await encryptData(
    //   formData.content,
    //   userDetails.publicKey
    // )

    await prisma.githubFile.create({
      data: {
        name: formData.name,
        encryptedContent: formData.content,
        projectId: projectDetails.id,
        extension: formData.extension,
        type: type
      }
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function getGithubFilesByProjectSlug(slug: string) {
  try {
    const fileDetails = await prisma.githubProject.findFirst({
      where: {
        slug
      },
      select: {
        files: {
          select: {
            name: true,
            encryptedContent: true,
            extension: true,
            type: true
          }
        }
      }
    })
    return fileDetails
  } catch (err) {
    console.log(err)
    return null
  }
}
