'use client'

import { setPulbicKey } from '@/actions/user'
import { generateKeyPair } from '@/lib/key'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { FaPlusSquare } from 'react-icons/fa'
import { Button } from './ui/button'

const GenKeyButton = () => {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { userId } = useAuth()
  const clickHandler = async () => {
    try {
      if (!userId) {
        throw new Error('User Not logged in.')
      }
      setIsLoading(true)
      const pairs = await generateKeyPair()
      if (await setPulbicKey(userId, pairs.publicKey, pairs.privateKey)) {
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
    <Button disabled={isLoading} className='' onClick={clickHandler}>
      <FaPlusSquare className='mr-2' />
      Generate keys
    </Button>
  )
}

export default GenKeyButton
