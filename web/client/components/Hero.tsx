'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import FeaturesComp from './Features'

const Hero = () => {
  return (
    <>
      <section className='container mx-auto px-6 pb-20 pt-16 text-center md:py-40'>
        <motion.h1
          className='mb-8 text-3xl font-extrabold text-gray-900 dark:text-white md:text-6xl lg:px-40'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Manage all your API keys and secrets in one place.
        </motion.h1>
        <motion.p
          className='mx-auto mb-12 max-w-2xl text-xl text-gray-600 dark:text-gray-300'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {`"Centralize and securely manage all your API keys and secrets, organized by project for easy access and control!"`}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            asChild
            size='lg'
            className='transform rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 px-8 py-4 text-lg font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:from-teal-600 hover:to-cyan-700'
          >
            <Link href='/forked'>Add your api keys.</Link>
          </Button>
        </motion.div>
      </section>
      <FeaturesComp />
    </>
  )
}

export default Hero
