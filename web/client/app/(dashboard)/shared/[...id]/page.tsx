import { getSharedEnvsByProjectSlug } from '@/actions/saveEnvs'
import SharedSecretComp from '@/components/SharedSecretComp'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'

const Page = async ({ params }: { params: { id: string[] } }) => {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const projectDetails = await getSharedEnvsByProjectSlug(params.id[0], userId)

  if (!projectDetails) {
    return (
      <div className='flex flex-row justify-center py-4'>
        <p className='text-xl font-bold text-violet-600'>
          You cannot access this project
        </p>
      </div>
    )
  }

  return (
    <div className=''>
      <Tabs defaultValue='account' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start border-b bg-inherit pb-4'>
          <TabsTrigger value='account'>Secrets</TabsTrigger>
        </TabsList>
        <TabsContent value='account' className='flex flex-col gap-4 sm:px-4'>
          <SharedSecretComp projectDetails={projectDetails} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
