import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { AiOutlineMenuUnfold } from 'react-icons/ai'
import AddEnvDialog from './AddEnvDialog'
import { ExportEnvsDialog } from './ExportEnvsDialog'
import { ProjectDetails } from '@/types/types'

const HomePageCreateMenu = ({
  projectDetails
}: {
  projectDetails: ProjectDetails | null
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className='my-0 rounded-sm bg-violet-600 px-4 py-2 text-white shadow-lg'>
          <AiOutlineMenuUnfold className='size-4' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-[200px]'>
        <AddEnvDialog />
        {projectDetails && <ExportEnvsDialog projectDetails={projectDetails} />}

        <DropdownMenuItem className='focus:bg-violet-600 focus:text-white'>
          Edit env
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HomePageCreateMenu
