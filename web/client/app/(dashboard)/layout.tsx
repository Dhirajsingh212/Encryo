import AppSidebar from '@/components/AppSidebar'
import HomeLayoutHeader from '@/components/HomeLayoutHeader'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='min-h-screen w-full bg-gradient-to-br from-violet-100 to-green-100 text-gray-900 transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white'>
        <main className='relative min-h-screen w-full overflow-hidden p-4'>
          <div
            className='pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-300 dark:opacity-100'
            style={{
              background:
                'radial-gradient(circle at top left, rgba(74, 47, 189, 0.2) 0%, transparent 30%), radial-gradient(circle at bottom right, rgba(102, 51, 153, 0.2) 0%, transparent 30%)',
              filter: 'blur(60px)'
            }}
          />
          <div className='relative z-10 w-full'>
            <div className='mb-4'>
              <HomeLayoutHeader />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Layout
