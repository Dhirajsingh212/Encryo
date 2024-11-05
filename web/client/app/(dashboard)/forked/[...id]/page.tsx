import { getGithubFilesByProjectSlug } from '@/actions/githubFile'
import GithubCreateFile from '@/components/GithubCreateFile'
import SettingsComp from '@/components/SettingsComp'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@clerk/nextjs/server'

const Page = async ({ params }: { params: { id: string[] } }) => {
  const { userId } = auth()
  if (!userId) {
    return null
  }

  const githubFileDetails = await getGithubFilesByProjectSlug(params.id[0])

  return (
    <div className=''>
      <Tabs defaultValue='files' className='w-full sm:px-4'>
        <TabsList className='mb-4 w-full justify-start gap-0 rounded-none border-b bg-inherit pb-4'>
          <TabsTrigger value='files'>Files</TabsTrigger>
          <TabsTrigger value='setting'>Setting</TabsTrigger>
        </TabsList>
        <TabsContent value='files' className='flex flex-col gap-4 sm:px-4'>
          <GithubCreateFile githubFiles={githubFileDetails?.files} />
        </TabsContent>
        <TabsContent value='setting' className='px-4'>
          <SettingsComp />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
