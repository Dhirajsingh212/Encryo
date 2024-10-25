import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { auth } from '@clerk/nextjs/server'
import {
  Command,
  Folder,
  Frame,
  LifeBuoy,
  Map,
  MoreHorizontal,
  PieChart,
  PlusCircleIcon,
  Send,
  Share,
  Trash2
} from 'lucide-react'
import AddProjectDialog from './AddProjectDialog'
import { getProjectsByUserId } from '@/actions/project'
import * as FaIcons from 'react-icons/fa'
import * as MdIcons from 'react-icons/md'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send
    }
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '/home/Design',
      icon: Frame
    },
    {
      name: 'Sales & Marketing',
      url: '/home/Sales',
      icon: PieChart
    },
    {
      name: 'Travel',
      url: '/home/Travel',
      icon: Map
    }
  ]
}

const allIconsObject: any = { ...FaIcons, ...MdIcons }

export default async function AppSidebar() {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const userProjects = await getProjectsByUserId(userId)

  return (
    <Sidebar variant='inset'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-violet-600 text-sidebar-primary-foreground'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>Encyro</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {userProjects &&
              userProjects.map(item => {
                const IconComp = allIconsObject[item.icon]
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a href={`/home/${item.slug}`}>
                        {IconComp && <IconComp />}
                        <span>{item.name}</span>
                      </a>
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
                          <Folder className='mr-2 size-4' />
                          <span>View Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='focus:bg-violet-600 focus:text-white'>
                          <Share className='mr-2 size-4' />
                          <span>Share Project</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='focus:bg-violet-600 focus:text-white'>
                          <Trash2 className='mr-2 size-4' />
                          <span>Delete Project</span>
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
            {data.projects.map(item => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
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
                      <Folder className='mr-2 size-4' />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='focus:bg-violet-600 focus:text-white'>
                      <Share className='mr-2 size-4' />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='focus:bg-violet-600 focus:text-white'>
                      <Trash2 className='mr-2 size-4' />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <PlusCircleIcon />
                <span>Add</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
