'use server'

import prisma from '@/lib/prisma'

export async function addProjectToUser({
  userId,
  deployed,
  name,
  slug
}: {
  userId: string
  deployed: boolean
  name: string
  slug: string
}) {
  try {
    if (!userId) {
      return false
    }
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      }
    })
    if (!userDetails) {
      return false
    }
    await prisma.project.create({
      data: {
        userId: userDetails?.id,
        deployed,
        name,
        slug
      }
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
