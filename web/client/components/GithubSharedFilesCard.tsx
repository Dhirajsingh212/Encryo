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
import { GithubFile } from '@/types/types'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { FaFileAlt, FaTrash } from 'react-icons/fa'
import GithubContentViewDialog from './GithubContentViewDialog'
import GithubSharedFileEditDialog from './GithubSharedFileEditDialog'
import Spinner from './Spinner'

const GithubSharedFilesCard = ({
  item,
  index,
  access
}: {
  item: GithubFile
  index: number
  access: string
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { theme } = useTheme()

  const deleteHandler = async (id: string) => {
    try {
      setIsLoading(true)
      const response = await deleteFileById(id)
      if (response.success) {
        showToast('success', 'Deleted successfully', theme)
      } else {
        showToast('error', response.message, theme)
      }
    } catch (err) {
      console.log(err)
      showToast('error', 'Failed to delete', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
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
                    <GithubContentViewDialog content={item.encryptedContent} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                {access === 'write' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <GithubSharedFileEditDialog item={item} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
              <TooltipProvider>
                {access === 'write' && (
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
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          <FaTrash className='h-4 w-4' />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                )}
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
  )
}

export default GithubSharedFilesCard
