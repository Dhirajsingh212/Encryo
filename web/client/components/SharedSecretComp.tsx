'use client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Envs, ProjectDetails } from '@/types/types'
import { Key, Search, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AiOutlineMenuUnfold } from 'react-icons/ai'
import { useDebounce } from 'use-debounce'
import { ExportEnvsDialog } from './ExportEnvsDialog'

const SharedSecretComp = ({
  projectDetails
}: {
  projectDetails: ProjectDetails | null
}) => {
  const [text, setText] = useState<string>('')
  const [filteredEnv, setFilteredEnv] = useState<Envs[]>(
    projectDetails ? projectDetails.envs : []
  )
  const [searchText] = useDebounce(text, 400)

  useEffect(() => {
    const newFilteredArr = projectDetails?.envs.filter(pairs => {
      return pairs.name.toLowerCase().includes(searchText.toLowerCase())
    })
    setFilteredEnv(newFilteredArr || [])
  }, [searchText])

  useEffect(() => {
    const newValueArr = projectDetails ? projectDetails.envs : []
    setFilteredEnv([...newValueArr])
  }, [projectDetails])

  return (
    <>
      <div className='flex flex-col gap-2 md:flex-row md:justify-between'>
        <p className='text-xl font-semibold'>{`Active(${projectDetails ? projectDetails.envs.length : 0})`}</p>
        <div className='flex flex-row justify-end gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className='my-0 rounded-sm bg-violet-600 px-4 py-2 text-white shadow-lg'>
                <AiOutlineMenuUnfold className='size-4' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[200px]'>
              {projectDetails && (
                <ExportEnvsDialog projectDetails={projectDetails} />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
            <Input
              value={text}
              onChange={e => {
                setText(e.target.value)
              }}
              placeholder='Search for secret'
              className='border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
            />
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        {filteredEnv && filteredEnv.length === 0 && <p>No envs found.</p>}
        {filteredEnv &&
          filteredEnv.map((pairs, index) => {
            return (
              <div
                key={index}
                className='flex flex-col items-center gap-2 py-2 md:flex-row'
              >
                <div className='relative w-full'>
                  <User className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    disabled
                    placeholder='Name'
                    value={pairs.name}
                    className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                  />
                </div>
                <div className='relative w-full'>
                  <Key className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400' />
                  <Input
                    disabled
                    placeholder='API KEY'
                    value={pairs.value}
                    className='w-full border-2 bg-card pl-10 pr-4 dark:border-input dark:bg-neutral-900'
                  />
                </div>
              </div>
            )
          })}
      </div>
    </>
  )
}

export default SharedSecretComp
