import {
  getProjectsByUserId,
  getSharedProjectByUserId
} from '@/actions/project'
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
import * as FaIcons from 'react-icons/fa'
import * as MdIcons from 'react-icons/md'
import AddProjectDialog from './AddProjectDialog'
import { fetchUserRepos } from '@/actions/github'
import { ScrollArea } from './ui/scroll-area'

const allIconsObject: any = { ...FaIcons, ...MdIcons }

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
  const userProjects = await getProjectsByUserId(userId)
  const sharedProjects = await getSharedProjectByUserId(userId)

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
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {userProjects &&
              userProjects.map(item => {
                const IconComp = allIconsObject[item.icon]
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={`/home/${item.slug}`}>
                        {IconComp && <IconComp />}
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
                            href={`/home/${item.slug}`}
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
            <SidebarMenuItem>
              <SidebarMenuButton>
                <AddProjectDialog></AddProjectDialog>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
          <SidebarGroupLabel>Shared projects</SidebarGroupLabel>
          <SidebarMenu>
            {sharedProjects && sharedProjects.length === 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span>No records found</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {sharedProjects &&
              sharedProjects.map(item => {
                const IconComp = allIconsObject[item.project.icon]
                return (
                  <SidebarMenuItem key={item.project.name}>
                    <SidebarMenuButton asChild>
                      <Link href={`/shared/${item.project.slug}`}>
                        {IconComp && <IconComp />}
                        <span className='capitalize'>{item.project.name}</span>
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
                            href={`/shared/${item.project.slug}`}
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
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
          <SidebarGroupLabel>Forked projects</SidebarGroupLabel>
          <SidebarMenu>
            <ScrollArea className='h-56'>
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
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
          <SidebarGroupLabel>Github projects</SidebarGroupLabel>
          <SidebarMenu>
            <ScrollArea className='h-56'>
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
