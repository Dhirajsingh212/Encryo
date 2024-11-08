import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Spinner from './Spinner'

export function AccessAlertDialog({
  addUser,
  isLoading
}: {
  addUser: () => void
  isLoading: boolean
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isLoading}>
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <Plus className='mr-2 h-4 w-4' /> Add User
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='border-none bg-slate-950'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-white'>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={addUser}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
