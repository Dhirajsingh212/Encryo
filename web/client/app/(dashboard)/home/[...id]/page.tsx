import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Key, PlusCircleIcon, Search, User } from 'lucide-react'

const Page = () => {
  return (
    <div className=''>
      <Tabs defaultValue='account' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start border-b bg-inherit pb-4'>
          <TabsTrigger value='account'>Secrets</TabsTrigger>
          <TabsTrigger value='password'>Access</TabsTrigger>
        </TabsList>
        <TabsContent value='account' className='flex flex-col gap-4 sm:px-4'>
          <div className='flex flex-col gap-2 md:flex-row md:justify-between'>
            <p className='text-xl font-semibold'>{`Active(5)`}</p>
            <div className='flex flex-row gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Search for secret'
                  className='border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                />
              </div>
              <Button className='flex items-center'>
                <PlusCircleIcon className='mr-1 size-4' />
                Add new secret
              </Button>
            </div>
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='Name'
                className='border-2 bg-card py-6 pl-10 pr-4 dark:border-input dark:bg-neutral-900'
              />
            </div>
            <div className='relative'>
              <Key className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
              <Input
                placeholder='API KEY'
                className='border-2 bg-card py-6 pl-10 pr-4 dark:border-input dark:bg-neutral-900'
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value='password' className='px-4'>
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
