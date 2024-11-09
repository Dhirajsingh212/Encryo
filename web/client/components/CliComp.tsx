'use client'

import { useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy, Terminal } from 'lucide-react'
import { showToast } from '@/toast'
import { useTheme } from 'next-themes'

export default function CliComp() {
  const { userId } = useAuth()
  const path = usePathname()
  const [copiedStates, setCopiedStates] = useState([false, false, false])
  const { theme } = useTheme()

  if (!userId) {
    return null
  }

  const slug = path.split('/')[2]
  const isShared = path.split('/')[1] === 'shared'

  const commands = [
    `curl -X POST -H "Content-Type: application/json" -d '{"userId":"${userId}", "slug":"${slug}", "shared":"${isShared}"}' http://localhost:3000/api/getFiles --output download.zip`,
    'unzip download.zip',
    'rm download.zip'
  ]

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    const newCopiedStates = [...copiedStates]
    newCopiedStates[index] = true
    setCopiedStates(newCopiedStates)
    showToast('success', 'Copied to clipboard', theme)
    setTimeout(() => {
      const resetStates = [...newCopiedStates]
      resetStates[index] = false
      setCopiedStates(resetStates)
    }, 2000)
  }

  return (
    <Card className=''>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Terminal className='h-6 w-6' />
          CLI Commands
        </CardTitle>
        <CardDescription>
          Copy and paste these commands to download and extract your files
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {commands.map((command, index) => (
          <div
            key={index}
            className='flex items-center justify-between rounded-md bg-muted p-2'
          >
            <code className='custom-scrollbar w-full overflow-x-scroll px-6 py-4 text-sm'>
              {command}
            </code>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => copyToClipboard(command, index)}
              className='ml-2 flex-shrink-0'
            >
              {copiedStates[index] ? (
                <Check className='h-4 w-4 text-green-500' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
