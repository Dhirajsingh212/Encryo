'use client'

import Footer from '@/components/Footer'
import Header from '@/components/header'
import Hero from '@/components/Hero'
import Information from '@/components/Information'
import Pricing from '@/components/Pricing'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-cyan-100 to-sky-200 transition-colors duration-500 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900'>
      <Header />
      <main>
        <Hero />
        <Pricing />
        <Information />
        {/* <Contact /> */}
      </main>
      <Footer />
    </div>
  )
}
