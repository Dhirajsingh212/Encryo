'use server'

import { decryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import JSZip from 'jszip'

export async function extractZip(userId: string, projectSlug: string) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails) {
      return null
    }

    if (!userDetails.publicKey) {
      return null
    }

    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      },
      select: {
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            encryptedContent: true,
            extension: true
          }
        }
      }
    })

    if (!projectDetails || !projectDetails.files) {
      return null
    }

    // console.log(projectDetails.files)

    const decryptedData = await Promise.all(
      projectDetails.files.map(async item => {
        if (item.encryptedContent === null) {
          console.log(item.encryptedContent)
        }
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

    const files = decryptedData
    const zip = new JSZip()

    files.forEach(file => {
      const { name, extension, encryptedContent } = file
      zip.file(`${name}.${extension}`, encryptedContent)
    })

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })

    return zipContent
  } catch (err) {
    return null
  }
}

export async function extractSharedZip(userId: string, projectSlug: string) {
  try {
    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      },
      select: {
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            encryptedContent: true,
            extension: true
          }
        }
      }
    })

    if (!projectDetails || !projectDetails.files) {
      return null
    }

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId
      }
    })

    if (!sharedDetails) {
      return null
    }

    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails?.userIdFrom
      }
    })

    if (!userDetails) {
      return null
    }

    if (!userDetails.publicKey) {
      return null
    }

    const decryptedData = await Promise.all(
      projectDetails.files.map(async item => {
        if (item.encryptedContent === null) {
          console.log(item.encryptedContent)
        }
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

    const files = decryptedData
    const zip = new JSZip()

    files.forEach(file => {
      const { name, extension, encryptedContent } = file
      zip.file(`${name}.${extension}`, encryptedContent)
    })

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })

    return zipContent
  } catch (err) {
    return null
  }
}
