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
      return {
        message: 'User does not exists',
        success: false
      }
    }

    if (!userDetails.publicKey) {
      return {
        message: 'Public key does not exists',
        success: false
      }
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
      return {
        message: 'Project does not exists',
        success: false
      }
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

    return {
      message: 'Success',
      zipContent,
      success: true
    }
  } catch (err) {
    return {
      message: 'Something went wrong',
      zipContent: null,
      success: false
    }
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
      return {
        message: 'Project does not exists',
        success: false
      }
    }

    const sharedDetails = await prisma.githubShared.findFirst({
      where: {
        userIdTo: userId
      }
    })

    if (!sharedDetails) {
      return {
        message: 'User not authorized to access this',
        success: false
      }
    }

    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: sharedDetails?.userIdFrom
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
        message: 'Public key does not exists',
        success: false
      }
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

    return {
      message: 'Success',
      zipContent,
      success: true
    }
  } catch (err) {
    return {
      zipContent: null,
      success: false,
      message: 'Something went wrong'
    }
  }
}
