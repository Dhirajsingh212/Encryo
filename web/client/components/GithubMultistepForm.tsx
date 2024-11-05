'use client'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { FormData } from '@/types/types'

const GithubMultistepForm = ({
  formData,
  setFormData,
  changeHandler
}: {
  formData: any
  setFormData: any
  changeHandler: any
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <Label>File name</Label>
        <Input
          name='name'
          value={formData.name}
          onChange={changeHandler}
          placeholder='File name'
          className='border-slate-700 bg-slate-900'
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Label>Extension</Label>
        <Input
          value={formData.extension}
          name='extension'
          onChange={changeHandler}
          placeholder='File extension'
          className='border-slate-700 bg-slate-900'
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
          className='min-h-40 resize-none border-slate-700 bg-slate-900'
          placeholder='File content'
        />
      </div>
    </div>
  )
}

export default GithubMultistepForm
