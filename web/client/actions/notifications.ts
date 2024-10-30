'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getNotificationsByUserId(userId: string) {
  try {
    const userNotifications = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return userNotifications
  } catch (err) {
    console.log(err)
    return null
  }
}

export async function updateReadStatusByUserId(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId
      },
      data: {
        isRead: true
      }
    })
    revalidatePath('/home(.*)')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
