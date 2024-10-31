'use client'

import { deleteServiceById } from '@/actions/service'
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
import { CircleCheck, Copy, EllipsisVertical, Trash } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import ServiceCompEditDialog from './ServiceCompEditDialog'

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
      await deleteServiceById(service.id)
      showToast('success', 'deleted successfully', theme)
    } catch (err) {
      console.log(err)
      showToast('error', 'something went wrong', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='bg-card'>
      <CardHeader>
        <div className='flex flex-row justify-between'>
          <CardTitle className='text-xl capitalize'>{service.name}</CardTitle>
          <div className='flex flex-row items-center gap-1'>
            <ServiceCompEditDialog services={service} />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className='size-4' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  disabled={isLoading}
                  onClick={deleteHandler}
                  className='focus:bg-violet-600 focus:text-white'
                >
                  <Trash className='mr-2 size-4' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>
          <span className='text-sm font-bold'>API Key:</span>
          <div className='relative my-2'>
            <Input value={service.value} disabled className='pr-16' />
            <Button
              variant='outline'
              onClick={() => handleCopy(service.value)}
              className='absolute right-0 top-1/2 flex -translate-y-1/2 transform items-center gap-1'
              size='sm'
            >
              {!copied ? (
                <Copy className='h-4 w-4' />
              ) : (
                <CircleCheck className='h-4 w-4' />
              )}
            </Button>
          </div>
        </p>
        <p>
          <strong>Expiry Date:</strong> {service.expDate}
        </p>
        <p>
          <strong>Link:</strong>{' '}
          <a
            href={service.link}
            target='_blank'
            rel='noopener noreferrer'
            className='flex-wrap break-words text-blue-500 hover:underline'
          >
            {service.link}
          </a>
        </p>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
