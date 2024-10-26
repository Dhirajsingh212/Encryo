import { getPublicKey } from '@/actions/user'
import { auth } from '@clerk/nextjs/server'
import GenKeyButton from './GenKeyButton'
import { Input } from './ui/input'

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
        {(!userDetails ||
          !userDetails.publicKey ||
          !userDetails.privateKey) && <GenKeyButton />}
      </div>
      <div>
        {(!userDetails ||
          !userDetails.publicKey ||
          !userDetails.privateKey) && (
          <p className='flex flex-row justify-center'>No keys found</p>
        )}
        {userDetails && userDetails.publicKey && userDetails.privateKey && (
          <div className='flex flex-row gap-2'>
            <Input
              placeholder='Public key'
              className='bg-card dark:bg-neutral-900'
              value={userDetails?.publicKey || ''}
              disabled
            />
            <Input
              placeholder='Private key'
              className='bg-card dark:bg-neutral-900'
              disabled
              value={userDetails?.privateKey || ''}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsComp
