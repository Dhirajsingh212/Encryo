import { getSharedProjectByUserId } from '@/actions/project'
import { Card, CardContent } from '@/components/ui/card'
import { auth } from '@clerk/nextjs/server'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function Component() {
  const { userId } = auth()
  if (!userId) {
    return null
  }
  const projects = await getSharedProjectByUserId(userId)

  return (
    <div className='container mx-auto px-2 sm:px-4'>
      <h1 className='mb-6 text-center text-3xl font-bold'>
        Your Shared Projects
      </h1>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {projects && projects.length === 0 && (
          <p className='flex flex-row justify-start pt-4 text-xl font-bold text-violet-600'>
            No project created yet.
          </p>
        )}
        {projects &&
          projects.map((element, index) => (
            <div
              key={index}
              className='transform transition-transform duration-300 hover:scale-105'
            >
              <Card className='min-h-40 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 transition-shadow duration-300 hover:shadow-lg'>
                <CardContent className='p-6'>
                  <Link href={`/shared/${element.project.slug}`}>
                    <h2 className='mb-2 line-clamp-1 flex-wrap break-words text-2xl font-semibold text-primary'>
                      {element.project.name}
                    </h2>
                  </Link>
                  <p className='mb-4 text-muted-foreground'>
                    Created on:{' '}
                    {new Date(element.project.createdAt).toLocaleDateString()}
                  </p>
                  {element.project.link && (
                    <Link
                      href={element.project.link}
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
