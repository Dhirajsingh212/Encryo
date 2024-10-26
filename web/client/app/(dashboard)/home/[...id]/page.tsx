import { getEnvsByProjectSlug } from '@/actions/saveEnvs'
import HomePageCreateMenu from '@/components/HomePageCreateMenu'
import SettingsComp from '@/components/SettingsComp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'
import { Key, Search, User } from 'lucide-react'
import { FaTrash } from 'react-icons/fa'

const Page = async ({ params }: { params: { id: string[] } }) => {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const projectDetails = await getEnvsByProjectSlug(params.id[0], userId)

  return (
    <div className=''>
      <Tabs defaultValue='account' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start border-b bg-inherit pb-4'>
          <TabsTrigger value='account'>Secrets</TabsTrigger>
          <TabsTrigger value='password'>Access</TabsTrigger>
          <TabsTrigger value='setting'>Setting</TabsTrigger>
        </TabsList>
        <TabsContent value='account' className='flex flex-col gap-4 sm:px-4'>
          <div className='flex flex-col gap-2 md:flex-row md:justify-between'>
            <p className='text-xl font-semibold'>{`Active(5)`}</p>
            <div className='flex flex-row justify-end gap-4'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <Input
                  placeholder='Search for secret'
                  className='border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                />
              </div>
              <HomePageCreateMenu />
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            {projectDetails &&
              projectDetails.envs &&
              projectDetails.envs.map((pairs, index) => {
                return (
                  <div
                    key={index}
                    className='flex flex-col items-center gap-4 py-2 md:flex-row'
                  >
                    <div className='relative w-full'>
                      <User className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                      <Input
                        disabled
                        placeholder='Name'
                        value={pairs.name}
                        className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                      />
                    </div>
                    <div className='relative w-full'>
                      <Key className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                      <Input
                        disabled
                        placeholder='API KEY'
                        value={pairs.value}
                        className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                      />
                    </div>
                    <Button
                      variant='destructive'
                      className='mt-2 w-full md:mt-0 md:w-10'
                    >
                      <FaTrash />
                    </Button>
                  </div>
                )
              })}
          </div>
        </TabsContent>
        <TabsContent value='password' className='px-4'>
          Change your password here.
        </TabsContent>
        <TabsContent value='setting' className='px-4'>
          <SettingsComp />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
