'use client'
import {
  getNotificationsByUserId,
  updateReadStatusByUserId
} from '@/actions/notifications'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { pusherClient } from '@/pusher/pusherClient'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

export default function NotificationDropDown() {
  const [open, setOpen] = React.useState(false)
  const { userId } = useAuth()
  const { theme } = useTheme()
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (userId) {
      const channel = pusherClient.subscribe(`${userId}`)
      channel.bind(`${userId}`, (data: any) => {
        showToast('success', `${data}`, theme)
        setNotifications(prev => {
          return [...prev, { message: data }]
        })
      })

      return () => {
        pusherClient.unsubscribe(`${userId}`)
      }
    }
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        showToast('error', 'user not logged in', theme)
        return
      }
      const userNotifications = await getNotificationsByUserId(userId)
      setNotifications(userNotifications || [])
    }
    fetchNotifications()
  }, [])

  const handleMarkAllAsRead = async () => {
    try {
      if (!userId) {
        showToast('error', 'user not logged in', theme)
        return
      }
      await updateReadStatusByUserId(userId)
      setNotifications([])
      setOpen(false)
      showToast('success', 'All catched up', theme)
    } catch (err) {
      showToast('error', 'Something went wrong', theme)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='relative'>
          <Bell className='h-4 w-4' />
          <span className='sr-only'>Open notifications</span>
          {notifications.length > 0 && (
            <span className='absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mx-4 w-60 sm:w-80'>
        <DropdownMenuLabel className='font-normal'>
          <h2 className='text-lg font-semibold'>Notifications</h2>
          <p className='text-sm text-muted-foreground'>
            You have {notifications.length} unread messages
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className='h-[300px] overflow-y-auto'>
          {notifications.length > 0 &&
            notifications.map((notification, index) => (
              <DropdownMenuItem key={index} className='cursor-default'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    You have a notification
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {notification.message}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        {notifications.length > 0 && (
          <DropdownMenuItem
            onClick={handleMarkAllAsRead}
            className='cursor-pointer'
          >
            <Button className='w-full bg-slate-950 dark:bg-white dark:text-black'>
              Mark all as read
            </Button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
