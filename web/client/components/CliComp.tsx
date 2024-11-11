'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { Check, Copy, Terminal } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export default function CliComp({ hashedCommand }: { hashedCommand: string }) {
  const { userId } = useAuth()
  const [copiedStates, setCopiedStates] = useState([false, false, false])
  const { theme } = useTheme()

  if (!userId) {
    return null
  }

  const commands = [
    `curl -X POST -H "Content-Type: application/json" -d '{"data":"${hashedCommand}"}' ${process.env.NEXT_PUBLIC_EMAIL_URL}api/getFiles --output download.zip`,
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
            <code className='custom-scrollbar flex-wrap overflow-x-scroll break-all px-6 py-4 text-sm'>
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
