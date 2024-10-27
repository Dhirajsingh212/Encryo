'use client'
import { Button } from '@/components/ui/button'
import Safari from '@/components/ui/safari'
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
            <Link href='/home'>Add your api keys.</Link>
          </Button>
        </motion.div>
      </section>
      <FeaturesComp />
      <section
        id='demo'
        className='bg-gradient-to-b from-teal-50 to-cyan-100 py-24 dark:from-gray-900 dark:to-blue-900'
      >
        <div className='container mx-auto px-6'>
          <h2 className='mb-12 text-center text-4xl font-bold text-gray-800 dark:text-white'>
            See Encyro in Action
          </h2>
          <div className='flex flex-col items-center lg:flex-row-reverse lg:items-stretch lg:gap-12'>
            <div className='mb-8 w-full lg:mb-0 lg:w-3/5'>
              <div className='relative h-[200px] w-full overflow-hidden rounded-lg transition-transform duration-300 lg:h-[600px] lg:-rotate-2 lg:transform lg:hover:rotate-0'>
                <Safari
                  url='Encyro.com'
                  className='absolute inset-0 h-full w-full shadow-2xl'
                  src='https://i.pinimg.com/originals/df/39/2f/df392fb90619818047bf4f09e0adbc36.gif'
                />
              </div>
            </div>
            <div className='w-full lg:flex lg:w-2/5 lg:flex-col lg:justify-center'>
              <div className='space-y-6 text-center lg:text-left'>
                <h3 className='text-3xl font-bold text-gray-800 dark:text-white'>
                  Secure Your API Keys and Secrets with Ease
                </h3>
                <p className='text-lg text-gray-600 dark:text-gray-300'>
                  Our solution provides a centralized and secure vault for all
                  your sensitive data. Effortlessly manage, rotate, and control
                  access to API keys, tokens, and credentials.
                </p>
                <ul className='space-y-2 text-gray-600 dark:text-gray-300'>
                  <li className='flex items-center justify-center lg:justify-start'>
                    <svg
                      className='mr-2 h-5 w-5 text-green-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Centralized secret management
                  </li>
                  <li className='flex items-center justify-center lg:justify-start'>
                    <svg
                      className='mr-2 h-5 w-5 text-green-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Automated key rotation
                  </li>
                  <li className='flex items-center justify-center lg:justify-start'>
                    <svg
                      className='mr-2 h-5 w-5 text-green-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    Role-based access control
                  </li>
                  <li className='flex items-center justify-center lg:justify-start'>
                    <svg
                      className='mr-2 h-5 w-5 text-green-500'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 13l4 4L19 7'
                      />
                    </svg>
                    End-to-end encryption
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Hero
