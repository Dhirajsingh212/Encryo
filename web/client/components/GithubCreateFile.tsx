'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useState } from 'react'
import CreateConfigDialog from './CreateConfigDialog'
import GithubCreateEnvDialog from './GithubCreateEnvDialog'

const GithubCreateFile = () => {
  const [selectValue, setSelectValue] = useState<string>('')
  return (
    <div>
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
          {selectValue === 'env' ? (
            <GithubCreateEnvDialog />
          ) : (
            <CreateConfigDialog />
          )}
        </div>
      </div>
    </div>
  )
}

export default GithubCreateFile
