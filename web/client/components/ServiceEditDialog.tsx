'use client'

import { updateServiceData } from '@/actions/githubService'
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
import Spinner from './Spinner'

export default function ServiceEditDialog({ services }: { services: Service }) {
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: services.name,
    value: services.value,
    expDate: services.expDate,
    link: services.link
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { theme } = useTheme()
  const path = usePathname()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewService(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await updateServiceData({
        projectSlug: path.split('/')[2],
        name: newService.name,
        value: newService.value,
        expDate: newService.expDate,
        link: newService.link,
        serviceId: services.id
      })
      if (response.success) {
        showToast('success', 'Service updated successfully', theme)
      } else {
        showToast('error', response.message, theme)
      }
    } catch (err) {
      showToast('error', 'Something went wrong', theme)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen className='size-4 cursor-pointer' />
      </DialogTrigger>
      <DialogContent className='flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-4 overflow-hidden rounded-xl border-none bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl max-sm:overflow-y-scroll'>
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
              className='border-slate-800 bg-slate-800'
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
              className='border-slate-800 bg-slate-800'
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
              className='border-slate-800 bg-slate-800'
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
              className='border-slate-800 bg-slate-800'
            />
          </div>
          <Button disabled={isLoading} type='submit' className='self-end'>
            {isLoading ? <Spinner /> : 'Update service'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
