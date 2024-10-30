'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Service {
  id: number
  name: string
  apiKey: string
  expiryDate: string
  link: string
}

export default function ServiceComp() {
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({
    name: '',
    apiKey: '',
    expiryDate: '',
    link: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewService(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulating saving to a database by adding to the state
    const serviceWithId = { ...newService, id: Date.now() }
    setServices(prev => [...prev, serviceWithId])
    setNewService({ name: '', apiKey: '', expiryDate: '', link: '' })
  }

  return (
    <div className='pb-4'>
      <div className='flex flex-row justify-between'>
        <h1 className='mb-4 text-2xl font-bold'>Service Manager</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className='mb-4'>Add New Service</Button>
          </DialogTrigger>
          <DialogContent className='border-none bg-slate-950 bg-gradient-to-br text-white transition-colors duration-300 dark:from-[#1a1625] dark:to-[#231c35] dark:text-white'>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
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
                <Label htmlFor='apiKey'>API Key</Label>
                <Input
                  id='apiKey'
                  name='apiKey'
                  value={newService.apiKey}
                  onChange={handleInputChange}
                  required
                  className='border-slate-800'
                />
              </div>
              <div>
                <Label htmlFor='expiryDate'>Expiry Date</Label>
                <Input
                  id='expiryDate'
                  name='expiryDate'
                  type='date'
                  value={newService.expiryDate}
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
              <Button type='submit'>Save Service</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {services.length === 0 && <p>No records found.</p>}
        {services.map(service => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className='text-xl'>{service.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <span className='text-sm font-bold'>API Key:</span>{' '}
                {service.apiKey}
              </p>
              <p>
                <strong>Expiry Date:</strong> {service.expiryDate}
              </p>
              <p>
                <strong>Link:</strong>{' '}
                <a
                  href={service.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-wrap break-words text-blue-500 hover:underline'
                >
                  {service.link}
                </a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
