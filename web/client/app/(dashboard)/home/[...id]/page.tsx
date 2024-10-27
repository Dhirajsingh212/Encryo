import { getEnvsByProjectSlug } from '@/actions/saveEnvs'
import SecretComp from '@/components/SecretComp'
import SettingsComp from '@/components/SettingsComp'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'
import AccessComp from '@/components/AccessComp'
import { getAllUserDetails } from '@/actions/user'

const Page = async ({ params }: { params: { id: string[] } }) => {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const projectDetails = await getEnvsByProjectSlug(params.id[0], userId)
  const allUserDetails = await getAllUserDetails();

  console.log(allUserDetails)

  return (
    <div className=''>
      <Tabs defaultValue='account' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start border-b bg-inherit pb-4'>
          <TabsTrigger value='account'>Secrets</TabsTrigger>
          <TabsTrigger value='password'>Access</TabsTrigger>
          <TabsTrigger value='setting'>Setting</TabsTrigger>
        </TabsList>
        <TabsContent value='account' className='flex flex-col gap-4 sm:px-4'>
          <SecretComp projectDetails={projectDetails} />
        </TabsContent>
        <TabsContent value='password' className='px-4'>
          {allUserDetails && <AccessComp />}
        </TabsContent>
        <TabsContent value='setting' className='px-4'>
          <SettingsComp />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
