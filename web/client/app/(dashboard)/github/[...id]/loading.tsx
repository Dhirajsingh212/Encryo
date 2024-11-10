import { Skeleton } from '@/components/ui/skeleton'

const loading = () => {
  return (
    <div className=''>
      {Array.from({ length: 1 }).map((_, index) => {
        return <Skeleton key={index} className='h-screen w-full' />
      })}
    </div>
  )
}

export default loading
