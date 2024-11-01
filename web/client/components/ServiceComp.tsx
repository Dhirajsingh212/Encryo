'use client'

import { addServicesData } from '@/actions/service'
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
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ServiceCard from './ServiceCard'
import { PaginationComponent } from './PaginationComponent'

export default function ServiceComp({ services }: { services: Service[] }) {
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    value: '',
    expDate: '',
    link: ''
  })
  const [start, setStart] = useState<number>(0)
  const [end, setEnd] = useState<number>(20)

  const { theme } = useTheme()
  const path = usePathname()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewService(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (
        newService.name.trim().length <= 0 ||
        newService.name.trim().length > 100
      ) {
        showToast('error', 'name is outof limit.', theme)
        return
      }

      if (
        newService.value.trim().length <= 0 ||
        newService.value.trim().length > 166
      ) {
        showToast('error', 'api key should be less then 100 characters.', theme)
        return
      }

      await addServicesData({
        projectSlug: path.split('/')[2],
        name: newService.name,
        apiKey: newService.value,
        expDate: newService.expDate,
        link: newService.link
      })
      showToast('success', 'Service add successfully', theme)
      setNewService({ name: '', value: '', expDate: '', link: '' })
    } catch (err) {
      console.log(err)
      showToast('error', 'Something went wrong', theme)
    }
  }

  return (
    <>
      <div className='min-h-screen pb-4'>
        <div className='flex flex-row justify-between'>
          <h1 className='mb-4 text-2xl font-bold'>Service Manager</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className='mb-4'>Add New Service</Button>
            </DialogTrigger>
            <DialogContent className='w-[280px] rounded-lg border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white sm:w-full'>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
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
                  Save Service
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {services.length === 0 && <p>No records found.</p>}
          {services.slice(start, end).map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
      <div>
        <PaginationComponent
          start={start}
          end={end}
          setStart={setStart}
          setEnd={setEnd}
          contentSize={services.length}
        />
      </div>
    </>
  )
}
