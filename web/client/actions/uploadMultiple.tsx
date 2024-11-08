'use server'

import { encryptData } from '@/lib/key'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import path from 'path'

export async function bulkUploadToDb(
  formData: any,
  userId: string,
  projectSlug: string
) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })

    if (!userDetails || !userDetails.publicKey) {
      return false
    }

    const projectDetails = await prisma.githubProject.findFirst({
      where: {
        slug: projectSlug
      }
    })

    if (!projectDetails) {
      return false
    }

    const filePromises = []

    for (const [_, value] of formData.entries()) {
      if (value instanceof File) {
        filePromises.push(
          (async () => {
            try {
              // Extract file details
              const extension = path.extname(value.name)
              const name = path.basename(value.name, extension)

              // Read file content as a buffer
              const fileContent = await value.arrayBuffer()

              // Convert ArrayBuffer to Buffer
              const fileBuffer = Buffer.from(fileContent)

              // Convert buffer to string if needed (for text-based files)
              const fileString = fileBuffer.toString()

              // Encrypt file content
              const encryptedContent = await encryptData(
                fileString,
                userDetails.publicKey || ''
              )

              // Save file details, including content, to the database
              await prisma.githubFile.create({
                data: {
                  name: name,
                  extension: extension,
                  encryptedContent: encryptedContent,
                  type: value.type,
                  projectId: projectDetails.id
                }
              })
            } catch (error) {
              console.error(`Error processing file ${value.name}:`, error)
            }
          })()
        )
      }
    }

    await Promise.all(filePromises)
    revalidatePath('/forked(.*)')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
