'use client'
import { deleteEnvById, udpateEnvById } from '@/actions/saveEnvs'
import { showToast } from '@/toast'
import { Envs } from '@/types/types'
import { useAuth } from '@clerk/nextjs'
import { Key, Pencil, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { AiFillCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { FaTrash } from 'react-icons/fa'
import { Button } from './ui/button'
import { Input } from './ui/input'

const EnvInputComp = ({ pairs, index }: { pairs: Envs; index: number }) => {
  const { theme } = useTheme()
  const { userId } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const [name, setName] = useState<string>(pairs.name)
  const [value, setValue] = useState<string>(pairs.value)

  if (!userId || !pairs) {
    return null
  }

  return (
    <div className='flex flex-col items-center gap-2 py-2 md:flex-row'>
      <div className='relative w-full'>
        <User className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        <Input
          disabled={isDisabled}
          placeholder='Name'
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
          className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
        />
      </div>
      <div className='relative w-full'>
        <Key className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
        <Input
          disabled={isDisabled}
          placeholder='API KEY'
          value={value}
          onChange={e => {
            setValue(e.target.value)
          }}
          className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
        />
      </div>
      {isDisabled && (
        <Button
          className='w-full md:mt-0 md:w-16'
          variant='outline'
          onClick={() => {
            setIsDisabled((prev: boolean) => {
              return !prev
            })
          }}
        >
          <Pencil className='size-3' />
        </Button>
      )}
      {isDisabled && (
        <Button
          disabled={isLoading}
          onClick={async () => {
            try {
              setIsLoading(true)
              if (!pairs.id) {
                showToast('error', 'Id must be provided', theme)
                return
              }

              const response = await deleteEnvById(pairs.id)

              if (response) {
                showToast('success', `Deleted.`, theme)
              } else {
                throw new Error('Something went wrong')
              }
            } catch (err) {
              const errorMessage =
                err instanceof Error
                  ? err.message
                  : 'An unexpected error occurred'
              showToast('error', errorMessage, theme)
            } finally {
              setIsLoading(false)
            }
          }}
          variant='destructive'
          className='mt-2 w-full md:mt-0 md:w-10'
        >
          <FaTrash />
        </Button>
      )}

      <div className='flex flex-row gap-1 max-sm:w-full'>
        {!isDisabled && (
          <Button
            variant='outline'
            disabled={isLoading}
            className='w-full md:w-16'
            onClick={async () => {
              try {
                setIsLoading(true)
                if (name === pairs.name && value === pairs.value) {
                  showToast('success', 'env updated', theme)
                  return
                }
                const response = await udpateEnvById(
                  userId,
                  pairs.id,
                  name,
                  value
                )
                if (response) {
                  showToast('success', 'env value updated', theme)
                  return
                } else {
                  throw new Error('Something went wrong')
                }
              } catch (err) {
                const errorMessage =
                  err instanceof Error
                    ? err.message
                    : 'An unexpected error occurred'
                showToast('error', errorMessage, theme)
              } finally {
                setIsLoading(false)
                setIsDisabled((prev: boolean) => {
                  return !prev
                })
              }
            }}
          >
            <AiFillCheckCircle className='fill-green-500' />
          </Button>
        )}
        {!isDisabled && (
          <Button
            disabled={isLoading}
            variant='outline'
            className='w-full md:w-16'
            onClick={() => {
              setName(pairs.name)
              setValue(pairs.value)
              setIsDisabled((prev: boolean) => {
                return !prev
              })
            }}
          >
            <AiOutlineCloseCircle className='fill-rose-500' />
          </Button>
        )}
      </div>
    </div>
  )
}

export default EnvInputComp
