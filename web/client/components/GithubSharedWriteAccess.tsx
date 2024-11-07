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
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { PaginationComponent } from './PaginationComponent'
import { Input } from './ui/input'

export default function GithubSharedWriteAccess({
  githubFiles = [],
  access
}: {
  githubFiles?: GithubFile[]
  access: string
}) {
  const [filteredFiles, setFilteredFiles] = useState(githubFiles)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(20)
  const [text, setText] = useState<string>('')
  const [searchText] = useDebounce(text, 400)
  const { theme } = useTheme()
  const { userId } = useAuth()
  const path = usePathname()

  useEffect(() => {
    setFilteredFiles(githubFiles)
  }, [githubFiles])

  useEffect(() => {
    const filteredData = githubFiles.filter(item => {
      return (
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.extension.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setFilteredFiles(filteredData)
  }, [searchText])

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
      <div className='flex flex-col justify-between max-lg:gap-2 lg:flex-row lg:items-center'>
        <h2 className='text-2xl font-semibold'>Config Files</h2>
        <div className='flex flex-row-reverse gap-2 lg:flex-row'>
          <SharedMultiStepDialog />
          {githubFiles.length > 0 && (
            <Button onClick={downloadZip}>
              <ArrowDownToLine className='size-4 sm:mr-2' />
              <span className='visible max-sm:hidden'>Download</span>
            </Button>
          )}
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 transform text-muted-foreground' />
            <Input
              className='w-full bg-card pl-10 outline-none'
              placeholder='Search file...'
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {filteredFiles.length === 0 && <p>No files found.</p>}
        {filteredFiles.map((item: GithubFile, index: number) => (
          <GithubSharedFilesCard
            access={access}
            key={item.id}
            item={item}
            index={index}
          />
        ))}
      </AnimatePresence>
      {filteredFiles.length > 20 && (
        <div>
          <PaginationComponent
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            contentSize={filteredFiles.length}
          />
        </div>
      )}
    </div>
  )
}
