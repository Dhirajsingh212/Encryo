'use client'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FaEye } from 'react-icons/fa'
import { Button } from './ui/button'
import { useState } from 'react'
import { showToast } from '@/toast'
import { useTheme } from 'next-themes'

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
      <DialogContent className='max-h-[90vh] w-[300px] overflow-y-auto rounded-lg border-none bg-slate-950 bg-gradient-to-br pt-10 text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'>
        <p className='no-scrollbar h-60 overflow-scroll whitespace-pre rounded-lg border border-slate-700 bg-slate-700 p-2'>
          {content}
        </p>
        <Button onClick={handleCopy} className='mt-2'>
          {copySuccess ? 'Copied!' : 'Copy'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default GithubContentViewDialog
