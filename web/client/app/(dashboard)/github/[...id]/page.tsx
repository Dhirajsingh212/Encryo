'use client'

import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { createNewGithubProject } from '@/actions/githubProject'
import { useAuth } from '@clerk/nextjs'
import { showToast } from '@/toast'
import { useTheme } from 'next-themes'
import Spinner from '@/components/Spinner'

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { userId } = useAuth()
  const path = usePathname()
  const { theme } = useTheme()

  return (
    <div className='pl-4 pr-0'>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Button
          disabled={isLoading}
          onClick={async () => {
            try {
              setIsLoading(true)
              if (!userId) {
                showToast('error', 'user not logged in', theme)
                return
              }
              const response = await createNewGithubProject(
                userId,
                path.split('/')[2]
              )
              if (response.success) {
                showToast('success', 'successfully added', theme)
                return
              } else {
                showToast('error', response.message, theme)
              }
            } catch (err) {
              showToast('error', 'failed to add', theme)
            } finally {
              setIsLoading(false)
            }
          }}
          className='group relative flex w-full flex-col gap-4 overflow-hidden border border-purple-400/50 bg-gradient-to-br from-purple-600 to-pink-500 py-20 transition-all duration-300 hover:from-purple-500 hover:to-pink-400 lg:h-[565px]'
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className='absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-300/20 opacity-0 group-hover:opacity-100'
          />
          <div className='flex flex-col items-center justify-center gap-2'>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <PlusCircleIcon className='drop-shadow-glow size-10 text-white lg:size-12' />
                <p className='text-xl lg:text-2xl'>Add this to personal</p>
              </>
            )}
          </div>
        </Button>
      </motion.div>
    </div>
  )
}

export default Page
