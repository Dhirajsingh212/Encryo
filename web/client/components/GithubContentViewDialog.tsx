'use client'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FaEye } from 'react-icons/fa'
import { Button } from './ui/button'
import { useState } from 'react'
import { showToast } from '@/toast'
import { useTheme } from 'next-themes'
import { ScrollArea } from './ui/scroll-area'

const GithubContentViewDialog = ({ content }: { content: string }) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const { theme } = useTheme()

  const handleCopy = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
        showToast('success', 'copied to clipboard', theme)
      })
      .catch(err => console.error('Failed to copy:', err))
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='ghost' size='icon'>
          <FaEye className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] w-[300px] overflow-y-auto rounded-lg border-none bg-gradient-to-br from-slate-900 to-slate-800 pt-10 text-white shadow-2xl transition-colors duration-300 sm:w-full'>
        <ScrollArea className='h-60 rounded-lg border border-slate-700 bg-slate-700 p-2'>
          <p className='no-scrollbar overflow-x-scroll whitespace-pre'>
            {content}
          </p>
        </ScrollArea>
        <Button onClick={handleCopy} className='mt-2'>
          {copySuccess ? 'Copied!' : 'Copy'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default GithubContentViewDialog
