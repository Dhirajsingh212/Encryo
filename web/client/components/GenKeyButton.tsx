'use client'

import { FaPlusSquare } from 'react-icons/fa'
import { Button } from './ui/button'
import { generateKeyPair } from '@/lib/key'
import { showToast } from '@/toast'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { setPulbicKey } from '@/actions/user'
import { useAuth } from '@clerk/nextjs'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const GenKeyButton = () => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(true)
  const [value, setValue] = useLocalStorage('Encryo_private_key', '')
  const { userId } = useAuth()
  const clickHandler = async () => {
    try {
      if (!userId) {
        throw new Error('User Not logged in.')
        return
      }
      setIsLoading(true)
      const pairs = await generateKeyPair()
      if (await setPulbicKey(userId, pairs.publicKey)) {
        setValue(pairs.privateKey)
        setOpen(true)
        showToast('success', pairs.privateKey, theme)
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
      <Button disabled={isLoading} className='' onClick={clickHandler}>
        <FaPlusSquare className='mr-2' />
        Generate keys
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='w-[80%] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'>
          <DialogHeader>
            <DialogTitle className='flex-wrap break-words py-4'>
              Save this private key for future use if lost you won't be able to
              decode your envs.
            </DialogTitle>
            <DialogDescription className='rounded-lg bg-slate-900 p-4'>
              <div
                dangerouslySetInnerHTML={{ __html: value }}
                className='container max-h-40 max-w-[180px] overflow-auto whitespace-pre-wrap break-words p-2 sm:max-w-sm'
              ></div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GenKeyButton
