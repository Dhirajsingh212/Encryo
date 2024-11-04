import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const loading = () => {
  return (
    <div className=''>
      <Tabs defaultValue='files' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start gap-0 rounded-none border-b bg-inherit pb-4'>
          <TabsTrigger value='files'>Files</TabsTrigger>
          <TabsTrigger value='cli'>CLI</TabsTrigger>
          <TabsTrigger value='setting'>Setting</TabsTrigger>
        </TabsList>
        <TabsContent value='files' className='flex flex-col gap-4 sm:px-4'>
          {Array.from({ length: 10 }).map((_, index) => {
            return <Skeleton key={index} className='h-40 w-full' />
          })}
        </TabsContent>
        <TabsContent
          value='cli'
          className='grid grid-cols-1 gap-4 sm:px-4 md:grid-cols-2 lg:grid-cols-3'
        >
          {Array.from({ length: 10 }).map((_, index) => {
            return <Skeleton key={index} className='h-40 w-full' />
          })}
        </TabsContent>
        <TabsContent value='setting' className='px-4'>
          {Array.from({ length: 1 }).map((_, index) => {
            return <Skeleton key={index} className='h-40 w-full' />
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default loading
