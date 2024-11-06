'use client'

import { extractZip } from '@/actions/convertZip'
import { Button } from '@/components/ui/button'
import { showToast } from '@/toast'
import { GithubFile } from '@/types/types'
import { useAuth } from '@clerk/nextjs'
import { saveAs } from 'file-saver'
import { AnimatePresence } from 'framer-motion'
import { ArrowDownToLine } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import GithubSharedFilesCard from './GithubSharedFilesCard'
import SharedMultiStepDialog from './SharedMultiStepDialog'

export default function GithubSharedWriteAccess({
  githubFiles = [],
  access
}: {
  githubFiles?: GithubFile[]
  access: string
}) {
  const { theme } = useTheme()
  const { userId } = useAuth()
  const path = usePathname()

  const downloadZip = async () => {
    try {
      if (!userId) {
        showToast('error', 'User not logged in', theme)
        return
      }

      const response = await extractZip(userId, path.split('/')[2])

      if (!response) {
        throw new Error('Failed to download zip file')
      }

      const blob = new Blob([new Uint8Array(response)], {
        type: 'application/zip'
      })

      saveAs(blob, 'files.zip')
    } catch (error) {
      console.error('Error downloading zip:', error)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Config Files</h2>
        <div className='flex flex-row gap-2'>
          <SharedMultiStepDialog />
          <Button onClick={downloadZip}>
            <ArrowDownToLine className='size-4 sm:mr-2' />
            <span className='visible max-sm:hidden'>Download</span>
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {githubFiles.length === 0 && <p>No files found.</p>}
        {githubFiles.map((item: GithubFile, index: number) => (
          <GithubSharedFilesCard
            access={access}
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
