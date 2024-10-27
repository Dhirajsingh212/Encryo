'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { showToast } from '@/toast'
import { ProjectDetails } from '@/types/types'
import { useTheme } from 'next-themes'

export function ExportEnvsDialog({
  projectDetails
}: {
  projectDetails: ProjectDetails
}) {
  const { theme } = useTheme()
  const handleCopy = () => {
    if (projectDetails && projectDetails.envs) {
      const envText = projectDetails.envs
        .map(pair => `${pair.name}="${pair.value}"`)
        .join('\n')
      navigator.clipboard.writeText(envText).then(() => {
        showToast(
          'success',
          'Environment variables copied to clipboard!',
          theme
        )
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger className='w-full rounded-sm px-2 py-1 text-start text-sm hover:bg-violet-600 hover:text-white'>
        Export envs
      </DialogTrigger>
      <DialogContent className='max-w-[280px] rounded-lg border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full sm:max-w-[425px]'>
        <div className='grid gap-4 py-4'>
          <div className='custom-scrollbar flex h-[500px] flex-col gap-4 overflow-scroll rounded-lg bg-slate-800 p-4'>
            {projectDetails &&
              projectDetails.envs &&
              projectDetails.envs.map((pairs, index) => (
                <div key={index} className='text-md'>
                  <p className='whitespace-nowrap'>{`${pairs.name}="${pairs.value}"`}</p>
                </div>
              ))}
          </div>
        </div>
        <DialogFooter>
          <Button type='button' onClick={handleCopy}>
            Copy to Clipboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
