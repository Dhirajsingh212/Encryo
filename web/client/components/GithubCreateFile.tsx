'use client'
import { useEffect, useState } from 'react'
import GithubEnvInputComp from './GithubEnvInputComp'
import MultiStepDialog from './MultiStepDialog'

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

  useEffect(() => {
    setFilteredEnv(projectDetails ? projectDetails.githubEnvs : [])
  }, [projectDetails])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-xl font-semibold'>Config files</p>
        <MultiStepDialog />
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
