import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ProjectDetails } from '@/types/types'
import { AiOutlineMenuUnfold } from 'react-icons/ai'
import AddEnvDialog from './AddEnvDialog'
import { ExportEnvsDialog } from './ExportEnvsDialog'
import { Separator } from './ui/separator'

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
        <Separator />
        {projectDetails && <ExportEnvsDialog projectDetails={projectDetails} />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HomePageCreateMenu
