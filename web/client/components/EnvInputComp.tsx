'use client'

import { deleteEnvById, udpateEnvById } from '@/actions/saveEnvs'
import { showToast } from '@/toast'
import { Envs } from '@/types/types'
import { useAuth } from '@clerk/nextjs'
import { Copy, Eye, EyeOff, Key, Pencil, Trash2, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'

export default function EnvInputComp({
  pairs,
  index
}: {
  pairs: Envs
  index: number
}) {
  const { theme } = useTheme()
  const { userId } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [name, setName] = useState<string>(pairs.name)
  const [value, setValue] = useState<string>(pairs.value)
  const [showValue, setShowValue] = useState<boolean>(false)

  if (!userId || !pairs) {
    return null
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      if (!pairs.id) {
        showToast('error', 'Id must be provided', theme)
        return
      }

      const response = await deleteEnvById(pairs.id)

      if (response) {
        showToast('success', `Environment variable deleted`, theme)
      } else {
        throw new Error('Failed to delete environment variable')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      showToast('error', errorMessage, theme)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      if (name === pairs.name && value === pairs.value) {
        showToast('error', 'No changes to update', theme)
        setIsEditing(false)
        return
      }
      const response = await udpateEnvById(userId, pairs.id, name, value)
      if (response) {
        showToast('success', 'Environment variable updated', theme)
        setIsEditing(false)
      } else {
        throw new Error('Failed to update environment variable')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      showToast('error', errorMessage, theme)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', 'Copied to clipboard', theme)
    })
  }

  return (
    <Card className='w-full overflow-hidden transition-all duration-200 hover:shadow-md'>
      <CardContent className='p-4'>
        <div className='flex flex-col space-y-4'>
          <div className='flex items-center justify-between'>
            {/* <Badge variant='outline' className='text-xs font-normal'>
              ENV #{index + 1}
            </Badge> */}
            <div className='flex space-x-2'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => setIsEditing(!isEditing)}
                      className='h-8 w-8 text-muted-foreground hover:text-primary'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isEditing ? 'Cancel Edit' : 'Edit'}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={handleDelete}
                      disabled={isLoading}
                      className='h-8 w-8 text-muted-foreground hover:text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                disabled={!isEditing}
                placeholder='Name'
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full pl-9 pr-4 ${!isEditing ? 'bg-muted' : 'bg-background'}`}
              />
            </div>
            <div className='relative'>
              <Key className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                disabled={!isEditing}
                placeholder='API KEY'
                value={value}
                onChange={e => setValue(e.target.value)}
                className={`w-full pl-9 pr-20 ${!isEditing ? 'bg-muted' : 'bg-background'}`}
                type={showValue ? 'text' : 'password'}
              />
              <div className='absolute right-2 top-1/2 -translate-y-1/2 space-x-1'>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setShowValue(!showValue)}
                  className='h-7 w-7 text-muted-foreground hover:text-primary'
                >
                  {showValue ? (
                    <EyeOff className='h-3 w-3' />
                  ) : (
                    <Eye className='h-3 w-3' />
                  )}
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => copyToClipboard(value)}
                  className='h-7 w-7 text-muted-foreground hover:text-primary'
                >
                  <Copy className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>
          {isEditing && (
            <div className='flex justify-end space-x-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  setName(pairs.name)
                  setValue(pairs.value)
                  setIsEditing(false)
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button size='sm' onClick={handleUpdate} disabled={isLoading}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
