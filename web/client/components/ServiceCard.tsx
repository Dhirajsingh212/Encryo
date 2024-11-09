'use client'

import { deleteServiceById } from '@/actions/githubService'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { showToast } from '@/toast'
import { Service } from '@/types/types'
import {
  CircleCheck,
  Copy,
  ExternalLink,
  Key,
  MoreVertical,
  Trash
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import ServiceEditDialog from './ServiceEditDialog'
import Spinner from './Spinner'

const ServiceCard = ({ service }: { service: Service }) => {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    showToast('success', 'copied to clipboard', theme)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const deleteHandler = async () => {
    try {
      setIsLoading(true)
      const response = await deleteServiceById(service.id)
      if (response.success) {
        showToast('success', 'deleted successfully', theme)
      } else {
        showToast('error', response.message, theme)
      }
    } catch (err) {
      showToast('error', 'Something went wrong', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='overflow-hidden bg-card transition-all hover:shadow-lg'>
      <CardHeader className='space-y-0 pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-xl'>
            <span className='line-clamp-3 pr-2 capitalize'>{service.name}</span>
          </CardTitle>
          <div className='flex items-center gap-2'>
            <ServiceEditDialog services={service} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                  <MoreVertical className='size-4' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  disabled={isLoading}
                  onClick={deleteHandler}
                  className='text-destructive focus:bg-destructive focus:text-destructive-foreground'
                >
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
                      <Trash className='mr-2 size-4' />
                      Delete
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
            <Key className='size-4' />
            API Key
          </div>
          <div className='relative'>
            <Input
              value={service.value}
              disabled
              className='pr-16 font-mono text-sm'
            />
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleCopy(service.value)}
              className='absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent'
            >
              {!copied ? (
                <Copy className='size-4' />
              ) : (
                <CircleCheck className='size-4 text-green-500' />
              )}
              <span className='sr-only'>Copy API key</span>
            </Button>
          </div>
        </div>

        <div className='flex flex-col gap-2 rounded-lg bg-muted p-3'>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-medium'>Expiry Date</span>
            <span className='text-sm tabular-nums'>{service.expDate}</span>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <span className='text-sm font-medium'>Service Link</span>
            <a
              href={service.link}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 text-sm text-primary hover:underline'
            >
              Visit
              <ExternalLink className='size-3' />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
