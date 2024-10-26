import { FaPlusSquare } from 'react-icons/fa'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { auth } from '@clerk/nextjs/server'
import { getPublicKey } from '@/actions/user'
import GenKeyButton from './GenKeyButton'
import PrivateKeyInput from './PrivateKeyInput'

const SettingsComp = async () => {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const userDetails = await getPublicKey(userId)

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-xl font-bold'>Your keys</p>
        <GenKeyButton userDetails={userDetails} />
      </div>
      <div>
        {(!userDetails || !userDetails.publicKey) && (
          <p className='flex flex-row justify-center'>No keys found</p>
        )}
        {userDetails && userDetails.publicKey && (
          <div className='flex flex-row gap-2'>
            <Input
              placeholder='Public key'
              className='bg-card dark:bg-neutral-900'
              value={userDetails?.publicKey || ''}
              disabled
            />
            <PrivateKeyInput />
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsComp
