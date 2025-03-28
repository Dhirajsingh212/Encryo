'use client'

import { setPulbicKey } from '@/actions/user'
import { generateKeyPair } from '@/lib/key'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { FaPlusSquare } from 'react-icons/fa'
import { Button } from './ui/button'
import Spinner from './Spinner'

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
      showToast('error', 'Something went wrong', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button disabled={isLoading} className='' onClick={clickHandler}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <FaPlusSquare className='mr-2' />
          Generate keys
        </>
      )}
    </Button>
  )
}

export default GenKeyButton
