'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LockClosedIcon } from '@radix-ui/react-icons'
import { motion, useAnimation } from 'framer-motion'
import { KeyIcon, ShieldCheckIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import Meteors from './ui/meteors'
import Particles from './ui/particles'

const features = [
  {
    icon: LockClosedIcon,
    title: 'Centralized Secrets Management',
    description:
      'Store all your API keys, tokens, and sensitive data in one secure, centralized vault. Easy to manage, hard to breach.',
    gif: 'https://i.pinimg.com/originals/1c/a7/49/1ca74946ed770bb635e4de4711bd861f.gif'
  },
  {
    icon: KeyIcon,
    title: 'Automatic Key Rotation',
    description:
      'Rotate API keys and secrets automatically, ensuring your sensitive data remains protected without manual intervention.',
    gif: 'https://i.pinimg.com/control/564x/b1/93/3c/b1933ccfa98bf2683087a756c8b90cad.jpg'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Role-Based Access Control',
    description:
      'Control who has access to your secrets with fine-grained permissions. Ensure only authorized users can view or modify sensitive data.',
    gif: 'https://i.pinimg.com/564x/16/7e/16/167e160fda210d0f348fa094d42b9f6a.jpg'
  }
]

export default function FeaturesComp() {
  const [activeFeature, setActiveFeature] = useState(0)
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { top, height } = containerRef.current.getBoundingClientRect()
        const scrollProgress =
          (window.innerHeight - top) / (window.innerHeight + height)
        const newActiveFeature = Math.floor(scrollProgress * features.length)
        setActiveFeature(
          Math.min(Math.max(newActiveFeature, 0), features.length - 1)
        )
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } })
  }, [activeFeature, controls])

  return (
    <section
      id='features'
      className='relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 dark:from-gray-900 dark:to-gray-800'
    >
      <Particles
        className='absolute inset-0'
        quantity={500}
        ease={80}
        color={theme === 'dark' ? '#ffffff' : '#000000'}
        refresh
      />
      <Meteors number={10} />
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl'>
          Ride the Features Wave
        </h2>
        <div ref={containerRef} className='relative'>
          <div className='absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/20 via-primary to-primary/20' />
          <div className='space-y-24 py-12'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='relative flex items-center justify-center'
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={controls}
                  className={`w-full max-w-2xl ${index % 2 === 0 ? 'md:ml-auto md:mr-24' : 'md:ml-24 md:mr-auto'}`}
                >
                  <Card
                    className={`overflow-hidden ${activeFeature === index ? 'ring-2 ring-primary' : ''}`}
                  >
                    <CardContent className='p-6'>
                      <div className='flex flex-col items-center md:flex-row md:items-start'>
                        <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 md:mb-0 md:mr-6'>
                          <feature.icon className='h-8 w-8 text-primary' />
                        </div>
                        <div className='flex-1'>
                          <h3 className='mb-2 text-center text-xl font-semibold text-gray-900 dark:text-white md:text-left'>
                            {feature.title}
                          </h3>
                          <p className='mb-4 text-center text-gray-600 dark:text-gray-300 md:text-left'>
                            {feature.description}
                          </p>
                          <div className='relative aspect-video overflow-hidden rounded-lg'>
                            <img
                              src={feature.gif}
                              alt={feature.title}
                              className='h-full w-full object-cover'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
