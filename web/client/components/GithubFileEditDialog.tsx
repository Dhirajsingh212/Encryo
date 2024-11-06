import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { FormData } from '@/types/types'
import { FaEdit } from 'react-icons/fa'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const GithubFileEditDialog = ({
  formData,
  setFormData,
  changeHandler
}: {
  formData: any
  setFormData: any
  changeHandler: any
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='ghost' size='icon'>
          <FaEdit className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] w-[300px] overflow-y-auto rounded-lg border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'>
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
          <Button>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GithubFileEditDialog
