'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Component() {
  const [open, setOpen] = useState(false)
  const [envInput, setEnvInput] = useState('')
  const [parsedEnv, setParsedEnv] = useState<Record<string, string> | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  const parseEnv = () => {
    setError(null)
    setParsedEnv(null)

    try {
      const lines = envInput.split('\n')
      const envObject: Record<string, string> = {}

      lines.forEach(line => {
        line = line.trim()
        if (line && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=')
          const value = valueParts.join('=').trim()
          if (key && value) {
            envObject[key.trim()] = value.replace(/^['"]|['"]$/g, '') // Remove surrounding quotes if present
          }
        }
      })

      if (Object.keys(envObject).length === 0) {
        throw new Error('No valid environment variables found')
      }

      setParsedEnv(envObject)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while parsing'
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='w-full rounded-sm px-2 py-1 text-start text-sm hover:bg-violet-600 hover:text-white'>
        Add Envs
      </DialogTrigger>
      <DialogContent className='w-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white max-lg:max-h-[90%] max-lg:overflow-auto max-sm:w-[280px] max-sm:overflow-x-scroll max-sm:rounded-lg sm:max-w-[425px] md:max-w-[600px] lg:max-h-full lg:max-w-[800px] xl:max-w-[1000px]'>
        <DialogHeader>
          <DialogTitle>Parse ENV Variables</DialogTitle>
          <DialogDescription>
            Paste your environment variables here. We'll parse them for you.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4'>
          <Textarea
            placeholder='Paste your ENV variables here...'
            value={envInput}
            onChange={e => setEnvInput(e.target.value)}
            className='h-40 w-full resize-none'
          />
          <Button onClick={parseEnv} className='w-full sm:w-auto'>
            Parse
          </Button>
        </div>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {parsedEnv && (
          <div className='mt-4 max-h-[300px] overflow-y-auto'>
            <h3 className='mb-2 text-lg font-semibold'>Parsed Variables:</h3>
            <pre className='overflow-x-auto break-words rounded-md bg-muted bg-slate-800 p-2 text-sm text-white'>
              {JSON.stringify(parsedEnv, null, 2)}
            </pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
