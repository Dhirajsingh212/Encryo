'use client'
import { deleteProjectById } from '@/actions/project'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { showToast } from '@/toast'
import { EllipsisVertical, Trash2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { Button } from './ui/button'

const DeleteProjectDialog = ({
  projectId,
  userId
}: {
  projectId: string
  userId: string
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()

  const deleteHandler = async () => {
    try {
      setIsLoading(true)
      const response = await deleteProjectById(projectId, userId)
      if (response) {
        showToast('success', 'Project Deleted successfully', theme)
      } else {
        showToast('error', 'Failed to delete project', theme)
      }
    } catch (err) {
      showToast('error', 'Something went wrong', theme)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className='size-6' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={deleteHandler}
          disabled={isLoading}
          className='flex flex-row items-center focus:bg-violet-600 focus:text-white'
        >
          <Trash2 className='mr-2 size-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DeleteProjectDialog
