import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'

const CreateConfigDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>
          <Plus className='mr-2 size-4' />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent className='w-full border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white max-lg:max-h-[90%] max-lg:overflow-auto max-sm:w-[280px] max-sm:overflow-x-scroll max-sm:rounded-lg sm:max-w-[425px] md:max-w-[600px] lg:h-[90%] lg:max-w-[800px] xl:max-w-[1000px]'>
        <DialogHeader>
          <DialogTitle>Add file contents</DialogTitle>
        </DialogHeader>
        <form className='flex flex-col space-y-4'>
          <div>
            <Label htmlFor='name'>File Name</Label>
            <Input
              id='name'
              name='name'
              required
              className='border-slate-800'
            />
          </div>
          <div>
            <Label htmlFor='value'>File Content</Label>
            <Textarea
              id='value'
              name='value'
              required
              className='border-slate-800'
            />
          </div>
          <Button type='submit' className='self-end'>
            Create file
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateConfigDialog
