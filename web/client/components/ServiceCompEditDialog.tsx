'use client'

import { updateServiceData } from '@/actions/service'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showToast } from '@/toast'
import { Service } from '@/types/types'
import { SquarePen } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function ServiceCompEditDialog({
  services
}: {
  services: Service
}) {
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: services.name,
    value: services.value,
    expDate: services.expDate,
    link: services.link
  })
  const { theme } = useTheme()
  const path = usePathname()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewService(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateServiceData({
        projectSlug: path.split('/')[2],
        name: newService.name,
        value: newService.value,
        expDate: newService.expDate,
        link: newService.link,
        serviceId: services.id
      })
      showToast('success', 'Service updated successfully', theme)
    } catch (err) {
      showToast('error', 'Something went wrong', theme)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen className='size-4 cursor-pointer' />
      </DialogTrigger>
      <DialogContent className='w-[280px] rounded-lg border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'>
        <DialogHeader>
          <DialogTitle>Update service data</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
          <div>
            <Label htmlFor='name'>Service Name</Label>
            <Input
              id='name'
              name='name'
              value={newService.name}
              onChange={handleInputChange}
              required
              className='border-slate-800'
            />
          </div>
          <div>
            <Label htmlFor='value'>API Key</Label>
            <Input
              id='value'
              name='value'
              value={newService.value}
              onChange={handleInputChange}
              required
              className='border-slate-800'
            />
          </div>
          <div>
            <Label htmlFor='expDate'>Expiry Date</Label>
            <Input
              id='expDate'
              name='expDate'
              type='date'
              value={newService.expDate}
              onChange={handleInputChange}
              required
              className='border-slate-800'
            />
          </div>
          <div>
            <Label htmlFor='link'>Link</Label>
            <Input
              id='link'
              name='link'
              type='url'
              value={newService.link}
              onChange={handleInputChange}
              required
              className='border-slate-800'
            />
          </div>
          <Button type='submit' className='self-end'>
            Update service
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
