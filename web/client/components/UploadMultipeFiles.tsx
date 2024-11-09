'use client'

import { bulkUploadToDb } from '@/actions/uploadMultiple'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { FileUp, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import Spinner from './Spinner'

export default function UploadMultipeFiles() {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { userId } = useAuth()
  const path = usePathname()
  const { theme } = useTheme()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.dataTransfer.files)])
    }
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFiles(prevFiles => [
        ...prevFiles,
        ...Array.from(e.target.files as FileList)
      ])
    }
  }, [])

  const removeFile = useCallback((fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.name !== fileName))
  }, [])

  const handleUpload = useCallback(async () => {
    try {
      setIsLoading(true)
      if (!userId) {
        showToast('error', 'user not logged in', theme)
        return
      }
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))

      const response = await bulkUploadToDb(
        formData,
        userId,
        path.split('/')[2]
      )
      if (response.success) {
        showToast('success', response.message, theme)
        setFiles([])
      } else {
        showToast('error', response.message, theme)
      }
    } catch (err) {
      showToast('error', 'Failed to bulk upload', theme)
    } finally {
      setIsLoading(false)
    }
  }, [files])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileUp className='size-4 lg:mr-2' />
          <span className='visible max-lg:hidden'>Upload Files</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-4 overflow-hidden rounded-xl border-none bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-2xl max-sm:overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop files or click to select files to upload.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div
            className={`relative rounded-lg border-2 border-dashed p-4 text-center ${
              dragActive ? 'border-primary' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Input
              type='file'
              multiple
              onChange={handleChange}
              className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
              title='Drop files here or click to select'
            />
            <p className='text-sm text-gray-500'>
              Drag &amp; drop files here, or click to select files
            </p>
          </div>
          {files.length > 0 && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Selected Files:</h3>
              <ul className='max-h-[100px] space-y-1 overflow-y-auto text-sm text-gray-500'>
                {files.map((file, index) => (
                  <li key={index} className='flex items-center justify-between'>
                    <span className='truncate'>{file.name}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => removeFile(file.name)}
                      className='h-5 w-5'
                    >
                      <X className='h-4 w-4' />
                      <span className='sr-only'>Remove file</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isLoading}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              `Upload ${files.length} file${files.length > 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
