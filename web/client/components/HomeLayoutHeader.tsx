'use client'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import { useParams, usePathname } from 'next/navigation'

const HomeLayoutHeader = () => {
  const path = usePathname()
  const pathLength = path.split('/').length

  return (
    <header className='flex h-16 shrink-0 flex-row items-center justify-between gap-2'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='size-4' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            {pathLength >= 3 && (
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink
                  href={`/${path.split('/')[1]}`}
                  className='capitalize'
                >
                  {path.split('/')[1]}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {pathLength >= 3 && (
              <BreadcrumbSeparator className='hidden md:block' />
            )}
            <BreadcrumbItem>
              {pathLength >= 3 && (
                <BreadcrumbPage className='capitalize'>
                  {path.split('/')[2]}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex flex-row items-center'>
        <ThemeToggle />
        <UserButton />
      </div>
    </header>
  )
}

export default HomeLayoutHeader
