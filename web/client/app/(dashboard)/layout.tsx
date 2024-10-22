import AppSidebar from '@/components/AppSidebar'
import HomeLayoutHeader from '@/components/HomeLayoutHeader'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full bg-card p-4'>
        <HomeLayoutHeader />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout
