import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex h-screen w-full flex-row items-center justify-center'>
      <SignIn />
    </div>
  )
}
