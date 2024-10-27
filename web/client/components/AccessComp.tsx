'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const users = [
  { email: 'alice@example.com' },
  { email: 'bob@example.com' },
  { email: 'charlie@example.com' },
  { email: 'david@example.com' },
]

type ProjectUser = {
  email: string
  access: 'read' | 'write'
}

export default function AccessComp() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([])
  const [selectedAccess, setSelectedAccess] = useState<'read' | 'write'>('read')

  const addUser = () => {
    if (value && !projectUsers.some(user => user.email === value)) {
      setProjectUsers([...projectUsers, { email: value, access: selectedAccess }])
      setValue("")
      setSelectedAccess('read')
    }
  }

  const removeUser = (email: string) => {
    setProjectUsers(projectUsers.filter(user => user.email !== email))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manage Project Users</CardTitle>
        <CardDescription>Add users to your project and set their access levels.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[300px] justify-between"
              >
                {value
                  ? users.find((user) => user.email === value)?.email
                  : "Select user..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search user..." />
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {users.map((user) => (
                    <CommandItem
                      key={user.email}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === user.email ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {user.email}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Select value={selectedAccess} onValueChange={(value: 'read' | 'write') => setSelectedAccess(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="write">Write</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addUser}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Email</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectUsers.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.access}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => removeUser(user.email)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}