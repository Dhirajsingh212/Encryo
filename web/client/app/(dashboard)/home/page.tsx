import { Input } from '@/components/ui/input'

const Page = () => {
  return (
    <div className='px-4'>
      <p className='pb-4 text-2xl font-bold'>Add your api keys:</p>
      <div className='grid grid-cols-2 gap-4'>
        <Input
          placeholder='API KEY'
          className='rounded-none border-2 border-violet-600 dark:bg-violet-950'
        />
      </div>
    </div>
  )
}

export default Page
