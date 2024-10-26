'use client'

import { setPulbicKey } from '@/actions/user'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { generateKeyPair } from '@/lib/key'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { FaPlusSquare } from 'react-icons/fa'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { CopyIcon } from 'lucide-react'

const GenKeyButton = ({ userDetails }: any) => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useLocalStorage('Encryo_private_key', '')
  const { userId } = useAuth()

  const clickHandler = async () => {
    try {
      if (!userId) {
        throw new Error('User Not logged in.')
      }

      setIsLoading(true)
      const pairs = await generateKeyPair()
      const publicKeySet = await setPulbicKey(userId, pairs.publicKey)

      if (publicKeySet) {
        setValue(pairs.privateKey)
        setOpen(true)
        showToast('success', 'Keys generated', theme)
      }
    } catch (err) {
      console.log(err)
      showToast('error', JSON.stringify(err), theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {(!userDetails || !userDetails.publicKey) && (
        <Button disabled={isLoading} className='' onClick={clickHandler}>
          <FaPlusSquare className='mr-2' />
          Generate keys
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>
            <CopyIcon className='mr-2 size-4' />
            Copy
          </Button>
        </DialogTrigger>
        <DialogContent className='w-[80%] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'>
          <DialogHeader>
            <DialogTitle className='flex-wrap break-words py-4'>
              {`Save this private key for future use if lost, you won't be able to decode your envs.`}
            </DialogTitle>
            <DialogDescription className='rounded-lg bg-slate-900 p-4'>
              <ScrollArea className='container h-40 max-w-[180px] whitespace-pre-wrap break-words p-2 sm:max-w-sm'>
                {value}
              </ScrollArea>
            </DialogDescription>
            <Button
              className='mt-8'
              onClick={() => {
                navigator.clipboard
                  .writeText(value)
                  .then(() => {
                    showToast('success', 'Key copied to clipboard!', theme)
                  })
                  .catch(err => {
                    console.error('Failed to copy: ', err)
                    showToast('error', 'Failed to copy key.', theme)
                  })
              }}
            >
              Copy Key
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GenKeyButton
