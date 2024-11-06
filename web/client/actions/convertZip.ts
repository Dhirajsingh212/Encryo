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

    if (!projectDetails || !projectDetails.files || !userDetails) {
      return null
    }

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

    const files = decryptedData
    const zip = new JSZip()

    files.forEach(file => {
      const { name, extension, encryptedContent } = file
      zip.file(`${name}.${extension}`, encryptedContent)
    })

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })

    return zipContent
  } catch (err) {
    console.log(err)
    return null
  }
}
