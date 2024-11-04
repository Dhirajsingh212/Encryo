'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import CreateConfigDialog from './CreateConfigDialog'
import GithubCreateEnvDialog from './GithubCreateEnvDialog'
import GithubEnvInputComp from './GithubEnvInputComp'

interface GithubEnv {
  id: string
  name: string
  value: string
}

interface GithubEnvDetails {
  id: string
  githubEnvs: GithubEnv[]
}

const GithubCreateFile = ({
  projectDetails
}: {
  projectDetails: GithubEnvDetails | null
}) => {
  const [filteredEnv, setFilteredEnv] = useState(
    projectDetails ? projectDetails.githubEnvs : []
  )
  const [selectValue, setSelectValue] = useState<string>('')

  useEffect(() => {
    setFilteredEnv(projectDetails ? projectDetails.githubEnvs : [])
  }, [projectDetails])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-xl'>Create your config files</p>
        <div className='flex flex-row gap-2'>
          <Select
            onValueChange={e => {
              setSelectValue(e)
            }}
          >
            <SelectTrigger className='w-[180px] bg-white shadow-sm dark:bg-slate-950 dark:text-white'>
              <SelectValue placeholder='Select type of file' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='env'>Env</SelectItem>
              <SelectItem value='config'>Config</SelectItem>
            </SelectContent>
          </Select>
          {selectValue === 'env' && <GithubCreateEnvDialog />}
          {selectValue === 'config' && <CreateConfigDialog />}
        </div>
      </div>
      <div className='flex min-h-screen flex-col gap-2'>
        {filteredEnv && filteredEnv.length === 0 && <p>No envs found.</p>}
        {filteredEnv &&
          filteredEnv.map((pairs, index) => {
            return (
              <GithubEnvInputComp key={pairs.id} pairs={pairs} index={index} />
            )
          })}
      </div>
    </div>
  )
}

export default GithubCreateFile
