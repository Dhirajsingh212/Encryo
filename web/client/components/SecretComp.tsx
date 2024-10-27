'use client'
import { deleteEnvById } from '@/actions/saveEnvs'
import HomePageCreateMenu from '@/components/HomePageCreateMenu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showToast } from '@/toast'
import { Envs, ProjectDetails } from '@/types/types'
import { Key, Pencil, Search, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useDebounce } from 'use-debounce'
import EnvInputComp from './EnvInputComp'

const SecretComp = ({
  projectDetails
}: {
  projectDetails: ProjectDetails | null
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()
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
          <HomePageCreateMenu projectDetails={projectDetails} />
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
            return <EnvInputComp key={index} pairs={pairs} index={index} />
          })}
      </div>
    </>
  )
}

export default SecretComp