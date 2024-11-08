'use client'

import {
  addSharedUserToDB,
  removeSharedUserFromProject
} from '@/actions/githubShared'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { showToast } from '@/toast'
import { useAuth } from '@clerk/nextjs'
import { Check, ChevronsUpDown, Trash2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { AccessAlertDialog } from './AccessAlertDialog'
import Spinner from './Spinner'

type ProjectUser = {
  privilege: 'READ' | 'WRITE'
  userTo: {
    clerkUserId: string
    email: string
  }
}

export default function AccessComp({
  users,
  projectId,
  projectUsers
}: {
  users: { email: string; clerkUserId: string }[]
  projectId: string
  projectUsers: ProjectUser[]
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string>('')
  const [userIdTo, setUserIdTo] = useState<string>('')
  const { userId } = useAuth()
  const [selectedAccess, setSelectedAccess] = useState<'read' | 'write'>('read')
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const addUser = async () => {
    try {
      setIsLoading(true)
      if (!userId) {
        showToast('error', 'User not loggedIn', theme)
        return
      }

      if (!userIdTo && !value) {
        showToast('error', 'no user selected', theme)
        return
      }

      if (value && !projectUsers.some(user => user.userTo.email === value)) {
        const response = await addSharedUserToDB({
          fromUserId: userId,
          toUserId: userIdTo,
          projectId: projectId,
          privilege: selectedAccess
        })
        if (response) {
          setValue('')
          setSelectedAccess('read')
          showToast('success', 'user added successfully', theme)
        } else {
          showToast('error', 'failed to add user', theme)
        }
      } else {
        showToast('error', 'Same user cannot be added twice', theme)
        return
      }
    } catch (err) {
      showToast('error', 'Something went wrong', theme)
    } finally {
      setIsLoading(false)
    }
  }

  const removeUser = async (email: string) => {
    try {
      setIsLoading(true)
      const response = await removeSharedUserFromProject(email, projectId)
      if (response) {
        showToast('success', 'user removed successfully', theme)
      } else {
        showToast('error', 'failed to remove user', theme)
      }
    } catch (err) {
      showToast('error', 'Something went wrong', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='h-screen w-full'>
      <CardHeader>
        <CardTitle>Manage Project Users</CardTitle>
        <CardDescription>
          Add users to your project and set their access levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex flex-col gap-4 md:flex-row md:space-x-2'>
          <div className='flex flex-col gap-2 md:flex-row'>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-full justify-between md:w-[300px]'
                >
                  <p className='flex-wrap break-words'>
                    {value
                      ? users.find(user => user.email === value)?.email
                      : 'Select framework...'}
                  </p>
                  <ChevronsUpDown className='ml-1 h-4 w-4 shrink-0 opacity-50 md:ml-2' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[300px] p-0'>
                <Command>
                  <CommandInput placeholder='Search user...' />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {users.map(user => {
                        if (user.clerkUserId !== userId) {
                          return (
                            <CommandItem
                              key={user.email}
                              value={user.email}
                              onSelect={currentValue => {
                                setValue(
                                  currentValue === value ? '' : currentValue
                                )
                                setUserIdTo(user.clerkUserId)
                                setOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  value === user.email
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {user.email}
                            </CommandItem>
                          )
                        }
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Select
              value={selectedAccess}
              onValueChange={(value: 'read' | 'write') =>
                setSelectedAccess(value)
              }
            >
              <SelectTrigger className='w-full md:w-[120px]'>
                <SelectValue placeholder='Access' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='read'>Read</SelectItem>
                <SelectItem value='write'>Write</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AccessAlertDialog addUser={addUser} isLoading={isLoading} />
        </div>
        {projectUsers.length === 0 && (
          <p className='flex w-full flex-row justify-start py-4'>
            No users added
          </p>
        )}
        {projectUsers.length > 0 && (
          <Table className='custom-scrollbar w-full overflow-x-scroll'>
            <TableHeader>
              <TableRow>
                <TableHead>User Email</TableHead>
                <TableHead>Access Level</TableHead>
                <TableHead className='w-[100px]'>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projectUsers.map((user: ProjectUser) => (
                <TableRow key={user.userTo.email}>
                  <TableCell>{user.userTo.email}</TableCell>
                  <TableCell className='capitalize'>{user.privilege}</TableCell>
                  <TableCell>
                    <Button
                      disabled={isLoading}
                      variant='ghost'
                      size='sm'
                      onClick={() => removeUser(user.userTo.clerkUserId)}
                    >
                      {isLoading ? <Spinner /> : <Trash2 className='h-4 w-4' />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
