import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex h-screen w-full flex-row items-center justify-center'>
      <SignUp />
    </div>
  )
}
