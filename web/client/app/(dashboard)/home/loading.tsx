import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-row justify-center'>
        <Skeleton className='h-10 w-72' />
      </div>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 5 }).map((_, index) => {
          return <Skeleton key={index} className='h-40 w-full' />
        })}
      </div>
    </div>
  )
}

export default Loading
