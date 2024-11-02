import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const loading = () => {
  return (
    <div className=''>
      <Tabs defaultValue='account' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start gap-0 rounded-none border-b bg-inherit pb-4'>
          <TabsTrigger value='account'>Secrets</TabsTrigger>
        </TabsList>
        <TabsContent value='account' className='flex flex-col gap-4 sm:px-4'>
          {Array.from({ length: 10 }).map((_, index) => {
            return <Skeleton key={index} className='h-40 w-full' />
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default loading