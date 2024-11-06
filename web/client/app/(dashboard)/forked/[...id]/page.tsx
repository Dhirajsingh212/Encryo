import { getGithubFilesByProjectSlug } from '@/actions/githubFile'
import { getServicesDataByProjectSlug } from '@/actions/githubService'
import { getSharedUserByProjectSlug } from '@/actions/githubShared'
import { getAllUserDetails } from '@/actions/user'
import AccessComp from '@/components/AccessComp'
import GithubCreateFile from '@/components/GithubCreateFile'
import GithubService from '@/components/GithubService'
import SettingsComp from '@/components/SettingsComp'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'

const Page = async ({ params }: { params: { id: string[] } }) => {
  const { userId } = auth()
  if (!userId) {
    return null
  }

  const githubFileDetails = await getGithubFilesByProjectSlug(
    params.id[0],
    userId
  )
  const sharedUserDetails = await getSharedUserByProjectSlug(params.id[0])
  const allUserDetails = await getAllUserDetails()
  const servicesData = await getServicesDataByProjectSlug(params.id[0])

  if (!githubFileDetails) {
    return (
      <div>
        <p className='text-xl font-semibold text-violet-600'>
          Project not added to personal
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
          <TabsTrigger value='shared'>Access</TabsTrigger>
          <TabsTrigger value='setting'>Setting</TabsTrigger>
        </TabsList>
        <TabsContent value='files' className='flex flex-col gap-4 sm:px-4'>
          <GithubCreateFile githubFiles={githubFileDetails?.files} />
        </TabsContent>
        <TabsContent value='service' className='flex flex-col gap-4 sm:px-4'>
          <GithubService services={servicesData || []} />
        </TabsContent>
        <TabsContent value='shared' className='flex flex-col gap-4 sm:px-4'>
          <div className='flex flex-col gap-4'>
            <div>
              <p className='text-2xl font-semibold'>Access</p>
            </div>
            <div>
              {allUserDetails && githubFileDetails && sharedUserDetails && (
                <AccessComp
                  users={allUserDetails}
                  projectId={githubFileDetails.id}
                  projectUsers={sharedUserDetails}
                />
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value='setting' className='px-4'>
          <SettingsComp />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
