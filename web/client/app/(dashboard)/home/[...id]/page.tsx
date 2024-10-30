import { getEnvsByProjectSlug } from '@/actions/saveEnvs'
import { getSharedUserByProjectSlug } from '@/actions/shared'
import { getAllUserDetails } from '@/actions/user'
import AccessComp from '@/components/AccessComp'
import SecretComp from '@/components/SecretComp'
import ServiceComp from '@/components/ServiceComp'
import SettingsComp from '@/components/SettingsComp'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'

const Page = async ({ params }: { params: { id: string[] } }) => {
  const { userId } = auth()
  if (!userId) {
    return
  }
  const projectDetails = await getEnvsByProjectSlug(params.id[0], userId)
  const allUserDetails = await getAllUserDetails()
  const sharedUserDetails = await getSharedUserByProjectSlug(params.id[0])

  if (!projectDetails || !allUserDetails || !sharedUserDetails) {
    return (
      <>
        <p className='flex flex-row justify-center text-xl text-violet-600'>
          Project not found.
        </p>
      </>
    )
  }

  return (
    <div className=''>
      <Tabs defaultValue='account' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start gap-0 rounded-none border-b bg-inherit pb-4'>
          <TabsTrigger value='account'>Secrets</TabsTrigger>
          <TabsTrigger value='services'>Service</TabsTrigger>
          <TabsTrigger value='password'>Access</TabsTrigger>
          <TabsTrigger value='setting'>Setting</TabsTrigger>
        </TabsList>
        <TabsContent value='account' className='flex flex-col gap-4 sm:px-4'>
          <SecretComp projectDetails={projectDetails} />
        </TabsContent>
        <TabsContent value='services' className='flex flex-col gap-4 sm:px-4'>
          <ServiceComp />
        </TabsContent>
        <TabsContent value='password' className='px-4'>
          {allUserDetails && projectDetails && sharedUserDetails && (
            <AccessComp
              users={allUserDetails}
              projectId={projectDetails.id}
              projectUsers={sharedUserDetails}
            />
          )}
        </TabsContent>
        <TabsContent value='setting' className='px-4'>
          <SettingsComp />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
