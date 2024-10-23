'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { PlusCircleIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import slugify from 'slugify'

export default function ProjectDialog() {
  const [projectName, setProjectName] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [isDeployed, setIsDeployed] = useState<string>('no')
  const [liveLink, setLiveLink] = useState<string>('')
  const { theme } = useTheme()

  useEffect(() => {
    setSlug(slugify(projectName, { lower: true, strict: true }))
  }, [projectName])

  const submitHandler = () => {}

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className='flex w-full flex-row items-center gap-2'
      >
        <div>
          <PlusCircleIcon className='size-4' />
          <span>Add</span>
        </div>
      </DialogTrigger>
      <DialogContent className='w-[280px] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='projectName' className='text-right'>
              Name
            </Label>
            <Input
              id='projectName'
              placeholder='Name of the project'
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='slug' className='text-right'>
              Slug
            </Label>
            <Input
              id='slug'
              placeholder='slug'
              value={slug}
              readOnly
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='text-right'>Deployed</Label>
            <RadioGroup
              value={isDeployed}
              onValueChange={setIsDeployed}
              className='col-span-3 flex items-center space-x-4'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='yes' id='deployed-yes' />
                <Label htmlFor='deployed-yes'>Yes</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='no' id='deployed-no' />
                <Label htmlFor='deployed-no'>No</Label>
              </div>
            </RadioGroup>
          </div>
          {isDeployed === 'yes' && (
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='liveLink' className='text-right'>
                Live Link
              </Label>
              <Input
                placeholder='https://www.example.com'
                id='liveLink'
                value={liveLink}
                onChange={e => setLiveLink(e.target.value)}
                className='col-span-3'
              />
            </div>
          )}
        </div>
        <Button type='submit' onClick={submitHandler}>
          Save Project
        </Button>
      </DialogContent>
    </Dialog>
  )
}
