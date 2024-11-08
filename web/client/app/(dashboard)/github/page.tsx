import { fetchUserRepos } from '@/actions/github'
import { Card, CardContent } from '@/components/ui/card'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function Component() {
  const { userId } = auth()
  if (!userId) {
    return null
  }

  const user = await clerkClient().users.getUser(userId)

  const githubUser = user.externalAccounts.find(
    account => account.provider === 'oauth_github'
  )

  const projects = githubUser
    ? await fetchUserRepos(githubUser.username || '')
    : []

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
              <Card className='min-h-40 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 transition-shadow duration-300 hover:shadow-lg'>
                <CardContent className='p-6'>
                  <div className='flex flex-row justify-between'>
                    <Link href={`/github/${project.name}`} className='w-[80%]'>
                      <h2 className='mb-2 line-clamp-2 flex-wrap break-words text-xl font-semibold text-primary'>
                        {project.name}
                      </h2>
                    </Link>
                  </div>
                  <p className='mb-4 text-muted-foreground'>
                    Created on:{' '}
                    {format(new Date(project.created_at), 'do MMMM yy')}
                  </p>
                  {project.html_url && (
                    <Link
                      href={project.html_url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center text-secondary-foreground transition-colors duration-200 hover:text-blue-600'
                    >
                      Visit Project
                      <ExternalLink className='ml-2 h-4 w-4' />
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
    </div>
  )
}
