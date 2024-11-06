import { fetchUserRepos } from '@/actions/github'
import { getGithubProjectDetailsByUserID } from '@/actions/githubProject'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { Command, Folder, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { ScrollArea } from './ui/scroll-area'

export default async function AppSidebar() {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const user = await clerkClient().users.getUser(userId)

  const githubUser = user.externalAccounts.find(
    account => account.provider === 'oauth_github'
  )

  const repos = githubUser
    ? await fetchUserRepos(githubUser.username || '')
    : []
  const githubDbProjectDetails = await getGithubProjectDetailsByUserID(userId)

  return (
    <Sidebar variant='inset'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-violet-600 text-sidebar-primary-foreground'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Encyro</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='no-scrollbar'>
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
          <SidebarGroupLabel>
            <Link href='/forked'>Forked projects</Link>
          </SidebarGroupLabel>
          <SidebarMenu>
            <ScrollArea className='max-h-80'>
              {githubDbProjectDetails &&
                githubDbProjectDetails.length === 0 && (
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <span>No records found</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              {githubDbProjectDetails &&
                githubDbProjectDetails.map((item: any) => {
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <Link href={`/forked/${item.name}`}>
                          <span className='capitalize'>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className='sr-only'>More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className='w-48'
                          side='bottom'
                          align='end'
                        >
                          <DropdownMenuItem className='focus:bg-violet-600 focus:text-white'>
                            <Link
                              className='flex w-full flex-row'
                              href={`/forked/${item.name}`}
                            >
                              <Folder className='mr-2 size-4' />
                              <span>View Project</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  )
                })}
            </ScrollArea>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
          <SidebarGroupLabel>
            <Link href='/github'>Github projects</Link>
          </SidebarGroupLabel>
          <SidebarMenu>
            <ScrollArea className='max-h-80'>
              {repos && repos.length === 0 && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <span>No records found</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {repos &&
                repos.map((item: any) => {
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <Link href={`/github/${item.name}`}>
                          <span className='capitalize'>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className='sr-only'>More</span>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className='w-48'
                          side='bottom'
                          align='end'
                        >
                          <DropdownMenuItem className='focus:bg-violet-600 focus:text-white'>
                            <Link
                              className='flex w-full flex-row'
                              href={`/github/${item.name}`}
                            >
                              <Folder className='mr-2 size-4' />
                              <span>View Project</span>
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  )
                })}
            </ScrollArea>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
