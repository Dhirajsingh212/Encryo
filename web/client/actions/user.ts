'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPublicKey(userId: string) {
  try {
    const userDetails = await prisma.user.findFirst({
      where: {
        clerkUserId: userId
      },
      select: {
        publicKey: true,
        privateKey: true
      }
    })
    return userDetails
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function setPulbicKey(
  userId: string,
  publicKey: string,
  privateKey: string
) {
  try {
    await prisma.user.update({
      where: {
        clerkUserId: userId
      },
      data: {
        publicKey,
        privateKey
      }
    })
    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

export async function getAllUserDetails() {
  try {
    const userDetails = await prisma.user.findMany({
      select: {
        email: true,
        clerkUserId: true
      }
    })
    return userDetails
  } catch (err) {
    console.log(err)
    return null
  }
}
