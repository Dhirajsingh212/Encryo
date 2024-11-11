'use client'

import Footer from '@/components/Footer'
import Header from '@/components/header'
import Hero from '@/components/Hero'
import Information from '@/components/Information'
import Pricing from '@/components/Pricing'
import RetroGrid from '@/components/ui/retro-grid'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-cyan-100 to-sky-200 transition-colors duration-500 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900'>
      <Header />
      <main>
        {/* <GridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
          )}
        /> */}
        <RetroGrid angle={180} />
        <Hero />
        <Pricing />
        <Information />
      </main>
      <Footer />
    </div>
  )
}
