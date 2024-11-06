'use client'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FormData, GithubFile } from '@/types/types'
import { FaEdit } from 'react-icons/fa'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useState } from 'react'
import { showToast } from '@/toast'
import { useTheme } from 'next-themes'
import { useAuth } from '@clerk/nextjs'
import { updateGithubFileById } from '@/actions/githubFile'

const GithubFileEditDialog = ({ item }: { item: GithubFile }) => {
  const { theme } = useTheme()
  const { userId } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    name: item.name,
    content: item.encryptedContent,
    extension: item.extension
  })

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: FormData) => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const submitHandler = async () => {
    try {
      setIsLoading(true)
      if (!userId) {
        showToast('error', 'user not logged in', theme)
        return
      }
      if (
        !formData.name.trim() ||
        !formData.extension.trim() ||
        !formData.content.trim()
      ) {
        showToast('error', 'Fields cannot be empty in step 2', theme)
        return
      }
      const response = await updateGithubFileById(formData, item.id, userId)
      if (response) {
        showToast('success', 'File updated successfully', theme)
      } else {
        showToast('error', 'failed to update file', theme)
      }
    } catch (err) {
      showToast('error', 'Failed to update', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='ghost' size='icon'>
          <FaEdit className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] w-[300px] overflow-y-auto rounded-lg border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl transition-colors duration-300 sm:w-full'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label>File name</Label>
            <Input
              name='name'
              value={formData.name}
              onChange={changeHandler}
              placeholder='File name'
              className='border-slate-700'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Extension</Label>
            <Input
              value={formData.extension}
              name='extension'
              onChange={changeHandler}
              placeholder='File extension'
              className='border-slate-700'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label>Content</Label>
            <Textarea
              value={formData.content}
              onChange={e => {
                setFormData((prev: FormData) => {
                  return {
                    ...prev,
                    content: e.target.value
                  }
                })
              }}
              className='min-h-40 resize-none border-slate-700'
              placeholder='File content'
            />
          </div>
          <Button onClick={submitHandler} disabled={isLoading}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GithubFileEditDialog
