'use client'

import { deleteFileById } from '@/actions/githubFile'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { showToast } from '@/toast'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { FaEdit, FaFileAlt, FaTrash } from 'react-icons/fa'
import GithubContentViewDialog from './GithubContentViewDialog'
import MultiStepDialog from './MultiStepDialog'
import { usePathname } from 'next/navigation'
import { extractZip } from '@/actions/convertZip'
import { useAuth } from '@clerk/nextjs'
import { saveAs } from 'file-saver'
import { ArrowDownToLine } from 'lucide-react'

interface GithubFile {
  id: string
  name: string
  encryptedContent: string
  type: string
  extension: string
}

export default function GithubCreateFile({
  githubFiles = []
}: {
  githubFiles?: GithubFile[]
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()
  const { userId } = useAuth()
  const path = usePathname()

  const deleteHandler = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await deleteFileById(id)
      if (response) {
        showToast('success', 'Deleted successfully', theme)
      } else {
        showToast('error', 'Failed to delete', theme)
      }
    } catch (err) {
      console.log(err)
      showToast('error', 'Failed to delete', theme)
    } finally {
      setIsLoading(false)
    }
  }

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
          <MultiStepDialog />
          <Button onClick={downloadZip}>
            <ArrowDownToLine className='mr-2 size-4' />
            Download
          </Button>
        </div>
      </div>
      <AnimatePresence>
        {githubFiles.map((item: GithubFile, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className='overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg'
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <FaFileAlt className='text-2xl text-primary' />
                    <span className='text-lg font-medium'>
                      {item.name}.{item.extension}
                    </span>
                  </div>
                  <div className='flex space-x-2'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <GithubContentViewDialog
                            content={item.encryptedContent}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View content</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant='ghost' size='icon'>
                            <FaEdit className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={isLoading}
                            onClick={async () => {
                              await deleteHandler(item.id)
                            }}
                            variant='ghost'
                            size='icon'
                          >
                            <FaTrash className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className='mt-4 text-sm text-muted-foreground'
                    >
                      <p>Type: {item.type}</p>
                      <p>Encrypted: Yes</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
