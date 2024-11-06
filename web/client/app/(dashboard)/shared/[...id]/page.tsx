import { getServicesDataByProjectSlug } from '@/actions/githubService'
import { getSharedProjectDetailsByUserIdAndSlug } from '@/actions/sharedProject'
import GithubSharedWriteAccess from '@/components/GithubSharedWriteAccess'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'

const Page = async ({ params }: { params: { id: string[] } }) => {
  const { userId } = auth()
  if (!userId) {
    return null
  }

  const githubFileDetails = await getSharedProjectDetailsByUserIdAndSlug(
    userId,
    params.id[0]
  )
  // const servicesData = await getServicesDataByProjectSlug(params.id[0])

  if (!githubFileDetails) {
    return (
      <div>
        <p className='text-xl font-semibold text-violet-600'>
          You are not authorized to access this
        </p>
      </div>
    )
  }

  return (
    <div className=''>
      <Tabs defaultValue='files' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start gap-0 rounded-none border-b bg-inherit pb-4'>
          <TabsTrigger value='files'>Files</TabsTrigger>
          <TabsTrigger value='service'>Services</TabsTrigger>
        </TabsList>
        <TabsContent value='files' className='flex flex-col gap-4 sm:px-4'>
          <GithubSharedWriteAccess
            access={githubFileDetails.access}
            githubFiles={githubFileDetails.decryptedData}
          />
        </TabsContent>
        <TabsContent value='service' className='flex flex-col gap-4 sm:px-4'>
          {/* <GithubService services={servicesData || []} /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
