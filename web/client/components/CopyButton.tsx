'use client'
import { Check, Clipboard } from 'lucide-react'
import { useState } from 'react'
import { Input } from './ui/input'
import { useTheme } from 'next-themes'
import { showToast } from '@/toast'

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    showToast('success', 'Copied to clipboard', theme)
  }

  return (
    <div className='relative w-full'>
      <Input
        className='bg-card pr-12 dark:bg-neutral-900'
        value={text}
        disabled
      />
      <button
        onClick={handleCopy}
        className='absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center gap-1 rounded bg-slate-950 p-2 text-white hover:bg-slate-900'
      >
        {copied ? <Check size={16} /> : <Clipboard size={16} />}
      </button>
    </div>
  )
}
