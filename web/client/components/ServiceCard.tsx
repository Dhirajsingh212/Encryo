'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { showToast } from '@/toast'
import { Service } from '@/types/types'
import { CircleCheck, Copy } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

const ServiceCard = ({ service }: { service: Service }) => {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value)
    showToast('success', 'copied to clipboard', theme)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl capitalize'>{service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <span className='text-sm font-bold'>API Key:</span>
          <div className='relative my-2'>
            <Input value={service.value} disabled className='pr-16' />
            <Button
              variant='outline'
              onClick={() => handleCopy(service.value)}
              className='absolute right-1 top-1/2 flex -translate-y-1/2 transform items-center gap-1'
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
