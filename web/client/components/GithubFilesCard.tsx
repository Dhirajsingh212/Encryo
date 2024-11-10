'use client'

import { deleteFileById } from '@/actions/githubFile'
import { Badge } from '@/components/ui/badge'
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
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { FaFileAlt, FaLock, FaTrash } from 'react-icons/fa'
import GithubContentViewDialog from './GithubContentViewDialog'
import GithubFileEditDialog from './GithubFileEditDialog'
import Spinner from './Spinner'

export default function GithubFilesCard({
  item,
  index
}: {
  item: GithubFile
  index: number
}) {
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
      console.error(err)
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
      className='w-full'
    >
      <Card className='overflow-hidden border-none bg-gradient-to-br from-background/80 to-background backdrop-blur-sm transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/20'>
        <CardContent className='p-6'>
          <motion.div
            className='flex flex-col space-y-4'
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div
              className='flex items-center justify-between'
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <div className='flex items-center space-x-3 overflow-hidden'>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className='rounded-full bg-primary/10 p-2'
                >
                  <FaFileAlt className='size-6 text-primary' />
                </motion.div>
                <div className='flex flex-col'>
                  <span className='max-w-[200px] truncate text-lg font-medium sm:max-w-[300px]'>
                    {item.name.slice(0, 100)}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    .{item.extension}
                  </span>
                </div>
              </div>
              <Badge
                variant='secondary'
                className='hidden items-center space-x-1 sm:flex'
              >
                <FaLock className='size-3' />
                <span>{item.type}</span>
              </Badge>
            </motion.div>

            <motion.div
              className='space-y-2 rounded-md bg-primary/5 p-3 text-sm text-muted-foreground'
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
            >
              <p>Type: {item.type}</p>
              <p>Encrypted: Yes</p>
            </motion.div>

            <motion.div
              className='flex flex-wrap justify-end gap-2'
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <GithubContentViewDialog
                      content={item.encryptedContent}
                    ></GithubContentViewDialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <GithubFileEditDialog item={item}></GithubFileEditDialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit file</p>
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
                      size='sm'
                      className='text-red-500 hover:bg-red-500/10 hover:text-red-700'
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        <FaTrash className='mr-2 h-4 w-4' />
                      )}
                      Delete
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
