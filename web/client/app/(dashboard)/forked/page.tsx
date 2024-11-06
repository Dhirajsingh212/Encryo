import { getGithubProjectDetailsByUserID } from '@/actions/githubProject'
import { Card, CardContent } from '@/components/ui/card'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function Component() {
  const { userId } = auth()
  if (!userId) {
    return null
  }

  const projects = await getGithubProjectDetailsByUserID(userId)

  return (
    <div className='container mx-auto px-2 sm:px-4'>
      <h1 className='mb-6 text-center text-3xl font-bold'>Your Projects</h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {projects && projects.length === 0 && (
          <p className='flex flex-row justify-start pt-4 text-xl font-bold text-violet-600'>
            No project created yet.
          </p>
        )}
        {projects &&
          projects.map((project: any, index: number) => (
            <div
              key={index}
              className='group transform transition-transform duration-300 hover:scale-105'
            >
              <Card className='min-h-32 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 transition-shadow duration-300 hover:shadow-lg'>
                <CardContent className='p-6'>
                  <div className='flex flex-row justify-between'>
                    <Link href={`/forked/${project.name}`}>
                      <h2 className='mb-2 line-clamp-2 flex-wrap break-words text-xl font-semibold text-primary'>
                        {project.name}
                      </h2>
                    </Link>
                  </div>
                  <p className='mb-4 text-muted-foreground'>
                    Created on:
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
    </div>
  )
}
