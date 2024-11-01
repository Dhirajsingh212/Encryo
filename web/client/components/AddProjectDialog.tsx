'use client'
import { addProjectToUser } from '@/actions/project'
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
import { validateLink } from '@/lib/common'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { PlusCircleIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Suspense, useEffect, useState } from 'react'
import slugify from 'slugify'
import IconSuggestionInput from './IconSuggestionInput'

export default function ProjectDialog() {
  const [projectName, setProjectName] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [iconText, setIconText] = useState<string>('')
  const [isDeployed, setIsDeployed] = useState<string>('no')
  const [liveLink, setLiveLink] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()
  const { userId } = useAuth()

  useEffect(() => {
    setSlug(slugify(projectName, { lower: true, strict: true }))
  }, [projectName])

  const submitHandler = async () => {
    try {
      setIsLoading(true)
      if (!userId) {
        showToast('error', 'User not logged In', theme)
        return
      }
      if (isDeployed === 'yes' && !validateLink(liveLink)) {
        showToast('error', 'Link not valid', theme)
        return
      }
      if (!projectName.trim()) {
        showToast('error', 'Project name is required', theme)
        return
      }
      if (!iconText.trim()) {
        showToast('error', 'Icon is required', theme)
        return
      }

      if (projectName.length > 100) {
        showToast('error', 'Max 100 characters for project name', theme)
        return
      }

      const response = await addProjectToUser({
        userId: userId,
        name: projectName,
        slug,
        icon: iconText,
        link: liveLink,
        deployed: isDeployed === 'yes' ? true : false
      })
      if (response) {
        showToast('success', 'Project created.', theme)
        setProjectName('')
        setIsDeployed('no')
        setLiveLink('')
        setIconText('')
        setSlug('')
      } else {
        throw new Error('Something went wrong')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      showToast('error', errorMessage, theme)
    } finally {
      setIsLoading(false)
    }
  }

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
      <DialogContent
        style={{ zIndex: 100 }}
        className='max-h-[90vh] w-[300px] overflow-y-auto rounded-lg border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'
      >
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
              className='col-span-3 border-gray-800'
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
              className='col-span-3 border-gray-800'
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
                className='col-span-3 border-gray-800'
              />
            </div>
          )}
          <div className='grid grid-cols-4 items-start gap-4'>
            <Label htmlFor='slug' className='pt-2 text-right'>
              Icon
            </Label>
            <div className='col-span-3'>
              <Suspense fallback={<div>Loading....</div>}>
                <IconSuggestionInput text={iconText} setText={setIconText} />
              </Suspense>
            </div>
          </div>
        </div>
        <Button disabled={isLoading} type='submit' onClick={submitHandler}>
          Save Project
        </Button>
      </DialogContent>
    </Dialog>
  )
}
