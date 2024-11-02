'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { showToast } from '@/toast'
import { ProjectDetails } from '@/types/types'
import { useTheme } from 'next-themes'
import { FaFileExport } from 'react-icons/fa'

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
      <DialogTrigger className='flex w-full flex-row items-center gap-2 rounded-sm px-2 py-1 text-start text-sm hover:bg-violet-600 hover:text-white'>
        <FaFileExport />
        Export envs
      </DialogTrigger>
      <DialogContent className='max-w-[280px] rounded-lg border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold'>
            Export Environment Variables
          </DialogTitle>
        </DialogHeader>
        <div className='mt-4'>
          <div className='custom-scrollbar max-h-[400px] max-w-[260px] overflow-scroll rounded-md border-none bg-slate-800 p-4 dark:border-gray-700 dark:bg-gray-800 sm:max-w-[380px]'>
            {projectDetails &&
              projectDetails.envs &&
              projectDetails.envs.map((pairs, index) => (
                <div key={index} className='mb-2 last:mb-0'>
                  <p className='font-mono text-sm'>
                    <span className='text-blue-600 dark:text-blue-400'>
                      {pairs.name}
                    </span>
                    <span className='text-gray-600 dark:text-gray-400'>=</span>
                    <span className='text-green-600 dark:text-green-400'>
                      "{pairs.value}"
                    </span>
                  </p>
                </div>
              ))}
          </div>
        </div>
        <DialogFooter className='mt-6'>
          <Button onClick={handleCopy} className='w-full sm:w-auto'>
            Copy to Clipboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
